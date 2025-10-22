import { Tool, toolRegistry } from './registry';
import { Trip, DailyPlan, Activity } from '@/types';

// 行程规划工具定义
export const tripPlanningTool: Tool = {
  name: 'plan_trip',
  description: '为用户规划详细的旅行行程。当用户要求制定行程、安排几日游计划时使用此工具。',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        description: '目的地城市',
      },
      days: {
        type: 'string',
        description: '旅行天数,例如:3、5、7',
      },
      startDate: {
        type: 'string',
        description: '出发日期,格式:YYYY-MM-DD',
      },
      preferences: {
        type: 'string',
        description: '旅行偏好,例如:美食、文化、自然风光、休闲',
      },
    },
    required: ['destination', 'days'],
  },
};

// 模拟行程规划数据
const tripTemplates: Record<string, any> = {
  北京: {
    3: [
      {
        day: 1,
        title: '皇家古韵',
        activities: [
          {
            time: '08:00',
            type: 'attraction',
            title: '天安门广场',
            description: '观看升国旗仪式,参观人民英雄纪念碑',
            duration: 60,
          },
          {
            time: '09:30',
            type: 'attraction',
            title: '故宫博物院',
            description: '游览紫禁城,探索明清皇家宫殿',
            duration: 180,
          },
          {
            time: '12:30',
            type: 'meal',
            title: '午餐 - 老北京炸酱面',
            description: '品尝地道北京小吃',
            duration: 60,
          },
          {
            time: '14:00',
            type: 'attraction',
            title: '景山公园',
            description: '登顶俯瞰故宫全景',
            duration: 90,
          },
          {
            time: '16:00',
            type: 'attraction',
            title: '南锣鼓巷',
            description: '漫步胡同,体验老北京文化',
            duration: 120,
          },
          {
            time: '18:30',
            type: 'meal',
            title: '晚餐 - 全聚德烤鸭',
            description: '享用正宗北京烤鸭',
            duration: 90,
          },
        ],
      },
      {
        day: 2,
        title: '长城之旅',
        activities: [
          {
            time: '07:00',
            type: 'transport',
            title: '前往八达岭长城',
            description: '乘坐旅游大巴或自驾,车程约2小时',
            duration: 120,
          },
          {
            time: '09:30',
            type: 'attraction',
            title: '八达岭长城',
            description: '攀登长城,感受壮丽景色',
            duration: 240,
          },
          {
            time: '14:00',
            type: 'meal',
            title: '午餐',
            description: '景区周边用餐',
            duration: 60,
          },
          {
            time: '15:30',
            type: 'transport',
            title: '返回市区',
            description: '返程',
            duration: 120,
          },
          {
            time: '18:00',
            type: 'attraction',
            title: '王府井大街',
            description: '逛街购物,品尝小吃',
            duration: 120,
          },
        ],
      },
      {
        day: 3,
        title: '文化休闲',
        activities: [
          {
            time: '09:00',
            type: 'attraction',
            title: '颐和园',
            description: '游览皇家园林,欣赏昆明湖美景',
            duration: 180,
          },
          {
            time: '12:30',
            type: 'meal',
            title: '午餐',
            description: '园区周边用餐',
            duration: 60,
          },
          {
            time: '14:00',
            type: 'attraction',
            title: '圆明园遗址公园',
            description: '了解历史,感受沧桑',
            duration: 120,
          },
          {
            time: '16:30',
            type: 'attraction',
            title: '清华北大校园',
            description: '参观著名学府',
            duration: 120,
          },
        ],
      },
    ],
  },
  成都: {
    3: [
      {
        day: 1,
        title: '熊猫与美食',
        activities: [
          {
            time: '08:00',
            type: 'attraction',
            title: '成都大熊猫繁育研究基地',
            description: '观赏可爱的大熊猫',
            duration: 180,
          },
          {
            time: '12:00',
            type: 'meal',
            title: '午餐 - 川菜',
            description: '品尝正宗川菜',
            duration: 90,
          },
          {
            time: '14:00',
            type: 'attraction',
            title: '宽窄巷子',
            description: '逛特色小巷,品尝小吃',
            duration: 150,
          },
          {
            time: '17:00',
            type: 'attraction',
            title: '人民公园',
            description: '喝茶休闲,体验成都慢生活',
            duration: 120,
          },
          {
            time: '19:30',
            type: 'meal',
            title: '晚餐 - 火锅',
            description: '享用成都火锅',
            duration: 120,
          },
        ],
      },
      {
        day: 2,
        title: '文化古韵',
        activities: [
          {
            time: '09:00',
            type: 'attraction',
            title: '武侯祠',
            description: '探访三国文化',
            duration: 120,
          },
          {
            time: '11:30',
            type: 'attraction',
            title: '锦里古街',
            description: '逛古街,买特产',
            duration: 150,
          },
          {
            time: '14:00',
            type: 'meal',
            title: '午餐',
            description: '锦里特色小吃',
            duration: 60,
          },
          {
            time: '15:30',
            type: 'attraction',
            title: '杜甫草堂',
            description: '参观诗圣故居',
            duration: 120,
          },
          {
            time: '18:00',
            type: 'attraction',
            title: '九眼桥',
            description: '欣赏夜景,体验夜生活',
            duration: 120,
          },
        ],
      },
      {
        day: 3,
        title: '古镇风情',
        activities: [
          {
            time: '09:00',
            type: 'transport',
            title: '前往都江堰',
            description: '乘坐城际列车',
            duration: 60,
          },
          {
            time: '10:30',
            type: 'attraction',
            title: '都江堰景区',
            description: '参观古代水利工程',
            duration: 180,
          },
          {
            time: '14:00',
            type: 'meal',
            title: '午餐',
            description: '当地特色',
            duration: 60,
          },
          {
            time: '15:30',
            type: 'attraction',
            title: '青城山',
            description: '登山游览道教名山',
            duration: 180,
          },
        ],
      },
    ],
  },
};

// 行程规划处理函数
async function handleTripPlanning(args: {
  destination: string;
  days: string;
  startDate?: string;
  preferences?: string;
}) {
  const { destination, days, startDate, preferences } = args;
  const daysNum = parseInt(days);

  // 获取模板行程
  const template = tripTemplates[destination]?.[daysNum];

  if (!template) {
    return {
      message: `暂无${destination}的${days}日游模板,我将为您生成通用行程建议。`,
    };
  }

  // 构建行程对象
  const trip: Trip = {
    id: `trip-${Date.now()}`,
    destination,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: startDate
      ? new Date(new Date(startDate).getTime() + daysNum * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      : '',
    days: daysNum,
    itinerary: template.map((dayPlan: any, index: number) => ({
      day: index + 1,
      date: startDate
        ? new Date(new Date(startDate).getTime() + index * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        : '',
      activities: dayPlan.activities.map((act: any, actIndex: number) => ({
        id: `act-${index}-${actIndex}`,
        ...act,
      })),
    })),
    packingList: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 保存行程到store
  const { useTripStore } = await import('@/store');
  useTripStore.getState().addTrip(trip);
  useTripStore.getState().setCurrentTrip(trip);

  return {
    trip,
    message: `✓ 已为您生成${destination}${days}日游详细行程并保存\n\n您可以在"行程"页面查看完整行程`,
  };
}

// 注册行程规划工具
toolRegistry.register(tripPlanningTool, handleTripPlanning);
