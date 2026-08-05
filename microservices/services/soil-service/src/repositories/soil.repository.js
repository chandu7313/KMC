import { models } from '@kissan/shared';

const { SoilReport, SoilReminder } = models;

/**
 * Data access repository for SoilReport and SoilReminder models.
 */
class SoilReportRepository {
  async create(data) {
    const report = await SoilReport.create(data);
    return report.get({ plain: true });
  }

  async findById(id) {
    return SoilReport.findByPk(id, { raw: true });
  }

  async findByFarmer(farmerId) {
    return SoilReport.findAll({
      where: { farmerId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  async findAll() {
    return SoilReport.findAll({
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  async update(id, updates) {
    const [_, [updatedReport]] = await SoilReport.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedReport;
  }

  // ── Soil Reminders ──

  async createReminder(data) {
    const reminder = await SoilReminder.create(data);
    return reminder.get({ plain: true });
  }

  async findReminderByReport(reportId) {
    return SoilReminder.findOne({ where: { reportId }, raw: true });
  }

  async updateReminder(id, updates) {
    const [_, [updatedReminder]] = await SoilReminder.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedReminder;
  }
}

export default new SoilReportRepository();
