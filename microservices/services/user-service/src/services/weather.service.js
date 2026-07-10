
import { createLogger } from '@kissan/shared';
import { getCacheRedis } from '@kissan/shared';

const logger = createLogger('weather-service');
const redis = getCacheRedis();

class WeatherService {
  async getWeatherForFarmer(district, state, lat, lng) {
    const cacheKey = `weather:${district || lat}`;

    // Check Redis cache first (1 hour TTL)
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        logger.warn('OPENWEATHER_API_KEY is missing');
        return null;
      }

      const query = lat && lng
        ? `lat=${lat}&lon=${lng}`
        : `q=${encodeURIComponent(`${district},${state},IN`)}`;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API responded with status: ${response.status}`);
      }

      const w = await response.json();
      const weather = {
        location: district || w.name,
        state: state,
        temperature: Math.round(w.main.temp),
        feelsLike: Math.round(w.main.feels_like),
        condition: w.weather[0].main,
        description: w.weather[0].description,
        humidity: w.main.humidity,
        windSpeed: Math.round(w.wind.speed * 3.6),
        tempMin: Math.round(w.main.temp_min),
        tempMax: Math.round(w.main.temp_max),
        icon: w.weather[0].icon,
        timestamp: new Date().toISOString()
      };

      // Cache for 1 hour (3600 seconds)
      await redis.setex(cacheKey, 3600, JSON.stringify(weather));

      return weather;
    } catch (error) {
      logger.error('Weather API failed', {
        district, error: error.message
      });
      // Return fallback if API fails
      return null;
    }
  }
}

export default new WeatherService();
