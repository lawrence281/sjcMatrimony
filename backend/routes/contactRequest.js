const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  sendContactRequest,
  getRequestStatus,
  getMyContactRequests,
  getIncomingContactRequests,
  memberAcceptRequest,
  memberRejectRequest,
  getMyContactRequestStatuses,
  getApprovedContactDetails,
  adminGetAllRequests,
  adminApproveRequest,
  adminRejectRequest,
} = require('../controllers/contactRequestController');

// ─────────────────────────────────────────────
// Member Routes (Require Login Authentication)
// ─────────────────────────────────────────────

// POST   /api/contact-requests/request/:profileId   — Submit contact request (User A -> Pending Member Review)
router.post('/request/:profileId', protect, sendContactRequest);

// GET    /api/contact-requests/status/:profileId    — Get current status of request for profile
router.get('/status/:profileId', protect, getRequestStatus);

// GET    /api/contact-requests/my-requests          — List User A's sent contact requests
router.get('/my-requests', protect, getMyContactRequests);

// GET    /api/contact-requests/incoming             — List User B's incoming contact requests
router.get('/incoming', protect, getIncomingContactRequests);

// PATCH  /api/contact-requests/incoming/:requestId/accept — User B accepts contact request
router.patch('/incoming/:requestId/accept', protect, memberAcceptRequest);

// PATCH  /api/contact-requests/incoming/:requestId/reject — User B rejects contact request
router.patch('/incoming/:requestId/reject', protect, memberRejectRequest);

// GET    /api/contact-requests/my-statuses          — List status map of requested profiles
router.get('/my-statuses', protect, getMyContactRequestStatuses);

// GET    /api/contact-requests/approved-details/:profileId — Securely fetch private contact details if approved
router.get('/approved-details/:profileId', protect, getApprovedContactDetails);

// ─────────────────────────────────────────────
// Admin Routes (Require Admin Privilege)
// ─────────────────────────────────────────────

// GET    /api/contact-requests/admin/all            — Paginated & searchable list for Admin (Pending Admin Verification)
router.get('/admin/all', protect, adminOnly, adminGetAllRequests);

// PATCH  /api/contact-requests/admin/:requestId/approve — Admin approves request
router.patch('/admin/:requestId/approve', protect, adminOnly, adminApproveRequest);

// PATCH  /api/contact-requests/admin/:requestId/reject  — Admin rejects request
router.patch('/admin/:requestId/reject', protect, adminOnly, adminRejectRequest);

module.exports = router;

