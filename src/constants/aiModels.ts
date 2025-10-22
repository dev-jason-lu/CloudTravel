import { AIModel, AIProvider } from '@/types';

// 预定义的AI模型列表
export const AI_MODELS: AIModel[] = [
  // Anthropic Claude
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: '最强推理能力,适合复杂任务',
    maxTokens: 8192,
    supportStream: true,
    pricing: { input: 3, output: 15 },
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: '最高智能水平',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 15, output: 75 },
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: '快速响应,经济实惠',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 0.25, output: 1.25 },
  },

  // OpenAI GPT
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'OpenAI最强模型',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 10, output: 30 },
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: '经典GPT-4',
    maxTokens: 8192,
    supportStream: true,
    pricing: { input: 30, output: 60 },
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: '快速且经济',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 0.5, output: 1.5 },
  },

  // Google Gemini
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google最新AI模型',
    maxTokens: 32768,
    supportStream: true,
    pricing: { input: 0.5, output: 1.5 },
  },

  // DeepSeek
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    description: '国产优质模型,性价比高',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 1, output: 2 },
  },

  // 智谱AI
  {
    id: 'glm-4',
    name: 'GLM-4',
    provider: 'zhipu',
    description: '智谱第四代模型',
    maxTokens: 8192,
    supportStream: true,
    pricing: { input: 10, output: 10 },
  },
  {
    id: 'glm-3-turbo',
    name: 'GLM-3 Turbo',
    provider: 'zhipu',
    description: '快速响应版本',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 0.5, output: 0.5 },
  },

  // 豆包
  {
    id: 'doubao-seed-1-6-251015',
    name: '豆包 Seed 1.6',
    provider: 'doubao',
    description: '字节跳动豆包模型',
    maxTokens: 4096,
    supportStream: true,
    pricing: { input: 1, output: 2 },
  },

  // Ollama本地模型
  {
    id: 'llama3',
    name: 'Llama 3 8B',
    provider: 'ollama',
    description: 'Meta开源模型,本地运行',
    maxTokens: 4096,
    supportStream: true,
    isLocal: true,
  },
  {
    id: 'qwen2',
    name: 'Qwen 2 7B',
    provider: 'ollama',
    description: '阿里通义千问开源版',
    maxTokens: 4096,
    supportStream: true,
    isLocal: true,
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    provider: 'ollama',
    description: '高性能开源模型',
    maxTokens: 4096,
    supportStream: true,
    isLocal: true,
  },
];

// 获取提供商的所有模型
export const getModelsByProvider = (provider: AIProvider): AIModel[] => {
  return AI_MODELS.filter((model) => model.provider === provider);
};

// 根据ID获取模型
export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};

// 提供商配置
export const PROVIDER_CONFIG = {
  anthropic: {
    name: 'Anthropic Claude',
    apiKeyLabel: 'Claude API Key',
    baseURL: 'https://api.anthropic.com',
    docURL: 'https://console.anthropic.com/',
  },
  doubao: {
    name: '豆包',
    apiKeyLabel: '豆包 API Key',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    docURL: 'https://ark.cn-beijing.volces.com/',
  },
  openai: {
    name: 'OpenAI',
    apiKeyLabel: 'OpenAI API Key',
    baseURL: 'https://api.openai.com/v1',
    docURL: 'https://platform.openai.com/',
  },
  google: {
    name: 'Google Gemini',
    apiKeyLabel: 'Google API Key',
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    docURL: 'https://ai.google.dev/',
  },
  deepseek: {
    name: 'DeepSeek',
    apiKeyLabel: 'DeepSeek API Key',
    baseURL: 'https://api.deepseek.com/v1',
    docURL: 'https://platform.deepseek.com/',
  },
  zhipu: {
    name: '智谱AI',
    apiKeyLabel: '智谱 API Key',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    docURL: 'https://open.bigmodel.cn/',
  },
  ollama: {
    name: 'Ollama (本地)',
    apiKeyLabel: '无需API Key',
    baseURL: 'http://localhost:11434',
    docURL: 'https://ollama.ai/',
  },
  openrouter: {
    name: 'OpenRouter',
    apiKeyLabel: 'OpenRouter API Key',
    baseURL: 'https://openrouter.ai/api/v1',
    docURL: 'https://openrouter.ai/',
  },
};
