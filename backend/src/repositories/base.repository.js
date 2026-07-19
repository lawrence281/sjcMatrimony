/**
 * Base Repository
 * Provides common CRUD operations that all repositories inherit.
 * Repositories extend this class and add domain-specific queries.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, select = '', lean = true) {
    const query = this.model.findById(id).select(select);
    return lean ? query.lean() : query;
  }

  async findOne(filter, select = '', lean = true) {
    const query = this.model.findOne(filter).select(select);
    return lean ? query.lean() : query;
  }

  async find(filter = {}, options = {}) {
    const { select = '', sort = {}, skip = 0, limit = 10, populate = '' } = options;
    let query = this.model.find(filter).select(select).sort(sort).skip(skip).limit(limit);
    if (populate) query = query.populate(populate);
    return query.lean();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async create(data) {
    return this.model.create(data);
  }

  async updateById(id, data, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, data, options).lean();
  }

  async updateOne(filter, data, options = { new: true, runValidators: true }) {
    return this.model.findOneAndUpdate(filter, data, options).lean();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async deleteMany(filter) {
    return this.model.deleteMany(filter);
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

module.exports = BaseRepository;
