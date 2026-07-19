const PROFILE_STATUS = Object.freeze({
  PENDING: 'pending',       // Newly registered, awaiting approval
  APPROVED: 'approved',     // Approved by admin, visible in search
  ACTIVE: 'active',         // Profile fully set up and active
  SUSPENDED: 'suspended',   // Temporarily suspended
  BANNED: 'banned',         // Permanently banned
  INCOMPLETE: 'incomplete', // Registration started but not completed
  DELETED: 'deleted',       // Soft deleted
});

module.exports = { PROFILE_STATUS };
