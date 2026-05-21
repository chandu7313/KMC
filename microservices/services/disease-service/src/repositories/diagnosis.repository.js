import { models } from '@kissan/shared';

const { CropDiagnosis } = models;

class DiagnosisRepository {
  async create(data) {
    const diagnosis = await CropDiagnosis.create(data);
    return diagnosis.get({ plain: true });
  }

  async findById(id) {
    return CropDiagnosis.findByPk(id, { raw: true });
  }

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
