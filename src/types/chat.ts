// 聊天消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

// 附件(攻略卡片、交通信息等)
export interface Attachment {
  type: 'guide' | 'flight' | 'weather' | 'itinerary';
  data: any;
}

// 聊天上下文
export interface ChatContext {
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  days: number | null;
  budget: string | null;
}

// 意图识别结果
export interface IntentResult {
  intent: 'guide' | 'flight' | 'weather' | 'trip' | 'chat';
  entities: Record<string, any>;
  confidence?: number;
}
