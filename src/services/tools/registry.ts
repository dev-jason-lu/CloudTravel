import { Message } from '@/types';

// 工具定义
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

// 工具调用请求
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

// 工具调用结果
export interface ToolResult {
  toolCallId: string;
  result: any;
  error?: string;
}

// 工具执行函数类型
export type ToolFunction = (args: Record<string, any>) => Promise<any>;

// 工具注册表
export class ToolRegistry {
  private tools: Map<string, { definition: Tool; handler: ToolFunction }> = new Map();

  // 注册工具
  register(definition: Tool, handler: ToolFunction) {
    this.tools.set(definition.name, { definition, handler });
  }

  // 获取所有工具定义
  getToolDefinitions(): Tool[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  // 执行工具
  async execute(toolCall: ToolCall): Promise<any> {
    const tool = this.tools.get(toolCall.name);
    if (!tool) {
      throw new Error(`Tool ${toolCall.name} not found`);
    }

    try {
      return await tool.handler(toolCall.arguments);
    } catch (error: any) {
      throw new Error(`Tool execution failed: ${error.message}`);
    }
  }

  // 检查工具是否存在
  has(toolName: string): boolean {
    return this.tools.has(toolName);
  }
}

// 全局工具注册表
export const toolRegistry = new ToolRegistry();
