export const PROMPT_TEMPLATES = {
  // 系统Prompt
  system: (context: {
    destination?: string;
    startDate?: string;
    days?: number;
  }) => `你是CloudTravel智能旅行助手,帮助用户规划旅行。

当前上下文:
- 目的地: ${context.destination || '未设置'}
- 出发日期: ${context.startDate || '未设置'}
- 旅行天数: ${context.days || '未设置'}

请根据用户需求提供:
1. 旅行攻略建议
2. 机票火车票查询
3. 天气信息
4. 行程规划
5. 行李清单

回答要友好、具体、实用,使用中文回复。`,

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

  // 行李清单生成Prompt
  packingList: (destination: string, days: number, weather: string) => `
请为去${destination}旅行${days}天生成行李清单。
天气情况: ${weather}

请分类列出:
- 证件类
- 衣物类
- 洗护类
- 电子产品
- 药品类
- 其他

返回JSON数组格式,每项包含category、name、suggested字段。
`,
};
