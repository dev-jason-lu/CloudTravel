import axios from 'axios';
import { IAIService, formatMessagesForAPI } from '../base';
import { AIConfig, AIResponse, Message } from '@/types';
import { PROMPT_TEMPLATES } from '../promptTemplates';

// Ollama本地模型服务
export class OllamaService implements IAIService {
  private config: AIConfig;
  private client;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'http://localhost:11434',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async chat(messages: Message[], configOverride?: Partial<AIConfig>): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...configOverride };

    try {
      const response = await this.client.post('/api/chat', {
        model: finalConfig.model,
        messages: [
          { role: 'system', content: PROMPT_TEMPLATES.system({}) },
          ...formatMessagesForAPI(messages),
        ],
        stream: false,
      });

      return {
        content: response.data.message.content,
        usage: {
          inputTokens: response.data.prompt_eval_count || 0,
          outputTokens: response.data.eval_count || 0,
        },
      };
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  async chatStream(
    messages: Message[],
    onChunk: (text: string) => void,
    configOverride?: Partial<AIConfig>
  ): Promise<void> {
    const finalConfig = { ...this.config, ...configOverride };

    try {
      const response = await this.client.post(
        '/api/chat',
        {
          model: finalConfig.model,
          messages: [
            { role: 'system', content: PROMPT_TEMPLATES.system({}) },
            ...formatMessagesForAPI(messages),
          ],
          stream: true,
        },
        {
          responseType: 'stream',
        }
      );

      const stream = response.data;
      let buffer = '';

      stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.message?.content) {
                onChunk(parsed.message.content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Ollama stream error:', error);
      throw error;
    }
  }
}

// 通用OpenAI兼容服务(DeepSeek、智谱等)
export class OpenAICompatibleService implements IAIService {
  private config: AIConfig;
  private client;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async chat(messages: Message[], configOverride?: Partial<AIConfig>): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...configOverride };

    try {
      const response = await this.client.post('/chat/completions', {
        model: finalConfig.model,
        messages: [
          { role: 'system', content: PROMPT_TEMPLATES.system({}) },
          ...formatMessagesForAPI(messages),
        ],
        max_tokens: finalConfig.maxTokens || 4096,
        temperature: finalConfig.temperature || 0.7,
      });

      return {
        content: response.data.choices[0].message.content,
        usage: {
          inputTokens: response.data.usage.prompt_tokens,
          outputTokens: response.data.usage.completion_tokens,
        },
      };
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async chatStream(
    messages: Message[],
    onChunk: (text: string) => void,
    configOverride?: Partial<AIConfig>
  ): Promise<void> {
    const finalConfig = { ...this.config, ...configOverride };

    try {
      const response = await this.client.post(
        '/chat/completions',
        {
          model: finalConfig.model,
          messages: [
            { role: 'system', content: PROMPT_TEMPLATES.system({}) },
            ...formatMessagesForAPI(messages),
          ],
          max_tokens: finalConfig.maxTokens || 4096,
          temperature: finalConfig.temperature || 0.7,
          stream: true,
        },
        {
          responseType: 'stream',
        }
      );

      const stream = response.data;
      let buffer = '';

      stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }
}
