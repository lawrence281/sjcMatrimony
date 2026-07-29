const MarriageRegister = require('../models/MarriageRegister');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');

/**
 * @desc Get all marriage records with pagination, filtering, search & sorting
 * @route GET /api/marriage-register
 * @access Admin
 */
const getMarriageRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const status = req.query.status || 'ALL';
    const diocese = req.query.diocese || 'ALL';
    const sortBy = req.query.sortBy || 'marriageDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { brideName: searchRegex },
        { groomName: searchRegex },
        { churchName: searchRegex },
        { parish: searchRegex },
        { diocese: searchRegex },
        { marriageCertificateNumber: searchRegex },
        { brideMobileNumber: searchRegex },
        { groomMobileNumber: searchRegex },
      ];
    }

    if (status !== 'ALL') {
      query.marriageStatus = status;
    }

    if (diocese !== 'ALL') {
      query.diocese = { $regex: new RegExp(diocese, 'i') };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const [records, total] = await Promise.all([
      MarriageRegister.find(query)
        .populate('brideProfileId', 'firstName lastName profileId photo')
        .populate('groomProfileId', 'firstName lastName profileId photo')
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      MarriageRegister.countDocuments(query),
    ]);

    return res.status(OK).json({
      success: true,
      records,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching marriage records:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch marriage records',
      error: error.message,
    });
  }
};

/**
 * @desc Get single marriage record by ID
 * @route GET /api/marriage-register/:id
 * @access Admin
 */
const getMarriageRecordById = async (req, res) => {
  try {
    const record = await MarriageRegister.findById(req.params.id)
      .populate('brideProfileId')
      .populate('groomProfileId')
      .populate('createdBy', 'name email');

    if (!record) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Marriage record not found' });
    }

    return res.status(OK).json({ success: true, record });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch marriage record details',
    });
  }
};

/**
 * @desc Create a new marriage register record
 * @route POST /api/marriage-register
 * @access Admin
 */
const createMarriageRecord = async (req, res) => {
  try {
    const {
      brideName,
      brideProfileId,
      brideDob,
      brideMobileNumber,
      groomName,
      groomProfileId,
      groomDob,
      groomMobileNumber,
      marriageDate,
      churchName,
      churchAddress,
      diocese,
      parish,
      priestName,
      marriageCertificateNumber,
      marriageStatus,
      witnesses,
      remarks,
      documents,
    } = req.body;

    const record = new MarriageRegister({
      brideName,
      brideProfileId: brideProfileId || null,
      brideDob: brideDob ? new Date(brideDob) : null,
      brideMobileNumber: brideMobileNumber || '',
      groomName,
      groomProfileId: groomProfileId || null,
      groomDob: groomDob ? new Date(groomDob) : null,
      groomMobileNumber: groomMobileNumber || '',
      marriageDate: new Date(marriageDate),
      churchName,
      churchAddress: churchAddress || '',
      diocese: diocese || '',
      parish: parish || '',
      priestName: priestName || '',
      marriageCertificateNumber: marriageCertificateNumber || `MC-${Date.now()}`,
      marriageStatus: marriageStatus || 'registered',
      witnesses: Array.isArray(witnesses) ? witnesses : [],
      remarks: remarks || '',
      documents: Array.isArray(documents) ? documents : [],
      createdBy: req.user?._id || null,
    });

    await record.save();

    return res.status(CREATED).json({
      success: true,
      message: 'Marriage register record created successfully',
      record,
    });
  } catch (error) {
    console.error('Error creating marriage record:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create marriage record',
      error: error.message,
    });
  }
};

/**
 * @desc Update an existing marriage register record
 * @route PUT /api/marriage-register/:id
 * @access Admin
 */
const updateMarriageRecord = async (req, res) => {
  try {
    const record = await MarriageRegister.findById(req.params.id);
    if (!record) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Marriage record not found' });
    }

    const {
      brideName,
      brideProfileId,
      brideDob,
      brideMobileNumber,
      groomName,
      groomProfileId,
      groomDob,
      groomMobileNumber,
      marriageDate,
      churchName,
      churchAddress,
      diocese,
      parish,
      priestName,
      marriageCertificateNumber,
      marriageStatus,
      witnesses,
      remarks,
      documents,
    } = req.body;

    if (brideName !== undefined) record.brideName = brideName;
    if (brideProfileId !== undefined) record.brideProfileId = brideProfileId || null;
    if (brideDob !== undefined) record.brideDob = brideDob ? new Date(brideDob) : null;
    if (brideMobileNumber !== undefined) record.brideMobileNumber = brideMobileNumber;

    if (groomName !== undefined) record.groomName = groomName;
    if (groomProfileId !== undefined) record.groomProfileId = groomProfileId || null;
    if (groomDob !== undefined) record.groomDob = groomDob ? new Date(groomDob) : null;
    if (groomMobileNumber !== undefined) record.groomMobileNumber = groomMobileNumber;

    if (marriageDate !== undefined) record.marriageDate = new Date(marriageDate);
    if (churchName !== undefined) record.churchName = churchName;
    if (churchAddress !== undefined) record.churchAddress = churchAddress;
    if (diocese !== undefined) record.diocese = diocese;
    if (parish !== undefined) record.parish = parish;
    if (priestName !== undefined) record.priestName = priestName;
    if (marriageCertificateNumber !== undefined) record.marriageCertificateNumber = marriageCertificateNumber;
    if (marriageStatus !== undefined) record.marriageStatus = marriageStatus;

    if (witnesses !== undefined) record.witnesses = Array.isArray(witnesses) ? witnesses : [];
    if (remarks !== undefined) record.remarks = remarks;
    if (documents !== undefined) record.documents = Array.isArray(documents) ? documents : [];

    await record.save();

    return res.status(OK).json({
      success: true,
      message: 'Marriage record updated successfully',
      record,
    });
  } catch (error) {
    console.error('Error updating marriage record:', error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update marriage record',
      error: error.message,
    });
  }
};

/**
 * @desc Upload document / certificate image for marriage record
 * @route POST /api/marriage-register/upload
 * @access Admin
 */
const uploadMarriageDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(OK).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      fileName: req.file.originalname,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File upload failed',
      error: error.message,
    });
  }
};

/**
 * @desc Delete marriage register record
 * @route DELETE /api/marriage-register/:id
 * @access Admin
 */
const deleteMarriageRecord = async (req, res) => {
  try {
    const record = await MarriageRegister.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(NOT_FOUND).json({ success: false, message: 'Marriage record not found' });
    }

    return res.status(OK).json({
      success: true,
      message: 'Marriage record deleted successfully',
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete marriage record',
    });
  }
};

module.exports = {
  getMarriageRecords,
  getMarriageRecordById,
  createMarriageRecord,
  updateMarriageRecord,
  uploadMarriageDocuments,
  deleteMarriageRecord,
};
