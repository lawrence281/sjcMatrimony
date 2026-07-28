const path = require('path');
const UserProfile = require('../models/UserProfile');
const ContactRequest = require('../models/ContactRequest');
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
  religious: ['religion', 'denomination', 'diocese', 'church', 'churchAddress'],
  personal: ['maritalStatus', 'motherTongue', 'languagesKnown', 'height', 'weight', 'complexion', 'bodyType', 'bloodGroup', 'physicalStatus', 'diet', 'smoking', 'drinking'],
  education: ['highestQualification', 'degree', 'specialization', 'college', 'university', 'graduationYear', 'additionalCertifications'],
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
// PUT /api/profile/me
// Updates all profile sections/fields in a single unified request
// ─────────────────────────────────────────────
const updateMyFullProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Strip forbidden/protected fields
    ADMIN_ONLY_FIELDS.forEach((field) => delete updates[field]);
    delete updates._id;
    delete updates.userId;
    delete updates.email;

    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new UserProfile({ userId: req.user._id, email: req.user.email });
    }

    Object.assign(profile, updates);
    await profile.save();

    return res.status(OK).json({
      success: true,
      message: 'Full profile updated successfully!',
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
// POST /api/profile/admin/create-full (admin only)
// Single-page full profile creation by Admin
// ─────────────────────────────────────────────
const createFullProfileAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      profileStatus = 'Active',
      verificationStatus = 'Verified',
      membershipType = 'Free',
      premiumMember = false,
      featuredProfile = false,
      blocked = false,
      adminRemarks = '',
      basic = {},
      religious = {},
      personal = {},
      education = {},
      career = {},
      family = {},
      address = {},
      church = {},
      about = {},
      preference = {},
    } = req.body;

    const firstName = (basic.firstName || req.body.firstName || req.body.name?.split(' ')[0] || '').trim();
    const lastName = (basic.lastName || req.body.lastName || req.body.name?.split(' ').slice(1).join(' ') || '').trim();
    const gender = basic.gender || req.body.gender || '';
    const dateOfBirth = basic.dateOfBirth || req.body.dateOfBirth || null;
    const mobileNumber = (basic.mobileNumber || req.body.mobileNumber || '').trim();
    const userEmail = (email || basic.email || '').trim().toLowerCase();

    // Field-level Validations
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Valid email address is required' });
    }

    if (!password || password.length < 6) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Password and Confirm Password do not match' });
    }

    if (!firstName || firstName.length < 2) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'First Name (at least 2 characters) is required' });
    }

    if (!lastName) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Last Name is required' });
    }

    if (!gender) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Gender is required' });
    }

    if (!dateOfBirth) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'Date of Birth is required' });
    }

    // Age Check
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (isNaN(age) || age < 18) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'User must be at least 18 years old' });
    }

    // Duplicate Check
    const User = require('../models/User');
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ success: false, message: `Email ${userEmail} is already registered` });
    }

    if (mobileNumber) {
      const existingPhone = await UserProfile.findOne({ mobileNumber });
      if (existingPhone) {
        return res.status(BAD_REQUEST).json({ success: false, message: `Mobile number ${mobileNumber} is already in use` });
      }
    }

    // Create User Account
    const fullName = `${firstName} ${lastName}`.trim();
    const user = await User.create({
      name: fullName,
      email: userEmail,
      password,
      role: 'user',
      phone: mobileNumber,
    });

    // Construct User Profile
    const profileData = {
      userId: user._id,
      email: userEmail,
      profileStatus,
      verificationStatus,
      membershipType,
      premiumMember: Boolean(premiumMember),
      featuredProfile: Boolean(featuredProfile),
      blocked: Boolean(blocked),
      adminRemarks: adminRemarks || 'Created directly by Admin',
      createdBy: 'admin',
      approvedBy: (profileStatus === 'Active' || verificationStatus === 'Verified') ? req.user._id : null,
      approvedDate: (profileStatus === 'Active' || verificationStatus === 'Verified') ? new Date() : null,

      // Basic
      profileFor: basic.profileFor || 'Self',
      firstName,
      lastName,
      gender,
      dateOfBirth: dob,
      mobileNumber,
      profileImage: basic.profileImage || req.body.profileImage || '',
      coverImage: basic.coverImage || req.body.coverImage || '',

      // Religious
      religion: religious.religion || 'Christian',
      denomination: religious.denomination || '',
      diocese: religious.diocese || '',
      church: religious.church || '',
      churchAddress: religious.churchAddress || '',

      // Personal
      maritalStatus: personal.maritalStatus || '',
      motherTongue: personal.motherTongue || '',
      languagesKnown: Array.isArray(personal.languagesKnown) ? personal.languagesKnown : [],
      height: personal.height || '',
      weight: personal.weight || '',
      complexion: personal.complexion || '',
      bodyType: personal.bodyType || '',
      bloodGroup: personal.bloodGroup || '',
      physicalStatus: personal.physicalStatus || '',
      diet: personal.diet || '',
      smoking: personal.smoking || '',
      drinking: personal.drinking || '',

      // Education
      highestQualification: education.highestQualification || '',
      degree: education.degree || '',
      specialization: education.specialization || '',
      college: education.college || '',
      university: education.university || '',
      graduationYear: education.graduationYear ? Number(education.graduationYear) : null,
      additionalCertifications: education.additionalCertifications || '',

      // Career
      occupation: career.occupation || '',
      company: career.company || '',
      designation: career.designation || '',
      experience: career.experience || '',
      annualIncome: career.annualIncome || '',
      workLocation: career.workLocation || '',

      // Family
      fatherName: family.fatherName || '',
      fatherOccupation: family.fatherOccupation || '',
      motherName: family.motherName || '',
      motherOccupation: family.motherOccupation || '',
      brothers: family.brothers ? Number(family.brothers) : 0,
      marriedBrothers: family.marriedBrothers ? Number(family.marriedBrothers) : 0,
      sisters: family.sisters ? Number(family.sisters) : 0,
      marriedSisters: family.marriedSisters ? Number(family.marriedSisters) : 0,
      familyType: family.familyType || '',
      familyStatus: family.familyStatus || '',
      familyValues: family.familyValues || '',

      // Address
      country: address.country || 'India',
      state: address.state || '',
      district: address.district || '',
      city: address.city || '',
      nativePlace: address.nativePlace || '',
      address: address.address || '',
      pincode: address.pincode || '',

      // Church
      baptized: Boolean(church.baptized),
      confirmed: Boolean(church.confirmed),
      firstHolyCommunion: Boolean(church.firstHolyCommunion),
      activeInChurch: Boolean(church.activeInChurch),
      churchMinistry: church.churchMinistry || '',

      // About
      aboutMe: about.aboutMe || req.body.aboutMe || '',

      // Preference
      preferredAgeFrom: preference.preferredAgeFrom ? Number(preference.preferredAgeFrom) : null,
      preferredAgeTo: preference.preferredAgeTo ? Number(preference.preferredAgeTo) : null,
      preferredHeightFrom: preference.preferredHeightFrom || '',
      preferredHeightTo: preference.preferredHeightTo || '',
      preferredMaritalStatus: Array.isArray(preference.preferredMaritalStatus) ? preference.preferredMaritalStatus : [],
      preferredEducation: Array.isArray(preference.preferredEducation) ? preference.preferredEducation : [],
      preferredOccupation: Array.isArray(preference.preferredOccupation) ? preference.preferredOccupation : [],
      preferredDenomination: Array.isArray(preference.preferredDenomination) ? preference.preferredDenomination : [],
      preferredState: Array.isArray(preference.preferredState) ? preference.preferredState : [],
      preferredDistrict: Array.isArray(preference.preferredDistrict) ? preference.preferredDistrict : [],

      photos: Array.isArray(req.body.photos) ? req.body.photos : [],
      documents: Array.isArray(req.body.documents) ? req.body.documents : [],
    };

    const profile = await UserProfile.create(profileData);

    return res.status(CREATED).json({
      success: true,
      message: 'Complete Profile created successfully!',
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/profile/:id/verify (admin only)
// Update Verification / Profile Status / Block State
// ─────────────────────────────────────────────
const verifyProfileAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, verificationStatus, profileStatus, adminRemarks, blocked } = req.body;

    const profile = await UserProfile.findById(id);
    if (!profile) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }

    if (action === 'approve') {
      profile.verificationStatus = 'Verified';
      profile.profileStatus = 'Active';
      profile.approvedBy = req.user._id;
      profile.approvedDate = new Date();
    } else if (action === 'reject') {
      profile.verificationStatus = 'Rejected';
      profile.profileStatus = 'Rejected';
    } else if (action === 'pending') {
      profile.verificationStatus = 'Unverified';
      profile.profileStatus = 'Pending';
    } else if (action === 'block') {
      profile.blocked = true;
      profile.profileStatus = 'Suspended';
    } else if (action === 'unblock') {
      profile.blocked = false;
      profile.profileStatus = 'Active';
    }

    if (verificationStatus) profile.verificationStatus = verificationStatus;
    if (profileStatus) profile.profileStatus = profileStatus;
    if (typeof blocked === 'boolean') profile.blocked = blocked;
    if (adminRemarks !== undefined) profile.adminRemarks = adminRemarks;

    if (profile.profileStatus === 'Active' || profile.verificationStatus === 'Verified') {
      if (!profile.approvedBy) profile.approvedBy = req.user._id;
      if (!profile.approvedDate) profile.approvedDate = new Date();
    }

    await profile.save();

    return res.status(OK).json({
      success: true,
      message: `Profile updated: Verification = ${profile.verificationStatus}, Profile Status = ${profile.profileStatus}`,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/:id/admin/photo
// Admin upload profile/cover photo for specified profile
// ─────────────────────────────────────────────
const adminUploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    }
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });

    const photoType = req.body.type === 'cover' ? 'coverImage' : 'profileImage';
    const photoUrl = `/uploads/${req.file.filename}`;
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
// POST /api/profile/:id/admin/gallery
// Admin add gallery photo for specified profile
// ─────────────────────────────────────────────
const adminAddGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });

    const photoUrl = `/uploads/${req.file.filename}`;
    profile.photos.push({ url: photoUrl, caption: req.body.caption || '' });
    await profile.save();

    return res.status(CREATED).json({
      success: true,
      message: PROFILE.PHOTO_UPLOADED,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/:id/admin/documents
// Admin upload document for specified profile
// ─────────────────────────────────────────────
const adminUploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });

    const docUrl = `/uploads/${req.file.filename}`;
    profile.documents.push({
      type: req.body.docType || 'other',
      label: req.body.label || 'Verification Document',
      url: docUrl,
    });
    await profile.save();

    return res.status(CREATED).json({
      success: true,
      message: PROFILE.DOC_UPLOADED,
      profile: safeProfile(profile),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/profile/:id/admin/documents/:docId
// ─────────────────────────────────────────────
const adminRemoveDocument = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });

    const docIndex = profile.documents.findIndex((d) => d._id.toString() === req.params.docId);
    if (docIndex === -1) return res.status(NOT_FOUND).json({ success: false, message: 'Document not found' });

    profile.documents.splice(docIndex, 1);
    await profile.save();

    return res.status(OK).json({ success: true, message: PROFILE.DOC_REMOVED, profile: safeProfile(profile) });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const escapeRegExp = (str) => {
  if (!str) return '';
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ─────────────────────────────────────────────
// GET /api/profile/browse  (public/authenticated member browsing)
// Returns ONLY eligible profiles (profileStatus='Active' AND verificationStatus='Verified')
// Filter by denomination, diocese, location, minAge, maxAge, profession, gender, maritalStatus, search
// ─────────────────────────────────────────────
const browseProfiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      denomination,
      diocese,
      state,
      district,
      city,
      minAge,
      maxAge,
      location,
      profession,
      gender,
      maritalStatus,
      sort = '-createdAt',
    } = req.query;

    // MANDATORY ELIGIBILITY FILTERS: Only Active & Verified, non-blocked, non-deleted profiles
    const filter = {
      deleted: false,
      blocked: { $ne: true },
      profileStatus: 'Active',
      verificationStatus: 'Verified',
    };

    // EXCLUDE LOGGED-IN USER & REJECTED PROFILES FOR THIS USER
    if (req.user && req.user._id) {
      filter.userId = { $ne: req.user._id };

      // Fetch all profile IDs where current user's contact request was Rejected
      const rejectedProfileIds = await ContactRequest.distinct('requestedProfile', {
        requestedBy: req.user._id,
        status: 'Rejected',
      });

      if (rejectedProfileIds && rejectedProfileIds.length > 0) {
        filter._id = { $nin: rejectedProfileIds };
      }
    }

    if (gender && gender !== 'All') {
      filter.gender = { $regex: new RegExp(`^${escapeRegExp(gender.trim())}$`, 'i') };
    }

    if (maritalStatus && maritalStatus !== 'All') {
      filter.maritalStatus = { $regex: new RegExp(`^${escapeRegExp(maritalStatus.trim())}$`, 'i') };
    }

    if (diocese && diocese !== 'All Dioceses') {
      filter.diocese = { $regex: new RegExp(escapeRegExp(diocese.trim()), 'i') };
    }

    if (state && state !== 'All States') {
      filter.state = { $regex: new RegExp(escapeRegExp(state.trim()), 'i') };
    }

    if (district && district !== 'All Districts') {
      filter.district = { $regex: new RegExp(escapeRegExp(district.trim()), 'i') };
    }

    if (city && city !== 'All Cities') {
      filter.city = { $regex: new RegExp(escapeRegExp(city.trim()), 'i') };
    }

    if (denomination && denomination !== 'All' && denomination !== 'All Churches') {
      const denoms = Array.isArray(denomination)
        ? denomination
        : denomination.split(',').map((d) => d.trim()).filter(Boolean);
      if (denoms.length > 0) {
        filter.denomination = { $in: denoms.map((d) => new RegExp(escapeRegExp(d), 'i')) };
      }
    }

    if (location && location !== 'All Locations') {
      const locRegex = new RegExp(escapeRegExp(location.trim()), 'i');
      filter.$or = [
        { city: locRegex },
        { district: locRegex },
        { state: locRegex },
        { country: locRegex },
        { nativePlace: locRegex },
      ];
    }

    if (profession && profession !== 'All Professions') {
      const profRegex = new RegExp(escapeRegExp(profession.trim()), 'i');
      const profFilter = [
        { occupation: profRegex },
        { designation: profRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: profFilter }];
        delete filter.$or;
      } else {
        filter.$or = profFilter;
      }
    }

    if (search && search.trim()) {
      const sRegex = new RegExp(escapeRegExp(search.trim()), 'i');
      const searchFilter = [
        { firstName: sRegex },
        { lastName: sRegex },
        { city: sRegex },
        { state: sRegex },
        { district: sRegex },
        { occupation: sRegex },
        { denomination: sRegex },
        { diocese: sRegex },
      ];
      if (filter.$and) {
        filter.$and.push({ $or: searchFilter });
      } else if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    // Age filter via dateOfBirth
    if (minAge || maxAge) {
      const today = new Date();
      filter.dateOfBirth = {};
      if (maxAge && Number(maxAge) < 60) {
        const earliest = new Date(today.getFullYear() - Number(maxAge) - 1, today.getMonth(), today.getDate() + 1);
        filter.dateOfBirth.$gte = earliest;
      }
      if (minAge && Number(minAge) > 18) {
        const latest = new Date(today.getFullYear() - Number(minAge), today.getMonth(), today.getDate());
        filter.dateOfBirth.$lte = latest;
      }
      if (Object.keys(filter.dateOfBirth).length === 0) {
        delete filter.dateOfBirth;
      }
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
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/profile/filter-options
// Returns distinct dioceses, states, districts, and cities from Active & Verified profiles
// Supports filtering districts and cities dynamically by state and district
// ─────────────────────────────────────────────
const getFilterOptions = async (req, res) => {
  try {
    const { state, district } = req.query;

    const baseFilter = {
      deleted: false,
      blocked: { $ne: true },
      profileStatus: 'Active',
      verificationStatus: 'Verified',
    };

    const cleanDistinct = async (field, queryFilter = baseFilter) => {
      const raw = await UserProfile.distinct(field, queryFilter);
      return raw
        .filter((item) => item && typeof item === 'string' && item.trim() !== '')
        .map((item) => item.trim())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => a.localeCompare(b));
    };

    // Filter districts by selected state
    const districtFilter = { ...baseFilter };
    if (state && state !== 'All States') {
      districtFilter.state = { $regex: new RegExp(`^${state.trim()}$`, 'i') };
    }

    // Filter cities by selected state and district
    const cityFilter = { ...districtFilter };
    if (district && district !== 'All Districts') {
      cityFilter.district = { $regex: new RegExp(`^${district.trim()}$`, 'i') };
    }

    const [dioceses, states, districts, cities] = await Promise.all([
      cleanDistinct('diocese', baseFilter),
      cleanDistinct('state', baseFilter),
      cleanDistinct('district', districtFilter),
      cleanDistinct('city', cityFilter),
    ]);

    const locationSet = new Set([...cities, ...districts, ...states]);
    const locations = Array.from(locationSet).sort((a, b) => a.localeCompare(b));

    return res.status(OK).json({
      success: true,
      dioceses,
      states,
      districts,
      cities,
      locations,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/profile/member/:id  (public member detail view)
// ─────────────────────────────────────────────
const getPublicProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    let profile = await UserProfile.findById(id).populate('userId', 'name email');
    if (!profile) {
      // Try searching by userId
      profile = await UserProfile.findOne({ userId: id }).populate('userId', 'name email');
    }
    if (!profile || profile.deleted || profile.blocked || profile.profileStatus !== 'Active' || profile.verificationStatus !== 'Verified') {
      return res.status(NOT_FOUND).json({ success: false, message: 'Eligible profile not found' });
    }

    // 1. If Admin or Profile Owner -> Grant Full Access
    if (req.user && req.user._id) {
      const isOwner = profile.userId && profile.userId._id
        ? profile.userId._id.toString() === req.user._id.toString()
        : profile.userId?.toString() === req.user._id.toString();

      if (req.user.role === 'admin' || isOwner) {
        return res.status(OK).json({
          success: true,
          accessGranted: true,
          requestStatus: 'Approved',
          profile: safeProfile(profile),
        });
      }

      // 2. Check Contact Request Status for this user & profile
      const contactReq = await ContactRequest.findOne({
        requestedBy: req.user._id,
        requestedProfile: profile._id,
      });

      if (contactReq && contactReq.status === 'Rejected') {
        return res.status(NOT_FOUND).json({
          success: false,
          accessGranted: false,
          message: 'Profile unavailable or restricted.',
        });
      }

      if (contactReq && contactReq.status === 'Approved') {
        return res.status(OK).json({
          success: true,
          accessGranted: true,
          requestStatus: 'Approved',
          profile: safeProfile(profile),
        });
      }

      // 3. Otherwise (No Request or Pending Request) -> Restrict Full Access
      return res.status(FORBIDDEN).json({
        success: false,
        accessGranted: false,
        requestStatus: contactReq ? contactReq.status : 'None',
        message: 'Full profile details are restricted until your contact request is approved by Admin.',
        summary: {
          _id: profile._id,
          firstName: profile.firstName,
          age: profile.age,
          occupation: profile.occupation,
          city: profile.city,
          state: profile.state,
          diocese: profile.diocese,
          profileImage: profile.profileImage,
        },
      });
    }

    // If guest / unauthenticated -> Restrict Full Access
    return res.status(FORBIDDEN).json({
      success: false,
      accessGranted: false,
      requestStatus: 'None',
      message: 'Authentication and approved contact request required to view full profile.',
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/profile/connect/:id  (Express Interest / Connect)
// ─────────────────────────────────────────────
const connectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await UserProfile.findById(id);
    if (!profile) {
      return res.status(NOT_FOUND).json({ success: false, message: PROFILE.NOT_FOUND });
    }
    const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Member';
    return res.status(OK).json({
      success: true,
      message: `Connection request sent successfully to ${name}!`,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfileSection,
  updateMyFullProfile,
  uploadPhoto,
  addGalleryPhoto,
  removeGalleryPhoto,
  uploadDocument,
  removeDocument,
  getProfileCompletion,
  adminUpdateProfile,
  getAllProfiles,
  createFullProfileAdmin,
  verifyProfileAdmin,
  adminUploadPhoto,
  adminAddGalleryPhoto,
  adminUploadDocument,
  adminRemoveDocument,
  browseProfiles,
  getFilterOptions,
  getPublicProfileById,
  connectMember,
};


