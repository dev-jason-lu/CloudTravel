import { Tool, toolRegistry } from './registry';
import { GuideContent } from '@/types';

// 攻略查询工具定义
export const guideTool: Tool = {
  name: 'search_guides',
  description: '搜索旅行攻略。当用户询问某个城市有什么好玩的、好吃的、景点推荐等问题时使用此工具。',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        description: '目的地城市,例如:北京、成都、西安',
      },
      category: {
        type: 'string',
        description: '攻略类别',
        enum: ['food', 'entertainment', 'culture', 'nature', 'accommodation', 'shopping', 'all'],
      },
    },
    required: ['destination'],
  },
};

// 模拟攻略数据
const mockGuides: Record<string, GuideContent[]> = {
  北京: [
    {
      id: 'bj-1',
      destination: '北京',
      category: 'culture',
      title: '故宫博物院',
      description: '世界上现存规模最大、保存最为完整的木质结构古建筑之一。明清两代的皇宫,见证了中国500多年的历史变迁。',
      images: [],
      tags: ['热门', '历史', '必去'],
      rating: 4.8,
      viewCount: 125000,
      price: { min: 60, max: 60, currency: 'CNY', level: 'moderate' },
      openTime: '8:30-17:00(周一闭馆)',
      duration: 180,
      tips: [
        '建议提前在官网预约门票',
        '至少预留3小时游览时间',
        '推荐租借讲解器或请导游',
        '注意周一闭馆',
      ],
      source: '小红书',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'bj-2',
      destination: '北京',
      category: 'food',
      title: '全聚德烤鸭',
      description: '北京烤鸭的代表,拥有150多年历史。皮脆肉嫩,配上薄饼、葱丝、甜面酱,是来北京必尝的美食。',
      images: [],
      tags: ['美食', '老字号', '特色'],
      rating: 4.5,
      viewCount: 89000,
      price: { min: 200, max: 400, currency: 'CNY', level: 'moderate' },
      tips: ['建议提前预约', '推荐点半只烤鸭+配菜', '人均200-400元'],
      source: '大众点评',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'bj-3',
      destination: '北京',
      category: 'nature',
      title: '八达岭长城',
      description: '万里长城最具代表性的一段,气势磅礴。登上长城,感受古代军事防御工程的宏伟。',
      images: [],
      tags: ['必去', '爬山', '摄影'],
      rating: 4.7,
      viewCount: 156000,
      price: { min: 40, max: 40, currency: 'CNY', level: 'budget' },
      openTime: '6:30-19:00',
      duration: 240,
      tips: ['建议早上前往避开人流', '穿舒适的运动鞋', '带足够的水', '注意防晒'],
      source: '马蜂窝',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  成都: [
    {
      id: 'cd-1',
      destination: '成都',
      category: 'food',
      title: '宽窄巷子美食街',
      description: '成都最具代表性的历史文化街区,汇集了各种成都小吃和川菜。三大炮、龙抄手、钟水饺等美食应有尽有。',
      images: [],
      tags: ['美食', '小吃', '网红'],
      rating: 4.6,
      viewCount: 98000,
      price: { min: 50, max: 150, currency: 'CNY', level: 'moderate' },
      tips: ['避开周末高峰期', '推荐下午4点后去', '注意防范小偷'],
      source: '小红书',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'cd-2',
      destination: '成都',
      category: 'entertainment',
      title: '成都大熊猫繁育研究基地',
      description: '世界著名的大熊猫迁地保护基地。可以近距离观察国宝大熊猫,早上8-10点是最佳观赏时间。',
      images: [],
      tags: ['亲子', '动物', '必去'],
      rating: 4.9,
      viewCount: 178000,
      price: { min: 55, max: 55, currency: 'CNY', level: 'moderate' },
      openTime: '7:30-18:00',
      duration: 180,
      tips: ['早上去看熊猫最活跃', '建议游览3小时', '可以租电瓶车代步'],
      source: '携程',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'cd-3',
      destination: '成都',
      category: 'culture',
      title: '武侯祠',
      description: '中国唯一的君臣合祀祠庙,纪念三国时期蜀汉丞相诸葛亮。红墙竹影,古朴典雅。',
      images: [],
      tags: ['历史', '三国', '文化'],
      rating: 4.7,
      viewCount: 67000,
      price: { min: 50, max: 50, currency: 'CNY', level: 'moderate' },
      openTime: '8:00-18:00',
      duration: 120,
      tips: ['建议请导游讲解', '与锦里相邻可一起游览', '夏天注意防晒'],
      source: '马蜂窝',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  上海: [
    {
      id: 'sh-1',
      destination: '上海',
      category: 'entertainment',
      title: '外滩',
      description: '上海最具代表性的地标,黄浦江畔的万国建筑博览群。夜景尤其迷人,可以看到对岸陆家嘴的璀璨灯光。',
      images: [],
      tags: ['地标', '夜景', '摄影'],
      rating: 4.8,
      viewCount: 256000,
      price: { min: 0, max: 0, currency: 'CNY', level: 'budget' },
      openTime: '全天',
      duration: 120,
      tips: ['晚上7点后夜景最美', '注意保管财物', '可乘轮渡游江'],
      source: '小红书',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'sh-2',
      destination: '上海',
      category: 'food',
      title: '南翔小笼包',
      description: '上海最著名的小吃之一,皮薄馅大汁多。城隍庙的南翔馒头店是老字号,值得一试。',
      images: [],
      tags: ['小吃', '老字号', '排队'],
      rating: 4.6,
      viewCount: 125000,
      price: { min: 30, max: 80, currency: 'CNY', level: 'budget' },
      tips: ['建议避开用餐高峰', '一笼8个,建议多点几样', '吃时小心烫嘴'],
      source: '大众点评',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
};

// 攻略查询处理函数
async function handleGuideSearch(args: { destination: string; category?: string }) {
  const { destination, category = 'all' } = args;

  // 获取该城市的攻略
  const cityGuides = mockGuides[destination] || [];

  if (cityGuides.length === 0) {
    return {
      guides: [],
      message: `暂无${destination}的攻略数据,但我可以根据常识为您提供一些建议。`,
    };
  }

  // 按类别筛选
  let filteredGuides = cityGuides;
  if (category !== 'all') {
    filteredGuides = cityGuides.filter((g) => g.category === category);
  }

  return {
    guides: filteredGuides,
    total: filteredGuides.length,
    message: `找到${filteredGuides.length}条${destination}的攻略`,
  };
}

// 注册攻略工具
toolRegistry.register(guideTool, handleGuideSearch);
