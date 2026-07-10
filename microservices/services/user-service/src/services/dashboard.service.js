import { supabaseClient as supabase, createLogger } from '@kissan/shared';
import weatherService from './weather.service.js';

const logger = createLogger('dashboard-service');

class DashboardService {
  async getDashboardData(farmerId) {
    // Run all queries in parallel
    const [
      farmerData,
      activeSeason,
      latestStatus,
      alerts,
      schemes,
      tip
    ] = await Promise.all([
      // Farmer + farm details
      supabase
        .from('users')
        .select(`
          id, name, phone, language, state, district,
          farmer_farms (
            farm_name, total_area, area_unit, soil_type, latitude, longitude
          )
        `)
        .eq('id', farmerId)
        .single(),

      // Active crop season
      supabase
        .from('crop_seasons')
        .select('*')
        .eq('farmer_id', farmerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      // Latest farm status reading
      supabase
        .from('farm_status_readings')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      // Unread alerts (last 10)
      supabase
        .from('farmer_alerts')
        .select('*')
        .eq('farmer_id', farmerId)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(10),

      // Active scheme enrollments
      supabase
        .from('farmer_scheme_enrollments')
        .select(`
          next_payment_date,
          government_schemes (
            scheme_name, benefit_amount, next_installment_date, icon, color
          )
        `)
        .eq('farmer_id', farmerId)
        .eq('status', 'active'),

      // Daily tip for farmer's crop
      supabase
        .from('farming_tips')
        .select('*')
        .eq('is_active', true)
        .contains('applicable_months', [new Date().getMonth() + 1])
        .limit(20)
    ]);

    const farmer = farmerData.data || {};
    const season = activeSeason.data;
    const status = latestStatus.data;

    // Calculate crop stage
    let currentStage = null;
    if (season) {
      const daysSinceSowing = Math.floor(
        (new Date() - new Date(season.sowing_date)) / (1000 * 60 * 60 * 24)
      );

      const { data: stages } = await supabase
        .from('crop_growth_stages')
        .select('*')
        .eq('crop_name', season.crop_name)
        .order('stage_number', { ascending: true });

      const allStages = stages || [];
      const current = allStages.find(s =>
        daysSinceSowing >= s.days_from_sowing_start &&
        daysSinceSowing < s.days_from_sowing_end
      ) || allStages[allStages.length - 1];

      const nextStage = allStages.find(s =>
        s.stage_number === (current?.stage_number || 0) + 1
      );

      const nextStageDate = nextStage ? new Date(
        new Date(season.sowing_date).getTime() + nextStage.days_from_sowing_start * 86400000
      ) : null;

      const progress = current ? Math.round(
        ((daysSinceSowing - current.days_from_sowing_start) / 
        (current.days_from_sowing_end - current.days_from_sowing_start)) * 100
      ) : 0;

      currentStage = {
        allStages,
        current,
        nextStage,
        nextStageDate,
        daysSinceSowing,
        progress: Math.min(Math.max(progress, 0), 100) // clamp 0-100
      };
    }

    // Get crop-specific tip
    let dailyTip = null;
    const tips = tip.data || [];
    if (tips.length > 0) {
      const cropTips = season ? tips.filter(t => t.applicable_crops?.includes(season.crop_name)) : [];
      const pool = cropTips.length > 0 ? cropTips : tips;
      // Rotate tips daily using date as seed
      const dayIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
      dailyTip = pool[dayIndex % pool.length];
    }

    // Generate greeting message
    const greetingMessage = this.generateGreetingMessage(season, status, currentStage?.current);

    // Unread count
    const unreadCount = (alerts.data || []).filter(a => !a.is_read).length;

    // Scheme days left
    // If farmer has no enrollments, provide a fallback generic PM-KISAN for demo
    let schemeData = (schemes.data || []).map(e => {
      const scheme = e.government_schemes;
      const nextDate = e.next_payment_date || scheme.next_installment_date;
      const daysLeft = nextDate ? Math.ceil(
        (new Date(nextDate) - new Date()) / (1000 * 60 * 60 * 24)
      ) : null;
      return {
        name: scheme.scheme_name,
        amount: scheme.benefit_amount,
        nextDate: nextDate,
        daysLeft,
        icon: scheme.icon,
        color: scheme.color
      };
    });

    if (schemeData.length === 0) {
      const { data: defaultScheme } = await supabase
        .from('government_schemes')
        .select('*')
        .limit(1)
        .single();
      
      if (defaultScheme) {
        const nextDate = defaultScheme.next_installment_date;
        const daysLeft = nextDate ? Math.ceil((new Date(nextDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
        schemeData = [{
          name: defaultScheme.scheme_name,
          amount: defaultScheme.benefit_amount,
          nextDate: nextDate,
          daysLeft,
          icon: defaultScheme.icon,
          color: defaultScheme.color
        }];
      }
    }

    const farmDetails = farmer.farmer_farms && farmer.farmer_farms.length > 0 ? farmer.farmer_farms[0] : null;

    // Weather
    const weather = await weatherService.getWeatherForFarmer(
      farmer.district,
      farmer.state,
      farmDetails?.latitude,
      farmDetails?.longitude
    );

    return {
      farmer: {
        id: farmer.id,
        name: farmer.name,
        language: farmer.language || 'en',
        state: farmer.state,
        district: farmer.district,
        farm: farmDetails
      },
      greeting: {
        message: greetingMessage,
        timeOfDay: this.getTimeOfDay(),
        dailyTip: dailyTip ? (dailyTip.tip_text_en || dailyTip.tip_text_hi || dailyTip.tip_text_te) : null
      },
      activeSeason: season ? {
        id: season.id,
        cropName: season.crop_name,
        variety: season.crop_variety,
        seasonNumber: season.season_number,
        sowingDate: season.sowing_date,
        expectedHarvest: season.expected_harvest_date,
        area: season.area_planted,
        areaUnit: season.area_unit
      } : null,
      currentStage,
      farmStatus: status ? {
        soilMoisturePercent: status.soil_moisture_percent,
        soilMoistureStatus: status.soil_moisture_status,
        cropHealthScore: status.crop_health_score,
        cropHealthStatus: status.crop_health_status,
        nutrientLevelScore: status.nutrient_level_score,
        nutrientLevelStatus: status.nutrient_level_status,
        recordedAt: status.recorded_at
      } : null,
      alerts: {
        unreadCount,
        items: alerts.data || []
      },
      schemes: schemeData,
      weather,
      today: new Date().toISOString()
    };
  }

  generateGreetingMessage(season, status, currentStage) {
    if (!season) {
      return 'Welcome back! Add your active crop season to get personalized daily advice.';
    }
  
    const cropName = season.crop_name;
    const stage = currentStage?.stage_name || 'growing';
    const moisture = status?.soil_moisture_status;
  
    if (moisture === 'Critical' || moisture === 'Low') {
      return `Your ${cropName} crop needs water urgently! Soil moisture is ${moisture.toLowerCase()}. Irrigate today.`;
    }
  
    if (status?.crop_health_status === 'Critical') {
      return `Alert: Your ${cropName} crop health is critical. Check for disease or pest damage immediately.`;
    }
  
    if (status?.crop_health_status === 'Poor') {
      return `Your ${cropName} needs attention. Crop health is poor — consider applying fertilizer or consult an expert.`;
    }
  
    return `Your farm is in good condition today. ${cropName} is in ${stage.toLowerCase()} stage — ${this.getStageTip(stage, moisture)}`;
  }
  
  getStageTip(stage, moisture) {
    const tips = {
      'Vegetative': 'check the soil moisture!',
      'Flowering': 'ensure adequate irrigation!',
      'Grain Filling': 'monitor grain development.',
      'Harvest': 'plan your harvest schedule.',
      'Sowing': 'ensure even germination.',
      'Germination': 'keep soil moist and warm.'
    };
    return tips[stage] || 'keep monitoring your crop.';
  }
  
  getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    if (h < 20) return 'Evening';
    return 'Night';
  }

  async markAlertRead(alertId) {
    const { data, error } = await supabase
      .from('farmer_alerts')
      .update({ is_read: true })
      .eq('id', alertId)
      .select();
    
    if (error) throw error;
    return data;
  }

  async markAllAlertsRead(farmerId) {
    const { data, error } = await supabase
      .from('farmer_alerts')
      .update({ is_read: true })
      .eq('farmer_id', farmerId)
      .eq('is_read', false)
      .select();
    
    if (error) throw error;
    return data;
  }

  async submitFarmStatus(farmerId, payload) {
    const { data, error } = await supabase
      .from('farm_status_readings')
      .insert([{
        farmer_id: farmerId,
        soil_moisture_percent: payload.soilMoisture,
        soil_moisture_status: this.getMoistureStatus(payload.soilMoisture),
        crop_health_score: payload.cropHealth,
        crop_health_status: this.getHealthStatus(payload.cropHealth),
        nutrient_level_score: payload.nutrientLevel,
        nutrient_level_status: this.getNutrientStatus(payload.nutrientLevel),
        reading_source: 'manual'
      }])
      .select();
      
    if (error) throw error;
    return data[0];
  }

  getMoistureStatus(percent) {
    if (percent < 20) return 'Critical';
    if (percent < 40) return 'Low';
    if (percent <= 70) return 'Good';
    return 'High';
  }

  getHealthStatus(score) {
    if (score < 25) return 'Critical';
    if (score < 50) return 'Poor';
    if (score < 70) return 'Fair';
    if (score < 85) return 'Good';
    return 'Excellent';
  }

  getNutrientStatus(score) {
    if (score < 30) return 'Critical';
    if (score < 50) return 'Low';
    if (score < 70) return 'Medium';
    if (score < 85) return 'High';
    return 'Optimal';
  }
}

export default new DashboardService();
