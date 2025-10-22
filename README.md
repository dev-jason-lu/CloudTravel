# CloudTravel - AI智能旅行助手

CloudTravel是一款基于AI技术的智能旅行规划助手移动应用,通过自然对话的方式帮助用户规划行程、查询旅行信息、获取个性化旅行攻略,提供一站式旅行准备解决方案。

## 🌟 核心亮点

### 🤖 多AI模型支持
- **7大AI提供商**: Claude、OpenAI、Google Gemini、DeepSeek、智谱AI、Ollama、OpenRouter
- **15+模型可选**: 从Claude 3.5 Sonnet到本地Llama 3,灵活选择
- **开源模型支持**: 支持Ollama本地运行开源模型(Llama 3、Qwen 2、Mistral等)
- **一键切换**: 设置页面轻松切换AI提供商和模型

## 📱 功能特性

### 当前版本 (v1.2.0)

- ✅ **多AI模型支持**: 支持7大AI提供商,15+模型可选
- ✅ **AI Function Calling**: AI可自动调用工具完成复杂任务
- ✅ **智能天气查询**: AI自动识别天气需求并调用天气服务
- ✅ **攻略查询系统**: 北京、成都、上海等热门城市攻略数据
- ✅ **智能行程规划**: AI自动生成多日游详细行程
- ✅ **智能设置页面**: 可视化配置AI模型、API Key、模型参数
- ✅ **AI智能对话**: 流式响应,实时展示AI思考过程
- ✅ **状态管理**: Zustand + MMKV持久化存储
- ✅ **攻略展示页面**: 精美卡片式展示,支持分类筛选
- ✅ **智能着装建议**: 根据天气自动生成穿衣建议

### 规划中的功能

- 🔜 行程详情页面和编辑功能
- 🔜 收藏功能实现
- 🔜 机票火车票查询
- 🔜 行李清单智能推荐
- 🔜 多语言翻译助手
- 🔜 离线模式
- 🔜 旅行记录和相册

## 🎯 支持的AI模型

### Anthropic Claude
- **Claude 3.5 Sonnet** - 最强推理能力 ($3/$15 per M tokens)
- **Claude 3 Opus** - 最高智能水平 ($15/$75 per M tokens)
- **Claude 3 Haiku** - 快速响应 ($0.25/$1.25 per M tokens)

### OpenAI
- **GPT-4 Turbo** - OpenAI最强模型 ($10/$30 per M tokens)
- **GPT-4** - 经典GPT-4 ($30/$60 per M tokens)
- **GPT-3.5 Turbo** - 快速且经济 ($0.5/$1.5 per M tokens)

### Google Gemini
- **Gemini Pro** - Google最新AI ($0.5/$1.5 per M tokens)

### 国产模型
- **DeepSeek Chat** - 国产优质模型 ($1/$2 per M tokens)
- **GLM-4** - 智谱第四代 ($10/$10 per M tokens)
- **GLM-3 Turbo** - 快速版本 ($0.5/$0.5 per M tokens)

### 开源模型 (通过Ollama)
- **Llama 3 8B** - Meta开源模型,本地免费运行
- **Qwen 2 7B** - 阿里通义千问开源版
- **Mistral 7B** - 高性能开源模型

## 🛠 技术栈

- **框架**: Expo 50+ / React Native 0.73+
- **语言**: TypeScript 5.0+
- **状态管理**: Zustand 4.5+
- **导航**: Expo Router 3.4+
- **UI库**: React Native Paper
- **本地存储**: MMKV
- **AI服务**: Anthropic Claude API
- **列表优化**: @shopify/flash-list

## 📦 项目结构

```
CloudTravel/
├── app/                          # Expo Router 路由目录
│   ├── (tabs)/                   # 底部Tab导航
│   │   ├── index.tsx             # 首页(聊天页)
│   │   ├── guides.tsx            # 攻略页
│   │   ├── trips.tsx             # 行程页
│   │   ├── favorites.tsx         # 收藏页
│   │   └── profile.tsx           # 我的页
│   └── _layout.tsx               # 根布局
├── src/
│   ├── components/               # 通用组件
│   │   ├── chat/                 # 聊天相关组件
│   │   ├── guide/                # 攻略相关组件
│   │   ├── trip/                 # 行程相关组件
│   │   └── common/               # 通用组件
│   ├── services/                 # 业务服务层
│   │   └── ai/                   # AI服务
│   ├── store/                    # Zustand状态管理
│   ├── types/                    # TypeScript类型定义
│   ├── utils/                    # 工具函数
│   └── constants/                # 常量定义
├── assets/                       # 静态资源
├── .env.local                    # 环境变量(需自行创建)
├── package.json
└── tsconfig.json
```

## 🎮 使用示例

### 1. AI自动调用工具

**天气查询**:
```
用户: "北京下周天气怎么样?"
AI: 🔧 正在调用工具: get_weather...

北京未来一周天气:
🌡️ 温度: 15°C - 25°C (平均20°C)
☀️ 天气晴好,适合出行

👔 穿衣建议:
👔 长袖衬衫 🧥 薄外套 👖 长裤 ☀️ 防晒霜
```

**攻略查询**:
```
用户: "成都有什么好玩的?"
AI: 🔧 正在调用工具: search_guides...

找到3条成都的攻略:
1. 🐼 成都大熊猫繁育研究基地 - 观赏可爱的大熊猫
2. 🍜 宽窄巷子美食街 - 品尝成都小吃
3. 📚 武侯祠 - 探访三国文化
```

**行程规划**:
```
用户: "帮我规划北京3日游"
AI: 🔧 正在调用工具: plan_trip...

已为您生成北京3日游详细行程:

Day 1: 皇家古韵
08:00 - 天安门广场
09:30 - 故宫博物院
12:30 - 午餐 (老北京炸酱面)
...
```

### 2. 切换AI模型
```
我的 → 设置 → AI提供商 → 选择OpenAI → 选择GPT-4 → 配置API Key
```

### 3. 浏览攻略
```
攻略页面 → 选择分类(吃喝/玩乐/人文等) → 浏览卡片 → 点击查看详情
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的API密钥:

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件,填入以下配置:

```env
EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
EXPO_PUBLIC_AMAP_API_KEY=your_amap_api_key_here
```

### 3. 启动开发服务器

```bash
npm start
```

然后选择:
- 按 `i` 启动iOS模拟器
- 按 `a` 启动Android模拟器
- 扫描二维码在真机上运行

## 🔑 API密钥获取

### Claude API
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册账号并创建API密钥
3. 将密钥填入 `.env.local` 的 `EXPO_PUBLIC_CLAUDE_API_KEY`

### 和风天气API (可选)
1. 访问 [和风天气开发平台](https://dev.qweather.com/)
2. 注册并获取免费API密钥
3. 填入 `EXPO_PUBLIC_WEATHER_API_KEY`

### 高德地图API (可选)
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 创建应用获取Key
3. 填入 `EXPO_PUBLIC_AMAP_API_KEY`

## 📖 使用说明

### AI聊天功能

1. 打开应用进入聊天页面
2. 在输入框中输入旅行相关问题,例如:
   - "我想去成都旅游3天,帮我规划行程"
   - "北京有什么好吃的?"
   - "下周去上海天气怎么样?"
3. AI会实时流式返回回答

### 状态持久化

应用使用MMKV进行本地存储,聊天记录会自动保存,即使关闭应用后再打开,之前的对话仍然存在。

## 🔧 开发指南

### 添加新页面

使用Expo Router,在 `app/` 目录下创建新的路由文件:

```tsx
// app/new-page.tsx
export default function NewPage() {
  return <View><Text>新页面</Text></View>;
}
```

### 添加新的状态管理

在 `src/store/` 目录下创建新的store:

```typescript
import { create } from 'zustand';

interface MyState {
  // 定义状态
}

export const useMyStore = create<MyState>((set) => ({
  // 实现状态和actions
}));
```

### 添加新的AI功能

在 `src/services/ai/promptTemplates.ts` 中添加新的prompt模板,然后在 `aiService.ts` 中实现对应的方法。

## 📝 待办事项

详见 [PRD.md](./PRD.md) 和 [TECH_DESIGN.md](./TECH_DESIGN.md)

## 🐛 已知问题

- iOS上首次加载AI响应可能较慢
- Android上输入框在某些设备上可能有键盘遮挡问题

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交Issue和Pull Request!

## 📧 联系方式

如有问题,请提交Issue或联系开发者。
