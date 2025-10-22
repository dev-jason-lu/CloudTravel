// 天气信息
export interface WeatherInfo {
  city: string;
  daily: DailyWeather[];
  updatedAt: number;
}

// 每日天气
export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherText: string; // 天气描述(晴、多云、雨等)
  weatherCode: string;
  precipProb: number; // 降雨概率(%)
  humidity: number; // 湿度(%)
  windSpeed: number; // 风速(km/h)
  uvIndex: number; // 紫外线指数
  airQuality?: number; // 空气质量指数
  sunrise?: string;
  sunset?: string;
}

// 着装建议
export interface ClothingSuggestion {
  items: string[];
  reason: string;
}
