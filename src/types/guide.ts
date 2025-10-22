// 攻略类型
export type GuideCategory =
  | 'food' // 吃喝
  | 'entertainment' // 玩乐
  | 'culture' // 人文
  | 'nature' // 地理
  | 'accommodation' // 住宿
  | 'transport' // 交通
  | 'shopping' // 购物
  | 'practical'; // 实用信息

// 价格区间
export interface PriceRange {
  min: number;
  max: number;
  currency: string;
  level: 'budget' | 'moderate' | 'luxury'; // 穷游/舒适/奢华
}

// 地理位置
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
}

// 攻略内容
export interface GuideContent {
  id: string;
  destination: string;
  category: GuideCategory;
  title: string;
  description: string;
  images: string[];
  tags: string[]; // 标签(网红、小众、亲子等)
  rating: number; // 评分
  viewCount: number; // 浏览量
  price?: PriceRange;
  location?: Location;
  openTime?: string;
  duration?: number; // 建议游玩时长(分钟)
  tips: string[]; // 小贴士
  source: string; // 来源(小红书、马蜂窝等)
  createdAt?: number;
  updatedAt?: number;
}

// 筛选条件
export interface GuideFilter {
  categories?: GuideCategory[]; // 按主题筛选
  audienceType?: 'solo' | 'couple' | 'family' | 'senior' | 'student'; // 按人群
  budgetLevel?: 'budget' | 'moderate' | 'luxury'; // 按预算
  duration?: '1day' | '2-3days' | '4-7days' | 'long'; // 按时长
  season?: 'spring' | 'summer' | 'autumn' | 'winter'; // 按季节
  popularity?: 'hot' | 'niche' | 'trending'; // 按热度
  sortBy?: 'recommended' | 'popularity' | 'rating' | 'distance' | 'price'; // 排序
}
