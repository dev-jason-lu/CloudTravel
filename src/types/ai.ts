// AI模型提供商类型
export type AIProvider =
  | 'anthropic'      // Claude
  | 'openai'         // OpenAI GPT
  | 'google'         // Google Gemini
  | 'deepseek'       // DeepSeek
  | 'zhipu'          // 智谱AI
  | 'ollama'         // Ollama本地模型
  | 'doubao'        // 豆包模型
  | 'openrouter';    // OpenRouter(支持多种开源模型)

// AI模型配置
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  maxTokens: number;
  supportStream: boolean;
  isLocal?: boolean;  // 是否本地模型
  pricing?: {
    input: number;    // 每百万token价格
    output: number;
  };
}

// AI配置
export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;        // 自定义API地址(用于Ollama或自建服务)
  model: string;
  maxTokens?: number;
  temperature?: number;
}

// AI响应
export interface AIResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost?: number;
  };
}
