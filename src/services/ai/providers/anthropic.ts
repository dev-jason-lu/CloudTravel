import Anthropic from '@anthropic-ai/sdk';
import { IAIService, formatMessagesForAPI } from '../base';
import { AIConfig, AIResponse, Message } from '@/types';
import { PROMPT_TEMPLATES } from '../promptTemplates';
import { toolRegistry, Tool, ToolCall } from '@/services/tools';

export class AnthropicService implements IAIService {
  private client: Anthropic;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    console.log('AnthropicService constructor called with config:', {
      provider: config.provider,
      model: config.model
    });
    this.client = new Anthropic({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async chat(messages: Message[], configOverride?: Partial<AIConfig>): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...configOverride };

    try {
      const response = await this.client.messages.create({
        model: finalConfig.model,
        max_tokens: finalConfig.maxTokens || 4096,
        temperature: finalConfig.temperature || 1,
        messages: formatMessagesForAPI(messages),
        system: PROMPT_TEMPLATES.system({}),
        tools: this.convertTools(toolRegistry.getToolDefinitions()),
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      return {
        content: text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
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
      const stream = await this.client.messages.stream({
        model: finalConfig.model,
        max_tokens: finalConfig.maxTokens || 4096,
        temperature: finalConfig.temperature || 1,
        messages: formatMessagesForAPI(messages),
        system: PROMPT_TEMPLATES.system({}),
        tools: this.convertTools(toolRegistry.getToolDefinitions()),
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          onChunk(chunk.delta.text);
        } else if (chunk.type === 'content_block_start' && chunk.content_block.type === 'tool_use') {
          // 处理工具调用
          const toolUse = chunk.content_block;
          await this.handleToolCall({
            id: toolUse.id,
            name: toolUse.name,
            arguments: {},
          }, onChunk);
        }
      }
    } catch (error) {
      console.error('Anthropic stream error:', error);
      throw error;
    }
  }

  // 处理工具调用
  private async handleToolCall(toolCall: ToolCall, onChunk: (text: string) => void) {
    try {
      onChunk(`\n\n🔧 正在调用工具: ${toolCall.name}...\n\n`);

      const result = await toolRegistry.execute(toolCall);

      // 格式化工具返回结果
      if (result.summary) {
        onChunk(result.summary);
      } else if (result.message) {
        onChunk(result.message);
      } else {
        onChunk('✓ 工具调用完成');
      }
    } catch (error: any) {
      onChunk(`\n❌ 工具调用失败: ${error.message}\n`);
    }
  }

  // 转换工具定义为Anthropic格式
  private convertTools(tools: Tool[]): any[] {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }
}
