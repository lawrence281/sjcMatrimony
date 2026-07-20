const https = require('https');
const logger = require('../../utils/logger');

/**
 * WhatsApp Service (WATI Provider)
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the WATI REST API for WhatsApp Business messaging.
 *
 * Design principles:
 *  • NEVER throws — all failures are caught, logged, and surfaced via return value
 *  • Phone numbers are normalised to E.164 (+91XXXXXXXXXX for Indian numbers)
 *  • Timeout of 8 seconds to prevent hanging the event loop
 *
 * To switch providers (Twilio, 360Dialog, Meta Cloud API):
 *  → Only update sendTemplateMessage() — the rest of the codebase stays the same.
 *
 * Future improvement: replace fire-and-forget with BullMQ job queue for:
 *  → Guaranteed delivery, exponential back-off retries, dead-letter queue
 */

/** WATI API base URL (no trailing slash) */
const getBaseUrl = () => process.env.WATI_API_URL || 'https://live-server.wati.io';

/** WATI Bearer token */
const getToken = () => process.env.WATI_ACCESS_TOKEN || '';

/** Onboarding template name (must be approved in WATI dashboard) */
const ONBOARDING_TEMPLATE = process.env.WATI_ONBOARDING_TEMPLATE || 'onboarding_message';

/** App login URL injected into onboarding message */
const APP_LOGIN_URL = process.env.APP_LOGIN_URL || 'https://app.yourmatrimony.com/login';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalises an Indian phone number to E.164 format required by WhatsApp.
 * Handles 10-digit and already-prefixed numbers.
 *
 * @param {string} phone - Raw phone number (e.g. "9876543210")
 * @returns {string} E.164 number (e.g. "+919876543210")
 */
const normalisePhone = (phone) => {
  if (!phone) return '';
  const cleaned = String(phone).replace(/\D/g, ''); // strip non-digits

  // Already full international number (country code included)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  // 10-digit Indian mobile
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  // Return as-is for other formats (international users, manual input)
  return phone.startsWith('+') ? phone : `+${cleaned}`;
};

/**
 * Makes an HTTPS POST request to the WATI API.
 * Resolves with parsed JSON response or rejects with a descriptive error.
 *
 * @param {string} path - API path (e.g. "/api/v1/sendTemplateMessage/+91...")
 * @param {Object} body - Request payload
 * @returns {Promise<Object>} Parsed response body
 */
const watiPost = (path, body) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const baseUrl = new URL(getBaseUrl());

    const options = {
      hostname: baseUrl.hostname,
      port: baseUrl.port || 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${getToken()}`,
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, ...parsed });
          } else {
            reject(Object.assign(new Error(`WATI API error [${res.statusCode}]`), {
              statusCode: res.statusCode,
              response: parsed,
              retryable: res.statusCode >= 500 || res.statusCode === 429,
            }));
          }
        } catch {
          reject(new Error(`WATI response parse error: ${data}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(Object.assign(new Error('WATI API request timed out'), { retryable: true }));
    });

    req.on('error', (err) => {
      reject(Object.assign(err, { retryable: true }));
    });

    req.write(payload);
    req.end();
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const whatsappService = {
  /**
   * Validates that required environment variables are configured.
   * Called once at app startup from app.js.
   */
  init() {
    if (!getToken()) {
      logger.warn('WhatsApp service: WATI_ACCESS_TOKEN is not set. Messages will not be sent.');
    } else if (!getBaseUrl()) {
      logger.warn('WhatsApp service: WATI_API_URL is not set.');
    } else {
      logger.info('WhatsApp service (WATI) initialised.');
    }
  },

  /**
   * Sends a WATI pre-approved template message to a phone number.
   *
   * @param {string}   phone          - Recipient phone (raw or E.164)
   * @param {string}   templateName   - WATI-approved template name
   * @param {Array<{name: string, value: string}>} parameters - Template variables
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendTemplateMessage(phone, templateName, parameters = []) {
    if (!getToken()) {
      logger.warn('WhatsApp: skipping message — WATI_ACCESS_TOKEN not configured.');
      return { success: false, error: 'WhatsApp provider not configured.' };
    }

    const e164Phone = normalisePhone(phone);
    if (!e164Phone) {
      logger.warn('WhatsApp: skipping message — invalid phone number provided.');
      return { success: false, error: 'Invalid phone number.' };
    }

    const path = `/api/v1/sendTemplateMessage/${encodeURIComponent(e164Phone)}`;
    const body = {
      template_name: templateName,
      broadcast_name: `admin_${templateName}_${Date.now()}`,
      parameters,
    };

    try {
      const response = await watiPost(path, body);
      logger.info(
        `WhatsApp [SENT] | Phone: ${e164Phone} | Template: ${templateName} | MessageID: ${response.messageId || 'N/A'}`
      );
      return { success: true, messageId: response.messageId };
    } catch (error) {
      logger.error(
        `WhatsApp [FAILED] | Phone: ${e164Phone} | Template: ${templateName} | Error: ${error.message} | Retryable: ${!!error.retryable}`
      );
      return {
        success: false,
        error: error.message,
        retryable: !!error.retryable,
      };
    }
  },

  /**
   * Sends the standard onboarding WhatsApp message to a newly created client.
   * Uses the WATI_ONBOARDING_TEMPLATE environment variable.
   *
   * @param {string} phone        - Recipient phone number
   * @param {Object} options
   * @param {string} options.name      - Full name of the user
   * @param {string} options.profileId - Display profile ID (e.g. MAT-00001)
   * @param {string} [options.loginUrl] - App login URL (falls back to APP_LOGIN_URL env var)
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendOnboardingMessage(phone, { name, profileId, loginUrl }) {
    const parameters = [
      { name: 'name', value: name },
      { name: 'profile_id', value: profileId },
      { name: 'login_url', value: loginUrl || APP_LOGIN_URL },
    ];

    return this.sendTemplateMessage(phone, ONBOARDING_TEMPLATE, parameters);
  },
};

module.exports = whatsappService;
