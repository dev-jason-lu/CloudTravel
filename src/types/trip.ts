import { Location } from './guide';

// 用户行程
export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  itinerary: DailyPlan[];
  packingList: PackingItem[];
  createdAt: number;
  updatedAt: number;
}

// 每日行程
export interface DailyPlan {
  day: number;
  date: string;
  activities: Activity[];
}

// 活动
export interface Activity {
  id: string;
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'hotel';
  title: string;
  description: string;
  location?: Location;
  duration: number; // 分钟
  estimatedCost?: number;
}

// 行李物品
export interface PackingItem {
  id: string;
  category: 'documents' | 'clothing' | 'toiletries' | 'electronics' | 'medicine' | 'other';
  name: string;
  checked: boolean;
  suggested: boolean; // AI建议的
  quantity?: number;
}
