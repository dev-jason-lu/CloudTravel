# CloudTravel 技术架构设计文档

## 一、技术栈选型

### 1.1 核心技术栈

| 技术领域 | 技术选型 | 版本要求 | 选型理由 |
|---------|---------|---------|---------|
| **开发框架** | Expo | 50+ | 跨平台开发效率高,提供丰富的原生API封装 |
| **UI框架** | React Native | 0.73+ | 基于React,社区成熟,生态丰富 |
| **编程语言** | TypeScript | 5.0+ | 类型安全,提升代码质量和可维护性 |
| **状态管理** | Zustand | 4.5+ | 轻量级,API简洁,性能优秀 |
| **路由导航** | React Navigation | 6.x | RN官方推荐,功能强大 |
| **UI组件库** | React Native Paper | 5.x | Material Design风格,组件丰富 |
| **网络请求** | Axios | 1.6+ | 功能完善,支持拦截器和请求取消 |
| **本地存储** | MMKV | 2.x | 性能优于AsyncStorage,支持加密 |
| **样式方案** | StyleSheet + NativeWind | - | 原生样式 + Tailwind CSS语法 |

### 1.2 第三方SDK/API集成

| 功能模块 | 服务提供商 | 备选方案 |
|---------|-----------|---------|
| **AI对话** | Anthropic Claude API | OpenAI GPT-4 / Google Gemini |
| **天气数据** | 和风天气 API | OpenWeatherMap / 中国天气网 |
| **地图服务** | 高德地图 | Google Maps / 百度地图 |
| **机票查询** | 携程API / 飞猪API | 去哪儿API / 天巡API |
| **火车票查询** | 12306 / 携程API | 智行API |
| **攻略数据** | Web爬虫 + AI整理 | 马蜂窝API / 穷游API |

---

## 二、项目架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         Presentation Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Chat Screen │  │ Guide Screen │  │ Trip Screen  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Profile      │  │ Favorites    │  │ Detail Pages │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        Business Logic Layer                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ AI Service  │  │Guide Service│  │Weather Svc  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │Flight Svc   │  │ Trip Manager│  │ User Manager│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                          Data Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ HTTP Client │  │Local Storage│  │    Cache    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        External Services                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Claude API  │  │ Weather API │  │  Map API    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Flight API  │  │  Guide Data │  │  Image CDN  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构设计

```
CloudTravel/
├── app/                          # Expo Router 路由目录
│   ├── (tabs)/                   # 底部Tab导航
│   │   ├── index.tsx             # 首页(聊天页)
│   │   ├── guides.tsx            # 攻略页
│   │   ├── trips.tsx             # 行程页
│   │   ├── favorites.tsx         # 收藏页
│   │   └── profile.tsx           # 我的页
│   ├── guide/
│   │   └── [id].tsx              # 攻略详情页
│   ├── trip/
│   │   └── [id].tsx              # 行程详情页
│   ├── _layout.tsx               # 根布局
│   └── +not-found.tsx            # 404页面
├── src/
│   ├── components/               # 通用组件
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx    # 聊天气泡
│   │   │   ├── MessageList.tsx   # 消息列表
│   │   │   └── InputBar.tsx      # 输入栏
│   │   ├── guide/
│   │   │   ├── GuideCard.tsx     # 攻略卡片
│   │   │   ├── GuideFilter.tsx   # 攻略筛选器
│   │   │   └── GuideDetail.tsx   # 攻略详情
│   │   ├── trip/
│   │   │   ├── TripCard.tsx      # 行程卡片
│   │   │   ├── DayPlan.tsx       # 每日计划
│   │   │   └── ActivityItem.tsx  # 活动项
│   │   ├── weather/
│   │   │   └── WeatherCard.tsx   # 天气卡片
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Loading.tsx
│   │       └── EmptyState.tsx
│   ├── services/                 # 业务服务层
│   │   ├── ai/
│   │   │   ├── aiService.ts      # AI对话服务
│   │   │   └── promptTemplates.ts # Prompt模板
│   │   ├── guide/
│   │   │   ├── guideService.ts   # 攻略服务
│   │   │   └── guideParser.ts    # 攻略解析器
│   │   ├── weather/
│   │   │   └── weatherService.ts # 天气服务
│   │   ├── flight/
│   │   │   └── flightService.ts  # 机票服务
│   │   └── trip/
│   │       └── tripService.ts    # 行程服务
│   ├── api/                      # API请求层
│   │   ├── client.ts             # Axios实例配置
│   │   ├── endpoints.ts          # API端点定义
│   │   └── interceptors.ts       # 请求/响应拦截器
│   ├── store/                    # 状态管理
│   │   ├── useChatStore.ts       # 聊天状态
│   │   ├── useGuideStore.ts      # 攻略状态
│   │   ├── useTripStore.ts       # 行程状态
│   │   ├── useUserStore.ts       # 用户状态
│   │   └── index.ts              # Store导出
│   ├── types/                    # TypeScript类型定义
│   │   ├── chat.ts
│   │   ├── guide.ts
│   │   ├── trip.ts
│   │   ├── weather.ts
│   │   └── index.ts
│   ├── utils/                    # 工具函数
│   │   ├── storage.ts            # 本地存储工具
│   │   ├── date.ts               # 日期处理
│   │   ├── format.ts             # 格式化工具
│   │   └── validation.ts         # 验证工具
│   ├── constants/                # 常量定义
│   │   ├── colors.ts
│   │   ├── sizes.ts
│   │   └── config.ts
│   └── hooks/                    # 自定义Hooks
│       ├── useDebounce.ts
│       ├── useThrottle.ts
│       └── useInfiniteScroll.ts
├── assets/                       # 静态资源
│   ├── images/
│   ├── fonts/
│   └── icons/
├── .env.example                  # 环境变量示例
├── app.json                      # Expo配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 三、核心模块设计

### 3.1 AI对话模块

#### 3.1.1 功能设计
- 支持流式响应(Streaming)提升用户体验
- 意图识别:自动判断用户查询类型
- 上下文管理:保持多轮对话连贯性
- 错误重试机制

#### 3.1.2 技术实现

```typescript
// services/ai/aiService.ts

import Anthropic from '@anthropic-ai/sdk';
import { Message, ChatContext } from '@/types/chat';

class AIService {
  private client: Anthropic;
  private context: ChatContext = {
    destination: null,
    startDate: null,
    endDate: null,
    days: null,
    budget: null,
  };

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  // 流式对话
  async *chatStream(
    messages: Message[],
    onChunk?: (text: string) => void
  ): AsyncGenerator<string> {
    const stream = await this.client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: this.formatMessages(messages),
      system: this.buildSystemPrompt(),
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const text = chunk.delta.text;
        onChunk?.(text);
        yield text;
      }
    }
  }

  // 意图识别
  async detectIntent(userMessage: string): Promise<{
    intent: 'guide' | 'flight' | 'weather' | 'trip' | 'chat';
    entities: Record<string, any>;
  }> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `分析用户意图并提取实体,返回JSON格式:\n${userMessage}`,
        },
      ],
    });

    return JSON.parse(response.content[0].text);
  }

  // 构建系统Prompt
  private buildSystemPrompt(): string {
    return `你是CloudTravel智能旅行助手,帮助用户规划旅行。
当前上下文:
- 目的地: ${this.context.destination || '未设置'}
- 出发日期: ${this.context.startDate || '未设置'}
- 旅行天数: ${this.context.days || '未设置'}

请根据用户需求提供:
1. 旅行攻略建议
2. 机票火车票查询
3. 天气信息
4. 行程规划
5. 行李清单

回答要友好、具体、实用。`;
  }

  // 格式化消息
  private formatMessages(messages: Message[]) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  // 更新上下文
  updateContext(updates: Partial<ChatContext>) {
    this.context = { ...this.context, ...updates };
  }
}

export default AIService;
```

#### 3.1.3 Prompt设计策略

```typescript
// services/ai/promptTemplates.ts

export const PROMPT_TEMPLATES = {
  // 攻略查询Prompt
  guideQuery: (destination: string, preferences?: string[]) => `
请为${destination}生成旅行攻略,包含以下维度:
${preferences?.map(p => `- ${p}`).join('\n') || '- 吃喝\n- 玩乐\n- 人文\n- 地理'}

返回结构化JSON格式。
`,

  // 行程规划Prompt
  tripPlanning: (destination: string, days: number, preferences?: string) => `
请为${destination} ${days}日游生成详细行程规划。
用户偏好: ${preferences || '均衡游玩'}

每日安排包括:
- 上午/下午/晚上活动
- 景点名称、地址、游玩时长
- 用餐建议
- 交通方式

返回JSON格式。
`,

  // 意图识别Prompt
  intentDetection: (userMessage: string) => `
分析用户消息的意图并提取关键实体:
消息: "${userMessage}"

返回格式:
{
  "intent": "guide|flight|weather|trip|chat",
  "entities": {
    "destination": "目的地",
    "date": "日期",
    "days": "天数"
  }
}
`,
};
```

### 3.2 攻略查询模块

#### 3.2.1 数据获取策略

**方案1: Web爬虫 + AI整理 (推荐)**
- 爬取小红书、马蜂窝、知乎等平台攻略
- 使用AI提取关键信息,结构化存储
- 定期更新数据,保证时效性

**方案2: 第三方API**
- 使用马蜂窝/穷游开放API
- 数据质量有保证,但可能有调用限制

#### 3.2.2 技术实现

```typescript
// services/guide/guideService.ts

import { GuideContent, GuideFilter } from '@/types/guide';
import { aiService } from './ai/aiService';

class GuideService {
  // 查询攻略
  async searchGuides(
    destination: string,
    filter?: GuideFilter
  ): Promise<GuideContent[]> {
    // 1. 从本地缓存查询
    const cached = await this.getCachedGuides(destination, filter);
    if (cached && !this.isCacheExpired(cached)) {
      return cached.data;
    }

    // 2. 从API获取原始攻略数据
    const rawData = await this.fetchRawGuides(destination);

    // 3. 使用AI整理和结构化
    const structuredGuides = await this.structureGuidesWithAI(rawData, filter);

    // 4. 缓存结果
    await this.cacheGuides(destination, structuredGuides);

    return structuredGuides;
  }

  // 使用AI结构化攻略数据
  private async structureGuidesWithAI(
    rawData: any[],
    filter?: GuideFilter
  ): Promise<GuideContent[]> {
    const prompt = `
将以下旅行攻略整理成结构化数据:
${JSON.stringify(rawData)}

按照以下分类整理:
- 吃喝 (food)
- 玩乐 (entertainment)
- 人文 (culture)
- 地理 (nature)
- 住宿 (accommodation)
- 交通 (transport)
- 购物 (shopping)
- 实用信息 (practical)

返回JSON数组格式。
`;

    const response = await aiService.chat([
      { role: 'user', content: prompt },
    ]);

    return JSON.parse(response);
  }

  // 筛选攻略
  filterGuides(guides: GuideContent[], filter: GuideFilter): GuideContent[] {
    let result = guides;

    // 按分类筛选
    if (filter.categories?.length) {
      result = result.filter(g => filter.categories!.includes(g.category));
    }

    // 按预算筛选
    if (filter.budgetLevel) {
      result = result.filter(g => g.price?.level === filter.budgetLevel);
    }

    // 按热度筛选
    if (filter.popularity) {
      result = this.filterByPopularity(result, filter.popularity);
    }

    // 排序
    if (filter.sortBy) {
      result = this.sortGuides(result, filter.sortBy);
    }

    return result;
  }

  // 排序逻辑
  private sortGuides(
    guides: GuideContent[],
    sortBy: GuideFilter['sortBy']
  ): GuideContent[] {
    switch (sortBy) {
      case 'popularity':
        return guides.sort((a, b) => b.viewCount - a.viewCount);
      case 'rating':
        return guides.sort((a, b) => b.rating - a.rating);
      case 'price':
        return guides.sort((a, b) => (a.price?.min || 0) - (b.price?.min || 0));
      default:
        return guides;
    }
  }
}

export const guideService = new GuideService();
```

### 3.3 天气查询模块

```typescript
// services/weather/weatherService.ts

import axios from 'axios';
import { WeatherInfo } from '@/types/weather';

class WeatherService {
  private apiKey: string;
  private baseURL = 'https://devapi.qweather.com/v7';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // 查询未来15天天气
  async getWeatherForecast(city: string): Promise<WeatherInfo> {
    // 1. 获取城市ID
    const locationId = await this.getCityId(city);

    // 2. 查询15天预报
    const response = await axios.get(`${this.baseURL}/weather/15d`, {
      params: {
        location: locationId,
        key: this.apiKey,
      },
    });

    return this.parseWeatherData(response.data);
  }

  // 生成着装建议
  generateClothingSuggestion(weather: WeatherInfo): string[] {
    const suggestions: string[] = [];
    const avgTemp = weather.daily.reduce((sum, d) => sum + d.tempMax, 0) / weather.daily.length;

    if (avgTemp > 30) {
      suggestions.push('防晒霜', '遮阳帽', '太阳镜', '轻薄衣物');
    } else if (avgTemp > 20) {
      suggestions.push('长袖衬衫', '薄外套', '防晒霜');
    } else if (avgTemp > 10) {
      suggestions.push('外套', '长裤', '围巾');
    } else {
      suggestions.push('厚外套', '保暖衣物', '手套', '帽子');
    }

    // 根据降雨概率
    const hasRain = weather.daily.some(d => d.precipProb > 50);
    if (hasRain) {
      suggestions.push('雨伞', '防水鞋');
    }

    return suggestions;
  }
}

export const weatherService = new WeatherService(process.env.WEATHER_API_KEY!);
```

### 3.4 状态管理设计

```typescript
// store/useChatStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentContext: {
    destination?: string;
    startDate?: string;
    days?: number;
  };
  addMessage: (message: Message) => void;
  updateContext: (context: Partial<ChatState['currentContext']>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      currentContext: {},

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateContext: (context) =>
        set((state) => ({
          currentContext: { ...state.currentContext, ...context },
        })),

      clearMessages: () =>
        set({ messages: [], currentContext: {} }),
    }),
    {
      name: 'chat-storage',
    }
  )
);
```

```typescript
// store/useGuideStore.ts

import { create } from 'zustand';
import { GuideContent, GuideFilter } from '@/types/guide';

interface GuideState {
  guides: GuideContent[];
  filter: GuideFilter;
  favorites: string[]; // 收藏的攻略ID
  setGuides: (guides: GuideContent[]) => void;
  updateFilter: (filter: Partial<GuideFilter>) => void;
  toggleFavorite: (guideId: string) => void;
}

export const useGuideStore = create<GuideState>((set) => ({
  guides: [],
  filter: {},
  favorites: [],

  setGuides: (guides) => set({ guides }),

  updateFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  toggleFavorite: (guideId) =>
    set((state) => ({
      favorites: state.favorites.includes(guideId)
        ? state.favorites.filter((id) => id !== guideId)
        : [...state.favorites, guideId],
    })),
}));
```

---

## 四、性能优化方案

### 4.1 数据缓存策略

| 数据类型 | 缓存时长 | 存储方式 | 更新策略 |
|---------|---------|---------|---------|
| 攻略数据 | 24小时 | MMKV | 后台静默更新 |
| 天气数据 | 6小时 | Memory Cache | 过期重新请求 |
| 机票数据 | 实时 | 不缓存 | 每次请求 |
| 用户行程 | 永久 | MMKV + 云端 | 双向同步 |
| AI对话历史 | 7天 | MMKV | LRU淘汰 |

### 4.2 图片加载优化

```typescript
// components/common/OptimizedImage.tsx

import { Image } from 'expo-image';

export const OptimizedImage = ({ uri, ...props }) => {
  return (
    <Image
      source={{ uri }}
      placeholder={blurhash}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk" // 内存+磁盘缓存
      {...props}
    />
  );
};
```

### 4.3 列表虚拟化

```typescript
// 使用 FlashList 替代 FlatList
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={guides}
  renderItem={({ item }) => <GuideCard guide={item} />}
  estimatedItemSize={200}
  // 更高性能的列表渲染
/>
```

### 4.4 请求优化

- **防抖/节流**: 搜索框输入防抖500ms
- **请求取消**: 页面离开时取消未完成请求
- **并发控制**: 限制同时最多3个并发请求
- **错误重试**: 失败后指数退避重试(1s, 2s, 4s)

---

## 五、安全设计

### 5.1 API密钥管理

```bash
# .env
CLAUDE_API_KEY=sk-ant-xxxxx
WEATHER_API_KEY=xxxxx
AMAP_API_KEY=xxxxx
```

```typescript
// 使用 expo-secure-store 加密存储
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async get(key: string) {
    return await SecureStore.getItemAsync(key);
  },
};
```

### 5.2 网络安全

- 所有API请求使用HTTPS
- 实现请求签名防止篡改
- 设置请求超时(30s)
- 敏感数据本地加密存储

### 5.3 用户隐私

- 聊天记录本地存储,不上传服务器
- 位置信息仅在用户授权后使用
- 遵守GDPR/个人信息保护法

---

## 六、测试策略

### 6.1 单元测试

```typescript
// __tests__/services/guideService.test.ts

import { guideService } from '@/services/guide/guideService';

describe('GuideService', () => {
  it('should filter guides by category', () => {
    const guides = [
      { id: '1', category: 'food', title: '火锅' },
      { id: '2', category: 'entertainment', title: '景点' },
    ];

    const filtered = guideService.filterGuides(guides, {
      categories: ['food'],
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe('food');
  });
});
```

### 6.2 集成测试

- 测试AI服务与后端API集成
- 测试导航流程
- 测试数据持久化

### 6.3 E2E测试

使用Detox进行端到端测试:
- 用户完整流程测试(查询攻略 → 创建行程 → 收藏)
- 关键路径测试

---

## 七、部署方案

### 7.1 开发环境

```bash
# 启动开发服务器
npx expo start

# iOS模拟器
npx expo run:ios

# Android模拟器
npx expo run:android
```

### 7.2 生产构建

```bash
# 配置EAS Build
eas build:configure

# iOS构建
eas build --platform ios --profile production

# Android构建
eas build --platform android --profile production
```

### 7.3 发布流程

1. **内测版本**: 使用TestFlight(iOS) / Google Play Internal Testing(Android)
2. **公开测试**: 开放部分用户测试,收集反馈
3. **正式发布**: 提交App Store / Google Play审核
4. **OTA更新**: 使用Expo Updates进行热更新(非原生代码变更)

---

## 八、监控与分析

### 8.1 性能监控

使用Sentry监控:
- Crash报告
- 性能指标(启动时间、页面加载时间)
- 网络请求失败率

### 8.2 用户行为分析

集成Firebase Analytics:
- 页面浏览量
- 功能使用频率
- 用户留存率
- 转化漏斗分析

### 8.3 日志系统

```typescript
// utils/logger.ts

class Logger {
  info(message: string, meta?: any) {
    console.log(`[INFO] ${message}`, meta);
    // 发送到日志服务
  }

  error(error: Error, context?: any) {
    console.error('[ERROR]', error, context);
    Sentry.captureException(error, { contexts: context });
  }

  track(event: string, properties?: any) {
    analytics().logEvent(event, properties);
  }
}

export const logger = new Logger();
```

---

## 九、后续扩展规划

### 9.1 功能扩展
- [ ] 多语言支持(i18n)
- [ ] 社交功能(旅行分享、好友同行)
- [ ] VIP会员体系
- [ ] 旅行保险推荐
- [ ] 签证办理指南

### 9.2 技术优化
- [ ] 引入GraphQL替代REST API
- [ ] 实现离线模式(Service Worker)
- [ ] 优化包体积(代码分割、懒加载)
- [ ] 引入Web端(使用React Native Web)

---

## 十、开发规范

### 10.1 代码规范

```json
// .eslintrc.js
{
  "extends": [
    "expo",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### 10.2 Git Commit规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链配置
```

### 10.3 代码审查清单

- [ ] TypeScript类型定义完整
- [ ] 组件可复用性
- [ ] 性能优化(避免不必要渲染)
- [ ] 错误处理完善
- [ ] 代码注释清晰
- [ ] 单元测试覆盖

---

## 总结

本技术架构设计基于Expo + React Native + TypeScript技术栈,采用分层架构设计,模块化开发,确保代码可维护性和可扩展性。

核心优势:
- **跨平台**: 一套代码同时支持iOS和Android
- **类型安全**: TypeScript保证代码质量
- **性能优化**: 缓存、虚拟化、懒加载等多种优化手段
- **AI驱动**: Claude API提供智能对话和内容整理能力
- **可扩展**: 模块化设计,易于添加新功能

接下来将按照此架构进行项目初始化和功能开发。
