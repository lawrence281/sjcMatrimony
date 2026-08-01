const ContactRequest = require('../models/ContactRequest');
const UserProfile = require('../models/UserProfile');

// Status codes constants
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

// Helper: Calculate age from Date of Birth
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ─────────────────────────────────────────────
// 1. POST /api/contact-requests/request/:profileId
// User A sends a request to User B to view contact details
// Initial status: "Pending Member Review"
// ─────────────────────────────────────────────
const sendContactRequest = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Check if target profile (User B's profile) exists
    let targetProfile = await UserProfile.findById(profileId);
    if (!targetProfile) {
      targetProfile = await UserProfile.findOne({ userId: profileId });
    }

    if (!targetProfile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Target member profile not found.',
      });
    }

    // Prevent user from requesting their own profile
    if (targetProfile.userId.toString() === req.user._id.toString()) {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: 'You cannot request contact details for your own profile.',
      });
    }

    // Prevent requesting if target profile is already taken (Approved connection with another member)
    const targetUserId = targetProfile.userId && targetProfile.userId._id ? targetProfile.userId._id : targetProfile.userId;
    const targetTaken = await ContactRequest.findOne({
      status: 'Approved',
      $or: [
        { requestedProfile: targetProfile._id },
        { requestedBy: targetUserId },
        { receiverUser: targetUserId },
      ],
    });

    if (targetTaken) {
      return res.status(BAD_REQUEST).json({
        success: false,
        isTaken: true,
        message: 'This member is already connected with another profile (Already Taken).',
      });
    }

    // Check for existing request from User A to User B
    const existingRequest = await ContactRequest.findOne({
      requestedBy: req.user._id,
      requestedProfile: targetProfile._id,
    });

    if (existingRequest) {
      if (existingRequest.status === 'Pending' || existingRequest.status === 'Pending Admin Verification' || existingRequest.status === 'Pending Member Review') {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'Contact request is currently pending Admin approval.',
          request: existingRequest,
        });
      }

      if (existingRequest.status === 'Approved') {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: 'Contact request has already been approved by Admin.',
          request: existingRequest,
        });
      }

      if (existingRequest.status === 'Rejected' || existingRequest.status === 'Rejected by Admin' || existingRequest.status === 'Rejected by Member') {
        return res.status(FORBIDDEN).json({
          success: false,
          message: 'Request Rejected by Admin',
        });
      }
    }

    // Create new ContactRequest with initial status 'Pending' (Admin Approval)
    const newRequest = await ContactRequest.create({
      requestedBy: req.user._id,
      requestedProfile: targetProfile._id,
      receiverUser: targetProfile.userId,
      status: 'Pending',
    });

    return res.status(CREATED).json({
      success: true,
      message: 'Contact request submitted successfully. Awaiting Admin approval.',
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
// Check relationship status between logged in user and target profile
// ─────────────────────────────────────────────
const getRequestStatus = async (req, res) => {
  try {
    const { profileId } = req.params;

    let targetProfile = await UserProfile.findById(profileId);
    if (!targetProfile) {
      targetProfile = await UserProfile.findOne({ userId: profileId });
    }

    if (!targetProfile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Target member profile not found.',
      });
    }

    // Check request where logged in user is either sender (requestedBy) or receiver (targetProfile)
    const request = await ContactRequest.findOne({
      $or: [
        { requestedBy: req.user._id, requestedProfile: targetProfile._id },
        { requestedBy: targetProfile.userId, receiverUser: req.user._id },
      ],
    }).sort({ createdAt: -1 });

    if (request && request.status === 'Approved') {
      return res.status(OK).json({
        success: true,
        hasRequest: true,
        status: 'Approved',
        request,
      });
    }

    // Check if target profile has an Approved request with someone else (Already Taken)
    const targetUserId = targetProfile.userId && targetProfile.userId._id ? targetProfile.userId._id : targetProfile.userId;
    const targetTaken = await ContactRequest.findOne({
      status: 'Approved',
      $or: [
        { requestedProfile: targetProfile._id },
        { requestedBy: targetUserId },
        { receiverUser: targetUserId },
      ],
    });

    if (targetTaken) {
      return res.status(OK).json({
        success: true,
        hasRequest: false,
        isTaken: true,
        status: 'Already Taken',
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
// Get all requests sent by User A (User A view - excludes Accept/Reject buttons)
// ─────────────────────────────────────────────
const getMyContactRequests = async (req, res) => {
  try {
    const rawRequests = await ContactRequest.find({
      requestedBy: req.user._id,
    })
      .populate({
        path: 'requestedProfile',
        select:
          'firstName lastName profileImage gender denomination diocese occupation workLocation city state email mobileNumber address churchAddress dateOfBirth',
      })
      .sort({ createdAt: -1 });

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
// 4. GET /api/contact-requests/incoming
// Get all requests received by User B
// Displays Sender Photo, Name, Age, Diocese, Occupation, Date
// ─────────────────────────────────────────────
const getIncomingContactRequests = async (req, res) => {
  try {
    const myProfile = await UserProfile.findOne({ userId: req.user._id });

    const query = {
      $or: [
        { receiverUser: req.user._id },
        ...(myProfile ? [{ requestedProfile: myProfile._id }] : []),
      ],
      requestedBy: { $ne: req.user._id },
    };

    const rawRequests = await ContactRequest.find(query)
      .populate('requestedBy', 'name email phone')
      .sort({ createdAt: -1 });

    const requestsWithSenderProfile = await Promise.all(
      rawRequests.map(async (requestItem) => {
        const itemObj = requestItem.toObject();
        if (requestItem.requestedBy) {
          const senderProfile = await UserProfile.findOne({
            userId: requestItem.requestedBy._id,
          }).select(
            'firstName lastName profileImage dateOfBirth diocese occupation city state denomination'
          );

          if (senderProfile) {
            itemObj.senderDetails = {
              profileId: senderProfile._id,
              firstName: senderProfile.firstName || requestItem.requestedBy.name,
              lastName: senderProfile.lastName || '',
              fullName: `${senderProfile.firstName || ''} ${senderProfile.lastName || ''}`.trim() || requestItem.requestedBy.name,
              profileImage: senderProfile.profileImage || '',
              age: calculateAge(senderProfile.dateOfBirth),
              diocese: senderProfile.diocese || 'Not specified',
              occupation: senderProfile.occupation || 'Not specified',
              city: senderProfile.city || '',
              state: senderProfile.state || '',
              ...(requestItem.status === 'Approved'
                ? {
                  phone: senderProfile.mobileNumber || requestItem.requestedBy.phone || 'Not provided',
                  email: senderProfile.email || requestItem.requestedBy.email || 'Not provided',
                }
                : {}),
            };
          } else {
            itemObj.senderDetails = {
              profileId: null,
              firstName: requestItem.requestedBy.name,
              lastName: '',
              fullName: requestItem.requestedBy.name,
              profileImage: '',
              age: null,
              diocese: 'Not specified',
              occupation: 'Not specified',
              city: '',
              state: '',
              ...(requestItem.status === 'Approved'
                ? {
                  phone: requestItem.requestedBy.phone || 'Not provided',
                  email: requestItem.requestedBy.email || 'Not provided',
                }
                : {}),
            };
          }
        }
        return itemObj;
      })
    );

    return res.status(OK).json({
      success: true,
      count: requestsWithSenderProfile.length,
      requests: requestsWithSenderProfile,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 5. PATCH /api/contact-requests/incoming/:requestId/accept
// User B clicks Accept -> Updates status to "Pending Admin Verification"
// ─────────────────────────────────────────────
const memberAcceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ContactRequest.findById(requestId);
    if (!request) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Contact request not found.',
      });
    }

    const myProfile = await UserProfile.findOne({ userId: req.user._id });
    const isAuthorized =
      (request.receiverUser && request.receiverUser.toString() === req.user._id.toString()) ||
      (myProfile && request.requestedProfile.toString() === myProfile._id.toString());

    if (!isAuthorized) {
      return res.status(FORBIDDEN).json({
        success: false,
        message: 'Unauthorized. Only the request receiver can accept this request.',
      });
    }

    if (request.status !== 'Pending Member Review' && request.status !== 'Pending') {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: `Request is already in '${request.status}' status.`,
      });
    }

    // Check if User B has ALREADY accepted another request or has an approved request
    const existingActiveConnection = await ContactRequest.findOne({
      _id: { $ne: request._id },
      status: { $in: ['Pending Admin Verification', 'Approved', 'Pending'] },
      $or: [
        { receiverUser: req.user._id },
        { requestedBy: req.user._id },
        ...(myProfile ? [{ requestedProfile: myProfile._id }] : []),
      ],
    });

    if (existingActiveConnection) {
      return res.status(BAD_REQUEST).json({
        success: false,
        isTaken: true,
        message: 'You have already accepted another contact request or are already connected with a member.',
      });
    }

    request.status = 'Pending Admin Verification';
    request.memberActionDate = new Date();
    await request.save();

    return res.status(OK).json({
      success: true,
      message: 'Request accepted! Forwarded to Admin for verification.',
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
// 6. PATCH /api/contact-requests/incoming/:requestId/reject
// User B clicks Reject -> Updates status to "Rejected by Member"
// ─────────────────────────────────────────────
const memberRejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ContactRequest.findById(requestId);
    if (!request) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Contact request not found.',
      });
    }

    const myProfile = await UserProfile.findOne({ userId: req.user._id });
    const isAuthorized =
      (request.receiverUser && request.receiverUser.toString() === req.user._id.toString()) ||
      (myProfile && request.requestedProfile.toString() === myProfile._id.toString());

    if (!isAuthorized) {
      return res.status(FORBIDDEN).json({
        success: false,
        message: 'Unauthorized. Only the request receiver can reject this request.',
      });
    }

    if (request.status !== 'Pending Member Review' && request.status !== 'Pending') {
      return res.status(BAD_REQUEST).json({
        success: false,
        message: `Request is already in '${request.status}' status.`,
      });
    }

    // Check if User B has ALREADY accepted another request or has an approved request
    const existingActiveConnection = await ContactRequest.findOne({
      _id: { $ne: request._id },
      status: { $in: ['Pending Admin Verification', 'Approved', 'Pending'] },
      $or: [
        { receiverUser: req.user._id },
        { requestedBy: req.user._id },
        ...(myProfile ? [{ requestedProfile: myProfile._id }] : []),
      ],
    });

    if (existingActiveConnection) {
      return res.status(BAD_REQUEST).json({
        success: false,
        isTaken: true,
        message: 'You have already accepted another contact request.',
      });
    }

    request.status = 'Rejected by Member';
    request.memberActionDate = new Date();
    await request.save();

    return res.status(OK).json({
      success: true,
      message: 'Request rejected.',
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
// 7. GET /api/contact-requests/my-statuses
// Status map for requested profiles
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
// 8. GET /api/contact-requests/approved-details/:profileId
// Return contact details ONLY if request status is Approved (Reciprocal check)
// ─────────────────────────────────────────────
const getApprovedContactDetails = async (req, res) => {
  try {
    const { profileId } = req.params;

    let targetProfile = await UserProfile.findById(profileId);
    if (!targetProfile) {
      targetProfile = await UserProfile.findOne({ userId: profileId });
    }

    if (!targetProfile) {
      return res.status(NOT_FOUND).json({
        success: false,
        message: 'Member profile not found.',
      });
    }

    // Security check: Must have an APPROVED request (either User A requested User B or vice versa)
    const approvedRequest = await ContactRequest.findOne({
      $or: [
        { requestedBy: req.user._id, requestedProfile: targetProfile._id },
        { requestedBy: targetProfile.userId, receiverUser: req.user._id },
      ],
      status: 'Approved',
    });

    if (!approvedRequest) {
      return res.status(FORBIDDEN).json({
        success: false,
        message:
          'Unauthorized access. Private contact details can only be viewed after admin approval.',
      });
    }

    const contactDetails = {
      profileId: targetProfile._id,
      firstName: targetProfile.firstName,
      lastName: targetProfile.lastName,
      profileImage: targetProfile.profileImage,
      mobileNumber: targetProfile.mobileNumber || 'Not provided',
      email: targetProfile.email || 'Not provided',
      address: targetProfile.address || 'Not provided',
      churchAddress: targetProfile.churchAddress || 'Not provided',
      church: targetProfile.church || 'Not provided',
      diocese: targetProfile.diocese || 'Not provided',
      denomination: targetProfile.denomination || 'Not provided',
      occupation: targetProfile.occupation || 'Not provided',
      workLocation: targetProfile.workLocation || 'Not provided',
      nativePlace: targetProfile.nativePlace || 'Not provided',
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
// 9. GET /api/contact-requests/admin/all  (Admin Only)
// Admin sees ONLY requests accepted by User B (Pending Admin Verification),
// Approved, or Rejected by Admin.
// MUST NOT see "Pending Member Review" or "Rejected by Member".
// ─────────────────────────────────────────────
const adminGetAllRequests = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      if (status === 'Pending Member Review') {
        query.status = 'Pending Member Review';
      } else if (status === 'Pending Admin Verification' || status === 'Pending') {
        query.status = { $in: ['Pending Admin Verification', 'Pending'] };
      } else if (status === 'Approved') {
        query.status = 'Approved';
      } else if (status === 'Rejected by Member') {
        query.status = 'Rejected by Member';
      } else if (status === 'Rejected by Admin' || status === 'Rejected') {
        query.status = { $in: ['Rejected by Admin', 'Rejected'] };
      } else {
        query.status = status;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let rawRequests = await ContactRequest.find(query)
      .populate('requestedBy', 'name email phone')
      .populate('receiverUser', 'name email phone')
      .populate(
        'requestedProfile',
        'firstName lastName profileImage mobileNumber email denomination diocese occupation city state gender'
      )
      .populate('approvedBy', 'name email')
      .sort({ updatedAt: -1, createdAt: -1 });

    // Attach sender profile details (User A's profile if available)
    let requests = await Promise.all(
      rawRequests.map(async (reqItem) => {
        const itemObj = reqItem.toObject();
        if (reqItem.requestedBy) {
          const senderProfile = await UserProfile.findOne({
            userId: reqItem.requestedBy._id,
          }).select(
            'firstName lastName profileImage mobileNumber email denomination diocese occupation city state gender'
          );
          if (senderProfile) {
            itemObj.senderProfile = senderProfile;
          }
        }
        return itemObj;
      })
    );

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      requests = requests.filter((reqItem) => {
        const uName = (reqItem.requestedBy?.name || '').toLowerCase();
        const uEmail = (reqItem.requestedBy?.email || '').toLowerCase();
        const sFirst = (reqItem.senderProfile?.firstName || '').toLowerCase();
        const sLast = (reqItem.senderProfile?.lastName || '').toLowerCase();
        const sFull = `${sFirst} ${sLast}`;

        const pFirst = (reqItem.requestedProfile?.firstName || '').toLowerCase();
        const pLast = (reqItem.requestedProfile?.lastName || '').toLowerCase();
        const pFull = `${pFirst} ${pLast}`;

        const rName = (reqItem.receiverUser?.name || '').toLowerCase();
        const rEmail = (reqItem.receiverUser?.email || '').toLowerCase();

        return (
          uName.includes(q) ||
          uEmail.includes(q) ||
          sFirst.includes(q) ||
          sLast.includes(q) ||
          sFull.includes(q) ||
          pFirst.includes(q) ||
          pLast.includes(q) ||
          pFull.includes(q) ||
          rName.includes(q) ||
          rEmail.includes(q)
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
// 10. PATCH /api/contact-requests/admin/:requestId/approve (Admin Only)
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
      message: 'Contact request approved successfully! Both users now have full profile access.',
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
// 11. PATCH /api/contact-requests/admin/:requestId/reject (Admin Only)
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
      message: 'Contact request rejected by Admin.',
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
  getIncomingContactRequests,
  memberAcceptRequest,
  memberRejectRequest,
  getMyContactRequestStatuses,
  getApprovedContactDetails,
  adminGetAllRequests,
  adminApproveRequest,
  adminRejectRequest,
};

