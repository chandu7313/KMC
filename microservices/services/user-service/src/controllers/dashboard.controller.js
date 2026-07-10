import { successResponse, createLogger } from '@kissan/shared';
import dashboardService from '../services/dashboard.service.js';

const logger = createLogger('dashboard-controller');

export const getDashboardData = async (req, res, next) => {
  try {
    const farmerId = req.user?.id;
    const startTime = Date.now();

    const data = await dashboardService.getDashboardData(farmerId);
    
    logger.info('Dashboard loaded', {
      farmerId,
      farmerName: data.farmer?.name,
      hasActiveSeason: !!data.activeSeason,
      hasWeather: !!data.weather,
      alertCount: data.alerts?.unreadCount || 0,
      requestId: req.id,
      responseTimeMs: Date.now() - startTime
    });

    return successResponse(res, data, 'Dashboard data retrieved');
  } catch (error) {
    logger.error('Dashboard load failed', {
      farmerId: req.user?.id,
      error: error.message,
      stack: error.stack,
      requestId: req.id
    });
    next(error);
  }
};

export const markAlertRead = async (req, res, next) => {
  try {
    const data = await dashboardService.markAlertRead(req.params.id);
    return successResponse(res, data, 'Alert marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllAlertsRead = async (req, res, next) => {
  try {
    const data = await dashboardService.markAllAlertsRead(req.user.id);
    return successResponse(res, data, 'All alerts marked as read');
  } catch (error) {
    next(error);
  }
};

export const submitFarmStatus = async (req, res, next) => {
  try {
    const data = await dashboardService.submitFarmStatus(req.user.id, req.body);
    return successResponse(res, data, 'Farm status updated');
  } catch (error) {
    next(error);
  }
};
