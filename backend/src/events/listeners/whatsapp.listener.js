const { appEvents, APP_EVENTS } = require('../eventEmitter');
const whatsappService = require('../../services/whatsapp/whatsapp.service');
const logger = require('../../utils/logger');

/**
 * WhatsApp Event Listener
 * ─────────────────────────────────────────────────────────────────────────────
 * Listens to domain events and dispatches WhatsApp messages asynchronously.
 * This file is imported ONCE at app startup (app.js) and self-registers.
 *
 * Behaviour guarantees:
 *  • Listener is wrapped in try/catch — any failure is logged, never propagated
 *  • Profile creation is NEVER blocked by WhatsApp API status
 *  • All outcomes (success and failure) are logged with structured context
 *
 * Event payload for ADMIN_PROFILE_CREATED:
 *  { userId, phone, name, profileId }
 */
const registerWhatsAppListeners = () => {
  /**
   * Fires when admin creates a new client profile.
   * Sends the onboarding WhatsApp template to the client's phone number.
   */
  appEvents.on(
    APP_EVENTS.ADMIN_PROFILE_CREATED,
    async ({ userId, phone, name, profileId }) => {
      try {
        logger.info(
          `WhatsApp listener triggered [${APP_EVENTS.ADMIN_PROFILE_CREATED}] | User: ${userId} | ProfileID: ${profileId}`
        );

        const result = await whatsappService.sendOnboardingMessage(phone, {
          name,
          profileId,
        });

        if (result.success) {
          logger.info(
            `WhatsApp onboarding sent successfully | ProfileID: ${profileId} | MessageID: ${result.messageId || 'N/A'}`
          );
        } else {
          // Failure is already logged inside whatsappService, add context here
          logger.warn(
            `WhatsApp onboarding not delivered | ProfileID: ${profileId} | Reason: ${result.error} | Retryable: ${!!result.retryable}`
          );
        }
      } catch (error) {
        // Belt-and-suspenders guard: whatsappService.sendOnboardingMessage()
        // should never throw, but we catch here to protect the event loop
        logger.error(
          `WhatsApp listener uncaught error [${APP_EVENTS.ADMIN_PROFILE_CREATED}]: ${error.message}`
        );
      }
    }
  );

  logger.info('WhatsApp event listeners registered.');
};

module.exports = registerWhatsAppListeners;
