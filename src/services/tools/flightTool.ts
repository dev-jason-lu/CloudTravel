import { Tool, toolRegistry } from './registry';

// 交通查询工具定义
export const flightTool: Tool = {
  name: 'search_transportation',
  description: '查询机票和火车票信息。当用户询问机票价格、火车票查询、出行方式、交通工具时使用此工具。',
  parameters: {
    type: 'object',
    properties: {
      departure: {
        type: 'string',
        description: '出发城市',
      },
      destination: {
        type: 'string',
        description: '目的地城市',
      },
      date: {
        type: 'string',
        description: '出发日期 (YYYY-MM-DD格式)',
      },
      transportType: {
        type: 'string',
        enum: ['flight', 'train', 'all'],
        description: '交通类型: flight(飞机), train(火车), all(全部)',
      },
    },
    required: ['departure', 'destination', 'date'],
  },
};

// 交通信息接口
export interface TransportationInfo {
  id: string;
  type: 'flight' | 'train';
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // 分钟
  price: number;
  carrier: string; // 航空公司或铁路局
  flightNumber?: string;
  trainNumber?: string;
  cabin?: string; // 舱位等级
  seatType?: string; // 座位类型
  available: boolean;
  priceLevel: 'low' | 'medium' | 'high'; // 价格水平
}

// 模拟交通数据
const mockTransportationData: Record<string, TransportationInfo[]> = {
  // 北京到上海
  '北京-上海': [
    {
      id: 'CA1501',
      type: 'flight',
      departure: '北京首都国际机场',
      destination: '上海虹桥国际机场',
      departureTime: '08:00',
      arrivalTime: '10:30',
      duration: 150,
      price: 980,
      carrier: '中国国航',
      flightNumber: 'CA1501',
      cabin: '经济舱',
      available: true,
      priceLevel: 'medium',
    },
    {
      id: 'MU5101',
      type: 'flight',
      departure: '北京首都国际机场',
      destination: '上海浦东国际机场',
      departureTime: '10:30',
      arrivalTime: '13:00',
      duration: 150,
      price: 850,
      carrier: '东方航空',
      flightNumber: 'MU5101',
      cabin: '经济舱',
      available: true,
      priceLevel: 'low',
    },
    {
      id: 'G1',
      type: 'train',
      departure: '北京南站',
      destination: '上海虹桥站',
      departureTime: '07:00',
      arrivalTime: '11:28',
      duration: 268,
      price: 553,
      carrier: '中国铁路',
      trainNumber: 'G1',
      seatType: '二等座',
      available: true,
      priceLevel: 'low',
    },
    {
      id: 'G3',
      type: 'train',
      departure: '北京南站',
      destination: '上海虹桥站',
      departureTime: '09:00',
      arrivalTime: '13:40',
      duration: 280,
      price: 553,
      carrier: '中国铁路',
      trainNumber: 'G3',
      seatType: '二等座',
      available: true,
      priceLevel: 'low',
    },
  ],
  // 北京到成都
  '北京-成都': [
    {
      id: 'CA4101',
      type: 'flight',
      departure: '北京首都国际机场',
      destination: '成都双流国际机场',
      departureTime: '08:30',
      arrivalTime: '11:50',
      duration: 200,
      price: 1180,
      carrier: '中国国航',
      flightNumber: 'CA4101',
      cabin: '经济舱',
      available: true,
      priceLevel: 'medium',
    },
    {
      id: 'G89',
      type: 'train',
      departure: '北京西站',
      destination: '成都东站',
      departureTime: '07:40',
      arrivalTime: '19:32',
      duration: 712,
      price: 778,
      carrier: '中国铁路',
      trainNumber: 'G89',
      seatType: '二等座',
      available: true,
      priceLevel: 'medium',
    },
  ],
  // 上海到成都
  '上海-成都': [
    {
      id: 'MU5411',
      type: 'flight',
      departure: '上海虹桥国际机场',
      destination: '成都双流国际机场',
      departureTime: '09:00',
      arrivalTime: '12:20',
      duration: 200,
      price: 1050,
      carrier: '东方航空',
      flightNumber: 'MU5411',
      cabin: '经济舱',
      available: true,
      priceLevel: 'medium',
    },
    {
      id: 'G1971',
      type: 'train',
      departure: '上海虹桥站',
      destination: '成都东站',
      departureTime: '08:42',
      arrivalTime: '20:08',
      duration: 686,
      price: 720,
      carrier: '中国铁路',
      trainNumber: 'G1971',
      seatType: '二等座',
      available: true,
      priceLevel: 'medium',
    },
  ],
};

// 交通查询处理函数
async function handleTransportationSearch(args: {
  departure: string;
  destination: string;
  date: string;
  transportType?: 'flight' | 'train' | 'all';
}) {
  const { departure, destination, date, transportType = 'all' } = args;

  // 标准化城市名称(去掉"市"字)
  const normalizeCityName = (city: string) => city.replace('市', '');
  const depCity = normalizeCityName(departure);
  const destCity = normalizeCityName(destination);

  // 查找模拟数据
  const key = `${depCity}-${destCity}`;
  let results = mockTransportationData[key] || [];

  // 如果没有找到,返回空结果
  if (results.length === 0) {
    return {
      transportation: [],
      summary: `很抱歉,暂时没有找到从${departure}到${destination}在${date}的交通信息。\n\n建议:\n- 可尝试使用携程、飞猪等第三方平台查询\n- 检查城市名称是否正确\n- 尝试查询其他日期`,
    };
  }

  // 根据类型筛选
  if (transportType !== 'all') {
    results = results.filter((item) => item.type === transportType);
  }

  // 按价格排序
  results.sort((a, b) => a.price - b.price);

  // 统计信息
  const flights = results.filter((r) => r.type === 'flight');
  const trains = results.filter((r) => r.type === 'train');
  const minPrice = Math.min(...results.map((r) => r.price));
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + r.duration, 0) / results.length
  );

  // 生成摘要
  let summary = `✈️ 已为您查询${departure}到${destination}在${date}的交通信息\n\n`;
  summary += `📊 共找到${results.length}个班次:\n`;
  if (flights.length > 0) summary += `  - 飞机: ${flights.length}班\n`;
  if (trains.length > 0) summary += `  - 火车: ${trains.length}班\n`;
  summary += `\n💰 最低价格: ¥${minPrice}\n`;
  summary += `⏱️ 平均时长: ${Math.floor(avgDuration / 60)}小时${avgDuration % 60}分钟\n\n`;

  // 推荐前3个选项
  const topResults = results.slice(0, 3);
  summary += `🌟 推荐班次:\n\n`;
  topResults.forEach((item, index) => {
    const icon = item.type === 'flight' ? '✈️' : '🚄';
    const number = item.flightNumber || item.trainNumber;
    summary += `${index + 1}. ${icon} ${number} - ¥${item.price}\n`;
    summary += `   ${item.departureTime} → ${item.arrivalTime} (${Math.floor(item.duration / 60)}h${item.duration % 60}m)\n`;
    summary += `   ${item.departure} → ${item.destination}\n`;
    if (item.type === 'flight') {
      summary += `   ${item.carrier} | ${item.cabin}\n`;
    } else {
      summary += `   ${item.seatType}\n`;
    }
    summary += '\n';
  });

  summary += `\n💡 提示: 建议提前预订以获得更优惠的价格`;

  return {
    transportation: results,
    summary,
  };
}

// 注册交通查询工具
toolRegistry.register(flightTool, handleTransportationSearch);
