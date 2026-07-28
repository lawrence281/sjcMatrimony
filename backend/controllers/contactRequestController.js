const ContactRequest = require('../models/ContactRequest');
const UserProfile = require('../models/UserProfile');

// Status codes constants
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

// ─────────────────────────────────────────────
// 1. POST /api/contact-requests/request/:profileId
// Member sends a request to view contact details
// ─────────────────────────────────────────────
const sendContactRequest = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Check if target profile exists
    let profile = await UserProfile.findById(profileId);
    if (!profile) {
      profile = await UserProfile.findOne({ userId: profileId });
    }

    if (!profile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Target member profile not found.',
      });
    }

    // Prevent user from requesting their own profile
    if (profile.userId.toString() === req.user._id.toString()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: 'You cannot request contact details for your own profile.',
      });
    }

    // Check for existing request
    let existingRequest = await ContactRequest.findOne({
      requestedBy: req.user._id,
      requestedProfile: profile._id,
    });

    if (existingRequest) {
      if (existingRequest.status === 'Pending') {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'Contact request is already pending admin review.',
          request: existingRequest,
        });
      }

      if (existingRequest.status === 'Approved') {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'Contact request has already been approved.',
          request: existingRequest,
        });
      }

      // If previously rejected, block resubmission according to business rules
      if (existingRequest.status === 'Rejected') {
        return res.status(FORBIDDEN).json({
          success: false,
          message: 'Contact request for this profile was rejected by administration and cannot be re-requested.',
        });
      }
    }

    // Create new ContactRequest
    const newRequest = await ContactRequest.create({
      requestedBy: req.user._id,
      requestedProfile: profile._id,
      status: 'Pending',
    });

    return res.status(CREATED).json({
      success: true,
      message: 'Contact request submitted successfully for admin review.',
      request: newRequest,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 2. GET /api/contact-requests/status/:profileId
// Check status of contact request for a specific profile
// ─────────────────────────────────────────────
const getRequestStatus = async (req, res) => {
  try {
    const { profileId } = req.params;

    let profile = await UserProfile.findById(profileId);
    if (!profile) {
      profile = await UserProfile.findOne({ userId: profileId });
    }

    if (!profile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Target member profile not found.',
      });
    }

    const request = await ContactRequest.findOne({
      requestedBy: req.user._id,
      requestedProfile: profile._id,
    });

    // If request was Rejected, hide it from client view
    if (request && request.status === 'Rejected') {
      return res.status(OK).json({
        success: true,
        hasRequest: false,
        status: 'None',
        request: null,
      });
    }

    return res.status(OK).json({
      success: true,
      hasRequest: !!request,
      status: request ? request.status : 'None',
      request: request || null,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 3. GET /api/contact-requests/my-requests
// Get all requests sent by logged in user (Automatically excludes Rejected requests)
// ─────────────────────────────────────────────
const getMyContactRequests = async (req, res) => {
  try {
    const { status } = req.query;

    // Exclude Rejected requests for client user
    const query = { 
      requestedBy: req.user._id,
      status: { $ne: 'Rejected' }
    };

    if (status && ['Pending', 'Approved'].includes(status)) {
      query.status = status;
    } else if (status === 'Rejected') {
      return res.status(OK).json({
        success: true,
        count: 0,
        requests: [],
      });
    }

    const rawRequests = await ContactRequest.find(query)
      .populate({
        path: 'requestedProfile',
        select:
          'firstName lastName profileImage gender denomination diocese occupation workLocation city state email mobileNumber address churchAddress',
      })
      .sort({ createdAt: -1 });

    // Filter out any populated profiles that might be null or deleted
    const requests = rawRequests.filter((r) => r.requestedProfile != null);

    return res.status(OK).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 3.5. GET /api/contact-requests/my-statuses
// Return map of requestedProfileId -> status for logged in user
// ─────────────────────────────────────────────
const getMyContactRequestStatuses = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ requestedBy: req.user._id })
      .select('requestedProfile status');

    const statusMap = {};
    requests.forEach((r) => {
      if (r.requestedProfile) {
        statusMap[r.requestedProfile.toString()] = r.status;
      }
    });

    return res.status(OK).json({
      success: true,
      statuses: statusMap,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 4. GET /api/contact-requests/approved-details/:profileId
// Secure endpoint: Return private contact details ONLY if request status is Approved
// ─────────────────────────────────────────────
const getApprovedContactDetails = async (req, res) => {
  try {
    const { profileId } = req.params;

    let profile = await UserProfile.findById(profileId);
    if (!profile) {
      profile = await UserProfile.findOne({ userId: profileId });
    }

    if (!profile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Member profile not found.',
      });
    }

    // Security check: Must have an APPROVED request
    const approvedRequest = await ContactRequest.findOne({
      requestedBy: req.user._id,
      requestedProfile: profile._id,
      status: 'Approved',
    });

    if (!approvedRequest) {
      return res.status(FORBIDDEN).json({
        success: false,
        message:
          'Unauthorized access. Private contact details can only be viewed after admin approval.',
      });
    }

    // Safe payload with contact details
    const contactDetails = {
      profileId: profile._id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: profile.profileImage,
      mobileNumber: profile.mobileNumber || 'Not provided',
      email: profile.email || 'Not provided',
      address: profile.address || 'Not provided',
      churchAddress: profile.churchAddress || 'Not provided',
      church: profile.church || 'Not provided',
      diocese: profile.diocese || 'Not provided',
      denomination: profile.denomination || 'Not provided',
      occupation: profile.occupation || 'Not provided',
      workLocation: profile.workLocation || 'Not provided',
      nativePlace: profile.nativePlace || 'Not provided',
      approvedAt: approvedRequest.approvalDate || approvedRequest.updatedAt,
      adminRemarks: approvedRequest.adminRemarks || '',
    };

    return res.status(OK).json({
      success: true,
      contactDetails,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 5. GET /api/contact-requests/admin/all  (Admin Only)
// Paginated, searchable, filterable contact requests list for Admin
// ─────────────────────────────────────────────
const adminGetAllRequests = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'All' && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let requests = await ContactRequest.find(query)
      .populate('requestedBy', 'name email phone')
      .populate(
        'requestedProfile',
        'firstName lastName profileImage mobileNumber email denomination diocese occupation city state'
      )
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // In-memory search filtering for populated user and profile names if search param provided
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      requests = requests.filter((reqItem) => {
        const uName = (reqItem.requestedBy?.name || '').toLowerCase();
        const uEmail = (reqItem.requestedBy?.email || '').toLowerCase();
        const pFirst = (reqItem.requestedProfile?.firstName || '').toLowerCase();
        const pLast = (reqItem.requestedProfile?.lastName || '').toLowerCase();
        const pFull = `${pFirst} ${pLast}`;

        return (
          uName.includes(q) || uEmail.includes(q) || pFirst.includes(q) || pLast.includes(q) || pFull.includes(q)
        );
      });
    }

    const totalResults = requests.length;
    const totalPages = Math.ceil(totalResults / limitNum) || 1;
    const paginatedRequests = requests.slice(skip, skip + limitNum);

    return res.status(OK).json({
      success: true,
      count: paginatedRequests.length,
      totalResults,
      totalPages,
      currentPage: pageNum,
      requests: paginatedRequests,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 6. PATCH /api/contact-requests/admin/:requestId/approve (Admin Only)
// ─────────────────────────────────────────────
const adminApproveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminRemarks } = req.body;

    const request = await ContactRequest.findById(requestId)
      .populate('requestedBy', 'name email')
      .populate('requestedProfile', 'firstName lastName');

    if (!request) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Contact request record not found.',
      });
    }

    request.status = 'Approved';
    request.approvalDate = new Date();
    request.approvedBy = req.user._id;
    if (adminRemarks !== undefined) {
      request.adminRemarks = adminRemarks;
    }

    await request.save();

    return res.status(OK).json({
      success: true,
      message: 'Contact request approved successfully.',
      request,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 7. PATCH /api/contact-requests/admin/:requestId/reject (Admin Only)
// ─────────────────────────────────────────────
const adminRejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminRemarks } = req.body;

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Contact request record not found.',
      });
    }

    request.status = 'Rejected';
    request.approvedBy = req.user._id;
    request.adminRemarks = adminRemarks || 'Request rejected by administrative security team.';

    await request.save();

    return res.status(OK).json({
      success: true,
      message: 'Contact request rejected successfully.',
      request,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendContactRequest,
  getRequestStatus,
  getMyContactRequests,
  getMyContactRequestStatuses,
  getApprovedContactDetails,
  adminGetAllRequests,
  adminApproveRequest,
  adminRejectRequest,
};
