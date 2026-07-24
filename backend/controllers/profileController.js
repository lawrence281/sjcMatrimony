const path = require('path');
const UserProfile = require('../models/UserProfile');
const { OK, CREATED, NOT_FOUND, BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');
const { PROFILE } = require('../constants/messages');
const { SECTION_RULES } = require('../validators/profileValidator');

// ─────────────────────────────────────────────
// Fields that ONLY admins may update
// ─────────────────────────────────────────────
const ADMIN_ONLY_FIELDS = [
  'profileStatus', 'verificationStatus', 'featuredProfile', 'premiumMember',
  'membershipType', 'membershipExpiry', 'adminRemarks', 'blocked', 'deleted',
  'profileCompletion', 'createdBy', 'approvedBy', 'approvedDate',
];

// ─────────────────────────────────────────────
// Section → allowed field whitelist
// ─────────────────────────────────────────────
const SECTION_FIELDS = {
  basic: ['profileFor', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'mobileNumber', 'email'],
  religious: ['religion', 'denomination', 'diocese', 'parish', 'church', 'baptismName', 'confirmationName'],
  personal: ['maritalStatus', 'motherTongue', 'languagesKnown', 'height', 'weight', 'complexion', 'bodyType', 'bloodGroup', 'physicalStatus', 'diet', 'smoking', 'drinking'],
  education: ['highestQualification', 'degree', 'specialization', 'college', 'graduationYear'],
  career: ['occupation', 'company', 'designation', 'experience', 'annualIncome', 'workLocation'],
  family: ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'brothers', 'marriedBrothers', 'sisters', 'marriedSisters', 'familyType', 'familyStatus', 'familyValues'],
  address: ['country', 'state', 'district', 'city', 'nativePlace', 'address', 'pincode'],
  church: ['baptized', 'confirmed', 'firstHolyCommunion', 'activeInChurch', 'churchMinistry'],
  about: ['aboutMe'],
  preference: ['preferredAgeFrom', 'preferredAgeTo', 'preferredHeightFrom', 'preferredHeightTo', 'preferredMaritalStatus', 'preferredEducation', 'preferredOccupation', 'preferredDenomination', 'preferredState', 'preferredDistrict'],
};

// ─────────────────────────────────────────────
// Helper: build safe response (strip deleted)
// ─────────────────────────────────────────────
const safeProfile = (profile) => {
  const { total, breakdown } = UserProfile.calculateCompletion(profile);
  const obj = profile.toJSON ? profile.toJSON() : profile;
  obj.profileCompletion = total;
  obj.completionBreakdown = breakdown;
  return obj;
};

// ─────────────────────────────────────────────
// GET /api/profile/me
// Returns own profile; creates an empty one if it doesn't exist yet
// ─────────────────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Auto-create empty profile seeded with auth user data
      profile = await UserProfile.create({
        userId: req.user._id,
        email: req.user.email,
        firstName: req.user.name ? req.user.name.split(' ')[0] : '',
        lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : '',
        mobileNumber: req.user.phone || '',
        createdBy: 'self',
      });
    }

    if (profile.deleted) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }

    return res.status(OK).json({ success: true, profile: safeProfile(profile) });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/profile/me/:section
// Updates one named section of the profile
// ─────────────────────────────────────────────
const updateProfileSection = async (req, res) => {
  try {
    const { section } = req.params;
    const allowedFields = SECTION_FIELDS[section];

    if (!allowedFields) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid section name' });
    }

    // Strip out admin-only fields from body (extra safety net)
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Reject any admin-only field attempts
    const forbidden = ADMIN_ONLY_FIELDS.filter((f) => req.body[f] !== undefined);
    if (forbidden.length > 0) {
      return res.status(FORBIDDEN).json({ success: false, message: PROFILE.UNAUTHORIZED_FIELD });
    }

    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new UserProfile({ userId: req.user._id, email: req.user.email });
    }

    // Apply updates
    Object.assign(profile, updates);
    await profile.save();

    return res.status(OK).json({
      success: true,
      message: PROFILE.UPDATED,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/me/photo
// Upload profile photo or cover photo
// Body: type = 'profile' | 'cover'
// ─────────────────────────────────────────────
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    }

    const photoType = req.body.type === 'cover' ? 'coverImage' : 'profileImage';
    const photoUrl = `/uploads/${req.file.filename}`;

    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new UserProfile({ userId: req.user._id, email: req.user.email });
    }

    profile[photoType] = photoUrl;
    await profile.save();

    return res.status(OK).json({
      success: true,
      message: PROFILE.PHOTO_UPLOADED,
      url: photoUrl,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/me/gallery
// Add a photo to gallery (max 10)
// ─────────────────────────────────────────────
const addGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    }

    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new UserProfile({ userId: req.user._id, email: req.user.email });
    }

    if (profile.photos.length >= 10) {
      return res.status(BAD_REQUEST).json({ success: false, message: PROFILE.GALLERY_FULL });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    profile.photos.push({ url: photoUrl, caption: req.body.caption || '' });
    await profile.save();

    return res.status(CREATED).json({
      success: true,
      message: PROFILE.PHOTO_UPLOADED,
      photo: profile.photos[profile.photos.length - 1],
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/profile/me/gallery/:photoId
// ─────────────────────────────────────────────
const removeGalleryPhoto = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }

    const photoIndex = profile.photos.findIndex(
      (p) => p._id.toString() === req.params.photoId
    );
    if (photoIndex === -1) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Photo not found' });
    }

    profile.photos.splice(photoIndex, 1);
    await profile.save();

    return res.status(OK).json({
      success: true,
      message: PROFILE.PHOTO_REMOVED,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/me/documents
// Upload a document
// Body: docType = 'idProof' | 'baptismCertificate' | 'other', label
// ─────────────────────────────────────────────
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    }

    const { docType = 'other', label = '' } = req.body;
    const validTypes = ['idProof', 'baptismCertificate', 'other'];
    if (!validTypes.includes(docType)) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid document type' });
    }

    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new UserProfile({ userId: req.user._id, email: req.user.email });
    }

    const docUrl = `/uploads/${req.file.filename}`;
    profile.documents.push({ type: docType, label, url: docUrl });
    await profile.save();

    return res.status(CREATED).json({
      success: true,
      message: PROFILE.DOC_UPLOADED,
      document: profile.documents[profile.documents.length - 1],
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/profile/me/documents/:docId
// ─────────────────────────────────────────────
const removeDocument = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }

    const docIndex = profile.documents.findIndex(
      (d) => d._id.toString() === req.params.docId
    );
    if (docIndex === -1) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Document not found' });
    }

    profile.documents.splice(docIndex, 1);
    await profile.save();

    return res.status(OK).json({
      success: true,
      message: PROFILE.DOC_REMOVED,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/profile/me/completion
// Returns completion breakdown
// ─────────────────────────────────────────────
const getProfileCompletion = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(OK).json({
        success: true,
        profileCompletion: 0,
        breakdown: {
          basic: 0, religion: 0, education: 0, career: 0,
          family: 0, preference: 0, address: 0, about: 0,
          photos: 0, documents: 0,
        },
      });
    }

    const { total, breakdown } = UserProfile.calculateCompletion(profile);
    return res.status(OK).json({ success: true, profileCompletion: total, breakdown });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/profile/:id/admin  (admin only)
// Update admin-only fields
// ─────────────────────────────────────────────
const adminUpdateProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    const passwordToUpdate = updateFields.password;

    // Remove protected fields from the profile update
    delete updateFields._id;
    delete updateFields.userId;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    delete updateFields.password;

    // Track who approved the profile if status changes to Active
    if (updateFields.profileStatus === 'Active') {
      updateFields.approvedBy = req.user._id;
      updateFields.approvedDate = new Date();
    }

    const profile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }

    // Handle User password update if provided
    if (passwordToUpdate && passwordToUpdate.length >= 6) {
      const User = require('../models/User');
      const user = await User.findById(profile.userId);
      if (user) {
        user.password = passwordToUpdate;
        await user.save(); // Triggers the pre-save bcrypt hash
      }
    }

    return res.status(OK).json({ success: true, message: PROFILE.UPDATED, profile: safeProfile(profile) });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/profile/all  (admin only)
// Returns paginated list of all profiles
// ─────────────────────────────────────────────
const getAllProfiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      membership,
      search,
      sort = '-createdAt',
    } = req.query;

    const filter = { deleted: false };
    if (status) filter.profileStatus = status;
    if (membership) filter.membershipType = membership;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await UserProfile.countDocuments(filter);
    const profiles = await UserProfile.find(filter)
      .populate('userId', 'name email role')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(OK).json({
      success: true,
      profiles: profiles.map(safeProfile),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/admin/create (admin only)
// Create a new User and Profile in one step
// ─────────────────────────────────────────────
const createProfileAdmin = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
    
    if (!name || !email || !password) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Name, email, and password are required' });
    }

    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'User with this email already exists' });
    }

    // Create the User
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    // Create the Profile
    const profile = await UserProfile.create({
      userId: user._id,
      email: user.email,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      mobileNumber: mobileNumber || '',
      profileStatus: 'Active',
      verificationStatus: 'Verified'
    });

    return res.status(201).json({ success: true, message: 'User and Profile created', profile: safeProfile(profile) });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfileSection,
  uploadPhoto,
  addGalleryPhoto,
  removeGalleryPhoto,
  uploadDocument,
  removeDocument,
  getProfileCompletion,
  adminUpdateProfile,
  getAllProfiles,
  createProfileAdmin,
};
