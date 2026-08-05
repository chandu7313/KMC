import { models } from '@kissan/shared';

const { CropDiagnosis } = models;

/**
 * Data access repository for crop diagnosis database records.
 */
class DiagnosisRepository {
  /**
   * Create a new diagnosis entry.
   * @param {object} data - Diagnosis attributes
   * @returns {Promise<object>} Created plain diagnosis record
   */
  async create(data) {
    const diagnosis = await CropDiagnosis.create(data);
    return diagnosis.get({ plain: true });
  }

  /**
   * Find diagnosis by primary key ID.
   * @param {string} id - Diagnosis UUID
   * @returns {Promise<object|null>} Plain diagnosis record or null
   */
  async findById(id) {
    return CropDiagnosis.findByPk(id, { raw: true });
  }

  /**
   * Find all diagnosis records belonging to a specific farmer.
   * @param {string} farmerId - Farmer user UUID
   * @param {object} [options={}] - Pagination options (limit, offset)
   * @returns {Promise<Array>} List of diagnosis records
   */
  async findByFarmer(farmerId, { limit = 20, offset = 0 } = {}) {
    return CropDiagnosis.findAll({
      where: { farmerId },
      attributes: ['id', 'imageUrl', 'cropName', 'fieldName', 'diseaseName', 'severity', 'confidence', 'isHealthy', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });
  }

  /**
   * Get aggregate diagnosis metrics (total, diseased, healthy).
   * @returns {Promise<{total: number, diseased: number, healthy: number}>}
   */
  async getStats() {
    const total = await CropDiagnosis.count();
    const diseased = await CropDiagnosis.count({ where: { isHealthy: false } });
    return { 
      total, 
      diseased, 
      healthy: total - diseased 
    };
  }
}

export default new DiagnosisRepository();
