const BaseRepository = require('./base.repository');
const Gallery = require('../models/Gallery.model');

class GalleryRepository extends BaseRepository {
  constructor() {
    super(Gallery);
  }

  /**
   * Retrieves photos uploaded in user's profile gallery.
   *
   * @param {string} profileId
   * @returns {Promise<Array>} List of gallery elements
   */
  async findProfileGallery(profileId) {
    return this.find({ profileId }, { sort: { isPrimary: -1, uploadedAt: -1 } });
  }

  /**
   * Resets primary status flags for all elements in user's gallery.
   *
   * @param {string} profileId
   * @returns {Promise<Object>} Mongoose modification counts
   */
  async clearPrimaryFlag(profileId) {
    return this.model.updateMany(
      { profileId, isPrimary: true },
      { $set: { isPrimary: false } }
    );
  }
}

module.exports = new GalleryRepository();
