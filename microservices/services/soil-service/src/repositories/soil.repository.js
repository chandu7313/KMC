import { models } from '@kissan/shared';

const { SoilReport, SoilReminder } = models;

/**
 * Data access repository for SoilReport and SoilReminder models.
 */
class SoilReportRepository {
  /**
   * Create a new soil report record.
   * @param {object} data - Report attributes
   * @returns {Promise<object>} Created plain report
   */
  async create(data) {
    const report = await SoilReport.create(data);
    return report.get({ plain: true });
  }

  /**
   * Find soil report by primary key ID.
   * @param {string} id - Soil report UUID
   * @returns {Promise<object|null>} Plain report or null
   */
  async findById(id) {
    return SoilReport.findByPk(id, { raw: true });
  }

  /**
   * List all soil reports for a specific farmer.
   * @param {string} farmerId - Farmer UUID
   * @returns {Promise<Array>} List of reports
   */
  async findByFarmer(farmerId) {
    return SoilReport.findAll({
      where: { farmerId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * List all soil reports across all farmers.
   * @returns {Promise<Array>} List of all reports
   */
  async findAll() {
    return SoilReport.findAll({
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  /**
   * Update fields of a soil report record.
   * @param {string} id - Soil report UUID
   * @param {object} updates - Attributes to update
   * @returns {Promise<object>} Updated report record
   */
  async update(id, updates) {
    const [_, [updatedReport]] = await SoilReport.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedReport;
  }

  // ── Soil Reminders ──

  /**
   * Create a 6-month soil test re-check reminder.
   * @param {object} data - Reminder details
   * @returns {Promise<object>} Created plain reminder
   */
  async createReminder(data) {
    const reminder = await SoilReminder.create(data);
    return reminder.get({ plain: true });
  }

  /**
   * Find reminder linked to a specific report ID.
   * @param {string} reportId - Soil report UUID
   * @returns {Promise<object|null>} Plain reminder or null
   */
  async findReminderByReport(reportId) {
    return SoilReminder.findOne({ where: { reportId }, raw: true });
  }

  /**
   * Update reminder attributes.
   * @param {string} id - Reminder UUID
   * @param {object} updates - Updates
   * @returns {Promise<object>} Updated reminder record
   */
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
