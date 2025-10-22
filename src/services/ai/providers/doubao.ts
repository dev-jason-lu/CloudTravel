import axios from 'axios';
import { IAIService, formatMessagesForAPI } from '../base';
import { AIConfig, AIResponse, Message } from '@/types';
import { PROMPT_TEMPLATES } from '../promptTemplates';

export class DoubaoService implements IAIService {
  private config: AIConfig;
  private client;

  constructor(config: AIConfig) {
    this.config = config;
    console.log('DoubaoService constructor called with config:', {
      provider: config.provider,
      model: config.model,
      baseURL: config.baseURL || 'https://ark.cn-beijing.volces.com/api/v3'
    });
    this.client = axios.create({
      baseURL: config.baseURL || 'https://ark.cn-beijing.volces.com/api/v3',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async chat(messages: Message[], configOverride?: Partial<AIConfig>): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...configOverride };
    console.log('DoubaoService.chat called with:', {
      model: finalConfig.model,
      messageCount: messages.length,
      baseURL: this.client.defaults.baseURL
    });

    try {
      const response = await this.client.post('/chat/completions', {
        model: finalConfig.model,
        messages: [
          { role: 'system', content: PROMPT_TEMPLATES.system({}) },
          ...formatMessagesForAPI(messages),
        ],
        max_tokens: finalConfig.maxTokens || 4096,
        temperature: finalConfig.temperature || 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      return {
        content: response.data.choices[0].message.content,
        usage: {
          inputTokens: response.data.usage.prompt_tokens,
          outputTokens: response.data.usage.completion_tokens,
        },
      };
    } catch (error) {
      console.error('Doubao API error:', error);
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
      console.log('DoubaoService.chatStream starting with config:', {
        model: finalConfig.model,
        messageCount: messages.length,
        baseURL: this.client.defaults.baseURL
      });

      // React Native环境下使用XMLHttpRequest实现流式响应（兼容性更好）
      console.log('Using XMLHttpRequest for React Native streaming compatibility');
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let buffer = '';
        let receivedLength = 0;

        xhr.open('POST', `${this.client.defaults.baseURL}/chat/completions`);
        xhr.setRequestHeader('Authorization', `Bearer ${finalConfig.apiKey}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'text/event-stream');
        xhr.responseType = 'text';

        // 处理流式数据
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.LOADING) {
            // 处理接收到的数据
            const newData = xhr.responseText.substring(receivedLength);
            receivedLength = xhr.responseText.length;
            
            if (newData) {
              buffer += newData;
              
              // 按行分割处理SSE数据
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  
                  if (data === '[DONE]') {
                    console.log('Received [DONE] signal');
                    resolve();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    
                    if (content) {
                      onChunk(content);
                    }
                  } catch (parseError) {
                    console.warn('Failed to parse SSE data:', data, parseError);
                  }
                }
              }
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Doubao stream completed successfully');
            resolve();
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };

        xhr.ontimeout = () => {
          reject(new Error('Request timeout'));
        };

        // 设置超时时间
        xhr.timeout = 30000;

        // 发送请求
        xhr.send(JSON.stringify({
          model: finalConfig.model,
          messages: [
            { role: 'system', content: PROMPT_TEMPLATES.system({}) },
            ...formatMessagesForAPI(messages),
          ],
          max_tokens: finalConfig.maxTokens || 4096,
          temperature: finalConfig.temperature || 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          stream: true,
        }));
      });

    } catch (error) {
      console.error('Doubao stream error:', error);
      throw error;
    }
  }
}