import { AIConfig, AIProvider, Message } from '@/types';
import { IAIService } from './base';
import { AnthropicService } from './providers/anthropic';
import { OpenAIService } from './providers/openai';
import { DoubaoService } from './providers/doubao';
import { OllamaService, OpenAICompatibleService } from './providers/others';
import { PROVIDER_CONFIG } from '@/constants/aiModels';

// AI服务工厂
class AIServiceFactory {
  private currentService: IAIService | null = null;
  private currentConfig: AIConfig | null = null;

  // 创建AI服务实例
  createService(config: AIConfig): IAIService {
    console.log('AI Service Factory - Creating service with config:', {
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey ? '已设置' : '未设置'
    });

    // 如果配置相同,复用现有实例
    if (
      this.currentService &&
      this.currentConfig &&
      this.currentConfig.provider === config.provider &&
      this.currentConfig.apiKey === config.apiKey &&
      this.currentConfig.baseURL === config.baseURL
    ) {
      console.log('AI Service Factory - Reusing existing service');
      return this.currentService;
    }

    // 根据provider创建对应的服务
    let service: IAIService;

    switch (config.provider) {
      case 'anthropic':
        service = new AnthropicService(config);
        break;

      case 'openai':
        service = new OpenAIService(config);
        break;

      case 'ollama':
        service = new OllamaService(config);
        break;

      case 'deepseek':
        service = new OpenAICompatibleService({
          ...config,
          baseURL: config.baseURL || PROVIDER_CONFIG.deepseek.baseURL,
        });
        break;

      case 'doubao':
        service = new DoubaoService(config);
        break;

      case 'zhipu':
        service = new OpenAICompatibleService({
          ...config,
          baseURL: config.baseURL || PROVIDER_CONFIG.zhipu.baseURL,
        });
        break;

      case 'google':
      case 'openrouter':
        service = new OpenAICompatibleService(config);
        break;

      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }

    this.currentService = service;
    this.currentConfig = config;

    console.log('AI Service Factory - Created service:', config.provider);
    return service;
  }

  // 获取当前服务
  getCurrentService(): IAIService | null {
    return this.currentService;
  }
}

// 导出单例
export const aiServiceFactory = new AIServiceFactory();

// 辅助函数:从环境变量或配置获取AIConfig
export const getAIConfigFromEnv = (
  provider: AIProvider = 'doubao',
  model?: string
): AIConfig | null => {
  const apiKeyMap: Record<AIProvider, string> = {
    anthropic: process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '',
    openai: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    google: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '',
    deepseek: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '',
    zhipu: process.env.EXPO_PUBLIC_ZHIPU_API_KEY || '',
    ollama: '', // Ollama不需要API Key
    doubao: process.env.EXPO_PUBLIC_DOUBAO_API_KEY || '',
    openrouter: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '',
  };

  const apiKey = apiKeyMap[provider];

  if (!apiKey && provider !== 'ollama') {
    return null;
  }

  return {
    provider,
    apiKey,
    model: model || getDefaultModel(provider),
    maxTokens: 4096,
    temperature: 0.7,
  };
};

// 获取默认模型
const getDefaultModel = (provider: AIProvider): string => {
  const defaultModels: Record<AIProvider, string> = {
    doubao: 'doubao-seed-1-6-251015',
    anthropic: 'claude-3-5-sonnet-20241022',
    openai: 'gpt-3.5-turbo',
    google: 'gemini-pro',
    deepseek: 'deepseek-chat',
    zhipu: 'glm-4',
    ollama: 'llama3',
    openrouter: 'openai/gpt-3.5-turbo',
  };

  return defaultModels[provider];
};
