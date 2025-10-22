import { Tool, toolRegistry } from './registry';
import { PackingItem } from '@/types';

// 行李清单工具定义
export const packingListTool: Tool = {
  name: 'generate_packing_list',
  description: '根据目的地、旅行天数和天气情况生成智能行李清单。当用户询问需要带什么东西、如何准备行李时使用此工具。',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        description: '目的地城市',
      },
      days: {
        type: 'string',
        description: '旅行天数',
      },
      weather: {
        type: 'string',
        description: '天气情况描述,例如:晴天、多雨、寒冷等',
      },
    },
    required: ['destination', 'days'],
  },
};

// 行李清单生成处理函数
async function handlePackingListGeneration(args: {
  destination: string;
  days: string;
  weather?: string;
}) {
  const { destination, days, weather } = args;
  const daysNum = parseInt(days);

  const packingList: PackingItem[] = [];

  // 1. 证件类 (必备)
  packingList.push(
    {
      id: 'doc-1',
      category: 'documents',
      name: '身份证',
      checked: false,
      suggested: true,
    },
    {
      id: 'doc-2',
      category: 'documents',
      name: '手机',
      checked: false,
      suggested: true,
    },
    {
      id: 'doc-3',
      category: 'documents',
      name: '钱包/银行卡',
      checked: false,
      suggested: true,
    },
    {
      id: 'doc-4',
      category: 'documents',
      name: '现金',
      checked: false,
      suggested: true,
    }
  );

  // 2. 衣物类 (根据天数和天气)
  const clothingItems: string[] = [];

  if (daysNum <= 3) {
    clothingItems.push('换洗衣物 2-3套', '内衣裤 3套', '袜子 3双');
  } else if (daysNum <= 7) {
    clothingItems.push('换洗衣物 4-5套', '内衣裤 5套', '袜子 5双');
  } else {
    clothingItems.push('换洗衣物 7套', '内衣裤 7套', '袜子 7双');
  }

  // 根据天气添加衣物
  if (weather?.includes('冷') || weather?.includes('冬')) {
    clothingItems.push('厚外套', '保暖内衣', '围巾', '手套', '帽子');
  } else if (weather?.includes('热') || weather?.includes('夏')) {
    clothingItems.push('短袖', '短裤', '防晒衣', '太阳帽', '太阳镜');
  } else if (weather?.includes('雨')) {
    clothingItems.push('雨衣/雨伞', '防水鞋', '长袖外套');
  } else {
    clothingItems.push('外套', '长袖衬衫', '长裤', '运动鞋');
  }

  clothingItems.forEach((item, index) => {
    packingList.push({
      id: `cloth-${index}`,
      category: 'clothing',
      name: item,
      checked: false,
      suggested: true,
    });
  });

  // 3. 洗护类
  const toiletries = [
    '洗漱用品(牙刷牙膏)',
    '洗发水/沐浴露',
    '毛巾',
    '护肤品',
    '防晒霜',
    '梳子',
  ];

  toiletries.forEach((item, index) => {
    packingList.push({
      id: `toilet-${index}`,
      category: 'toiletries',
      name: item,
      checked: false,
      suggested: true,
    });
  });

  // 4. 电子产品
  const electronics = [
    '手机充电器',
    '充电宝',
    '数据线',
    '耳机',
    '相机(可选)',
    '转换插头(可选)',
  ];

  electronics.forEach((item, index) => {
    packingList.push({
      id: `elec-${index}`,
      category: 'electronics',
      name: item,
      checked: false,
      suggested: true,
    });
  });

  // 5. 药品类
  const medicines = [
    '常用药品(感冒药)',
    '创可贴',
    '晕车药(如需)',
    '肠胃药',
    '个人常用药',
  ];

  medicines.forEach((item, index) => {
    packingList.push({
      id: `med-${index}`,
      category: 'medicine',
      name: item,
      checked: false,
      suggested: true,
    });
  });

  // 6. 其他
  const others = ['水杯', '背包/行李箱', '塑料袋', '纸巾/湿巾', '口罩'];

  others.forEach((item, index) => {
    packingList.push({
      id: `other-${index}`,
      category: 'other',
      name: item,
      checked: false,
      suggested: true,
    });
  });

  // 保存到store
  const { useTripStore } = await import('@/store');
  const currentTrip = useTripStore.getState().currentTrip;

  if (currentTrip) {
    useTripStore.getState().updateTrip(currentTrip.id, {
      packingList,
    });
  }

  // 生成摘要
  const summary = `✓ 已为您生成${destination}${days}天旅行的行李清单\n\n共${packingList.length}项物品:\n- 证件类: 4项\n- 衣物类: ${clothingItems.length}项\n- 洗护类: ${toiletries.length}项\n- 电子产品: ${electronics.length}项\n- 药品类: ${medicines.length}项\n- 其他: ${others.length}项\n\n已保存到行程中,可在行程详情页查看完整清单`;

  return {
    packingList,
    summary,
  };
}

// 注册行李清单工具
toolRegistry.register(packingListTool, handlePackingListGeneration);
