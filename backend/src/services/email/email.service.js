const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const logger = require('../../utils/logger');

/**
 * Email Service
 * Provider-agnostic. To switch providers (SendGrid, SES, Resend),
 * only update createTransport() — the send API stays the same.
 */

let transporter;

/**
 * Initialises the nodemailer transporter.
 * Called once at startup. Verifies SMTP connection in development.
 */
const initEmailService = async () => {
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    try {
      await transporter.verify();
      logger.info('Email service connected successfully.');
    } catch (err) {
      logger.warn(`Email service not connected (dev mode): ${err.message}`);
    }
  }
};

/**
 * Reads an email HTML template from disk and replaces {{variables}}.
 * @param {string} templateName - Template filename without extension
 * @param {Object} variables - Key-value pairs for {{placeholder}} replacement
 * @returns {string} Rendered HTML
 */
const renderTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(
    __dirname,
    '../../emails/templates',
    `${templateName}.html`
  );

  let html;
  try {
    html = fs.readFileSync(templatePath, 'utf-8');
  } catch {
    // Fallback to plain text if template not found
    logger.warn(`Email template "${templateName}" not found. Using plain text.`);
    return Object.entries(variables)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
  }

  return Object.entries(variables).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, html);
};

/**
 * Sends an email.
 * @param {Object} options
 * @param {string}   options.to          - Recipient email
 * @param {string}   options.subject     - Email subject
 * @param {string}   options.template    - Template name (without .html)
 * @param {Object}   options.variables   - Template variables
 * @param {string}   [options.text]      - Plain text fallback
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, template, variables = {}, text }) => {
  if (!transporter) {
    await initEmailService();
  }

  const html = template ? renderTemplate(template, variables) : undefined;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Matrimony'}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text: text || 'Please view this email in an HTML-compatible email client.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} | Subject: ${subject} | ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    // Don't throw — email failure should not break the main flow (non-blocking)
  }
};

// ── Convenience wrappers ───────────────────────────────────

const sendOtpEmail = async ({ to, name, otp, purpose }) => {
  const subjects = {
    email_verification: 'Verify Your Email — Matrimony Platform',
    password_reset:     'Password Reset OTP — Matrimony Platform',
    login:              'Login OTP — Matrimony Platform',
  };

  await sendEmail({
    to,
    subject: subjects[purpose] || 'Your OTP — Matrimony Platform',
    template: 'otpVerification',
    variables: {
      name:    name || 'User',
      otp,
      purpose: purpose === 'email_verification' ? 'verify your email' : 'complete your request',
      expiryMinutes: '10',
      year:    new Date().getFullYear(),
    },
  });
};

const sendWelcomeEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    subject: 'Welcome to Matrimony Platform! 💍',
    template: 'welcome',
    variables: { name, year: new Date().getFullYear() },
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  await sendEmail({
    to,
    subject: 'Reset Your Password — Matrimony Platform',
    template: 'passwordReset',
    variables: { name, resetUrl, year: new Date().getFullYear() },
  });
};

const sendInterestNotificationEmail = async ({ to, senderName, receiverName }) => {
  await sendEmail({
    to,
    subject: `${senderName} sent you an interest! 💌`,
    template: 'interestReceived',
    variables: { receiverName, senderName, year: new Date().getFullYear() },
  });
};

module.exports = {
  initEmailService,
  sendEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendInterestNotificationEmail,
};
