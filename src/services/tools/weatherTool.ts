import { Tool, toolRegistry } from './registry';
import { initWeatherService, getWeatherService } from '../weather/weatherService';

// 天气查询工具定义
export const weatherTool: Tool = {
  name: 'get_weather',
  description: '查询指定城市的天气预报。当用户询问天气、气温、是否下雨等问题时使用此工具。',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: '城市名称,例如:北京、上海、成都',
      },
      days: {
        type: 'string',
        description: '查询天数,可选值:7(一周)、15(两周)',
        enum: ['7', '15'],
      },
    },
    required: ['city'],
  },
};

// 天气查询工具处理函数
async function handleWeatherQuery(args: { city: string; days?: string }) {
  const weatherService = getWeatherService();

  if (!weatherService) {
    // 尝试从环境变量初始化
    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
      return {
        error: '天气服务未配置,请在设置中配置和风天气API Key',
      };
    }
    initWeatherService(apiKey);
  }

  try {
    const service = getWeatherService();
    if (!service) {
      throw new Error('天气服务初始化失败');
    }

    const weather = await service.getWeatherForecast(args.city);
    const summary = service.generateWeatherSummary(weather);

    // 根据请求的天数返回对应数据
    const daysToShow = args.days === '7' ? 7 : 15;
    const limitedWeather = {
      ...weather,
      daily: weather.daily.slice(0, daysToShow),
    };

    return {
      weather: limitedWeather,
      summary,
    };
  } catch (error: any) {
    return {
      error: `查询天气失败: ${error.message}`,
    };
  }
}

// 注册天气工具
toolRegistry.register(weatherTool, handleWeatherQuery);
