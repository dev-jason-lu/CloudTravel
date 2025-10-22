import { AIConfig, AIProvider, AIResponse } from '@/types';
import { Message } from '@/types';

// AI服务基类接口
export interface IAIService {
  chat(messages: Message[], config?: Partial<AIConfig>): Promise<AIResponse>;
  chatStream(
    messages: Message[],
    onChunk: (text: string) => void,
    config?: Partial<AIConfig>
  ): Promise<void>;
}

// 通用的消息格式化
export const formatMessagesForAPI = (messages: Message[]) => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};
