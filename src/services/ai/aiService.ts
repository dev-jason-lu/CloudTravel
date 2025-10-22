import Anthropic from '@anthropic-ai/sdk';
import { Message, ChatContext, IntentResult } from '@/types';
import { PROMPT_TEMPLATES } from './promptTemplates';

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
    this.client = new Anthropic({
      apiKey,
      // 在React Native中需要配置
      dangerouslyAllowBrowser: true,
    });
  }

  // 流式对话
  async *chatStream(
    messages: Message[],
    onChunk?: (text: string) => void
  ): AsyncGenerator<string> {
    try {
      const stream = await this.client.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: this.formatMessages(messages),
        system: PROMPT_TEMPLATES.system(this.context),
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text;
          onChunk?.(text);
          yield text;
        }
      }
    } catch (error) {
      console.error('AI stream error:', error);
      throw error;
    }
  }

  // 普通对话(非流式)
  async chat(messages: Message[]): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: this.formatMessages(messages),
        system: PROMPT_TEMPLATES.system(this.context),
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      return '';
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  // 意图识别
  async detectIntent(userMessage: string): Promise<IntentResult> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: PROMPT_TEMPLATES.intentDetection(userMessage),
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }

      return {
        intent: 'chat',
        entities: {},
      };
    } catch (error) {
      console.error('Intent detection error:', error);
      return {
        intent: 'chat',
        entities: {},
      };
    }
  }

  // 格式化消息
  private formatMessages(messages: Message[]): Array<{role: 'user' | 'assistant'; content: string}> {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  // 更新上下文
  updateContext(updates: Partial<ChatContext>) {
    this.context = { ...this.context, ...updates };
  }

  // 获取当前上下文
  getContext(): ChatContext {
    return { ...this.context };
  }

  // 重置上下文
  resetContext() {
    this.context = {
      destination: null,
      startDate: null,
      endDate: null,
      days: null,
      budget: null,
    };
  }
}

// 导出单例
let aiService: AIService | null = null;

export const initAIService = (apiKey: string) => {
  aiService = new AIService(apiKey);
  return aiService;
};

export const getAIService = (): AIService => {
  if (!aiService) {
    throw new Error('AI Service not initialized. Call initAIService first.');
  }
  return aiService;
};

export default AIService;
