import axios from 'axios';
import { WeatherInfo, DailyWeather } from '@/types';

class WeatherService {
  private apiKey: string;
  private baseURL = 'https://devapi.qweather.com/v7';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // 获取城市Location ID
  private async getCityLocationId(city: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseURL}/city/lookup`, {
        params: {
          location: city,
          key: this.apiKey,
        },
      });

      if (response.data.code === '200' && response.data.location?.length > 0) {
        return response.data.location[0].id;
      }

      throw new Error('城市未找到');
    } catch (error) {
      console.error('City lookup error:', error);
      throw new Error('查询城市失败');
    }
  }

  // 查询未来15天天气预报
  async getWeatherForecast(city: string): Promise<WeatherInfo> {
    try {
      // 1. 获取城市ID
      const locationId = await this.getCityLocationId(city);

      // 2. 查询15天天气
      const response = await axios.get(`${this.baseURL}/weather/15d`, {
        params: {
          location: locationId,
          key: this.apiKey,
        },
      });

      if (response.data.code !== '200') {
        throw new Error('天气查询失败');
      }

      // 3. 解析数据
      const daily: DailyWeather[] = response.data.daily.map((day: any) => ({
        date: day.fxDate,
        tempMax: parseInt(day.tempMax),
        tempMin: parseInt(day.tempMin),
        weatherText: day.textDay,
        weatherCode: day.iconDay,
        precipProb: parseInt(day.precip) || 0,
        humidity: parseInt(day.humidity),
        windSpeed: parseInt(day.windSpeedDay),
        uvIndex: parseInt(day.uvIndex),
        sunrise: day.sunrise,
        sunset: day.sunset,
      }));

      return {
        city,
        daily,
        updatedAt: Date.now(),
      };
    } catch (error: any) {
      console.error('Weather forecast error:', error);
      throw new Error(error.message || '获取天气信息失败');
    }
  }

  // 生成着装建议
  generateClothingSuggestion(weather: WeatherInfo): string[] {
    const suggestions: string[] = [];
    const avgTemp =
      weather.daily.slice(0, 7).reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / 7;

    // 根据平均温度给出建议
    if (avgTemp > 30) {
      suggestions.push('☀️ 防晒霜', '🧢 遮阳帽', '🕶️ 太阳镜', '👕 轻薄衣物', '🩴 凉鞋');
    } else if (avgTemp > 25) {
      suggestions.push('👕 短袖衬衫', '🩳 短裤', '☀️ 防晒霜', '🕶️ 太阳镜');
    } else if (avgTemp > 20) {
      suggestions.push('👔 长袖衬衫', '🧥 薄外套', '👖 长裤', '☀️ 防晒霜');
    } else if (avgTemp > 15) {
      suggestions.push('🧥 外套', '👖 长裤', '🧣 围巾');
    } else if (avgTemp > 10) {
      suggestions.push('🧥 厚外套', '👖 长裤', '🧣 围巾', '🧤 手套');
    } else {
      suggestions.push('🧥 羽绒服', '🧣 围巾', '🧤 手套', '🎩 帽子', '🧦 保暖衣物');
    }

    // 根据降雨概率
    const hasRain = weather.daily.slice(0, 7).some((d) => d.precipProb > 30);
    if (hasRain) {
      suggestions.push('🌂 雨伞', '🥾 防水鞋');
    }

    // 根据紫外线
    const highUV = weather.daily.slice(0, 7).some((d) => d.uvIndex > 7);
    if (highUV) {
      if (!suggestions.includes('☀️ 防晒霜')) {
        suggestions.push('☀️ 防晒霜');
      }
      if (!suggestions.includes('🕶️ 太阳镜')) {
        suggestions.push('🕶️ 太阳镜');
      }
    }

    return suggestions;
  }

  // 生成天气总结文本
  generateWeatherSummary(weather: WeatherInfo): string {
    const firstWeek = weather.daily.slice(0, 7);
    const avgTemp = firstWeek.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / 7;
    const maxTemp = Math.max(...firstWeek.map((d) => d.tempMax));
    const minTemp = Math.min(...firstWeek.map((d) => d.tempMin));
    const rainyDays = firstWeek.filter((d) => d.precipProb > 30).length;

    let summary = `${weather.city}未来一周天气:\n\n`;
    summary += `🌡️ 温度: ${minTemp}°C - ${maxTemp}°C (平均${Math.round(avgTemp)}°C)\n`;

    if (rainyDays > 0) {
      summary += `🌧️ 预计有${rainyDays}天有雨,请携带雨具\n`;
    } else {
      summary += `☀️ 天气晴好,适合出行\n`;
    }

    // 穿衣建议
    const clothingSuggestions = this.generateClothingSuggestion(weather);
    summary += `\n👔 穿衣建议:\n${clothingSuggestions.join(' ')}\n`;

    // 特殊天气提醒
    const extremeHot = firstWeek.some((d) => d.tempMax > 35);
    const extremeCold = firstWeek.some((d) => d.tempMin < 0);
    const heavyRain = firstWeek.some((d) => d.precipProb > 70);

    if (extremeHot) {
      summary += `\n⚠️ 高温预警: 部分日期可能超过35°C,注意防暑降温`;
    }
    if (extremeCold) {
      summary += `\n⚠️ 低温提醒: 部分日期可能低于0°C,注意保暖`;
    }
    if (heavyRain) {
      summary += `\n⚠️ 降雨提醒: 可能有大雨,建议关注天气预报`;
    }

    return summary;
  }
}

// 导出单例
let weatherService: WeatherService | null = null;

export const initWeatherService = (apiKey: string) => {
  weatherService = new WeatherService(apiKey);
  return weatherService;
};

export const getWeatherService = (): WeatherService | null => {
  return weatherService;
};

export default WeatherService;
