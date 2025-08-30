import { youComicRequest } from './client';

// LLM配置类型定义
export interface OpenAIConfig {
  enable: boolean;
  model: string;
  base_url?: string;
  has_key?: boolean;
}

export interface OllamaConfig {
  enable: boolean;
  base_url: string;
  model: string;
}

export interface GeminiConfig {
  enable: boolean;
  model: string;
  location?: string;
  project?: string;
  has_key?: boolean;
}

export interface LLMConfig {
  enable: boolean;
  default: string;
  openai?: OpenAIConfig;
  ollama?: OllamaConfig;
  gemini?: GeminiConfig;
  template_config?: TemplateConfig;
}

export interface TemplateConfig {
  default_scenario: string;
  business_scenarios: Record<string, BusinessScenarioConfig>;
}

export interface BusinessScenarioConfig {
  name: string;
  description: string;
  default_template: string;
  custom_templates: Record<string, string>;
  active_template: string;
  variables: string[];
}

export interface LLMStatus {
  available: boolean;
  providers: string[];
  default: string;
}

export interface UpdateLLMConfigRequest {
  enable: boolean;
  default: string;
  openai?: {
    enable: boolean;
    api_key?: string;
    base_url?: string;
    model: string;
  };
  ollama?: {
    enable: boolean;
    base_url: string;
    model: string;
  };
  gemini?: {
    enable: boolean;
    api_key?: string;
    model: string;
    location?: string;
    project?: string;
  };
  template_config?: {
    default_scenario?: string;
    business_scenarios?: Record<string, {
      // 注意：name、description、variables字段被移除，因为这些是预定义的
      default_template?: string;
      custom_templates?: Record<string, string>;
      active_template?: string;
    }>;
  };
  persist?: boolean; // 是否持久化到配置文件
}

export interface TestLLMConnectionRequest {
  provider?: string;
  prompt?: string;
}

export interface TestLLMConnectionResponse {
  success: boolean;
  prompt: string;
  response?: string;
  response_length?: number;
  error?: string;
}

// 模板渲染相关接口
export interface RenderTemplateRequest {
  scenario: string; // 业务场景名称
  variables: Record<string, string>; // 模板变量
}

export interface RenderTemplateResponse {
  rendered_text: string; // 渲染后的文本
  scenario: string; // 业务场景名称
}

export interface ScenarioInfo {
  name: string;
  description: string;
  variables: string[];
}

export interface GetScenariosResponse {
  scenarios: string[];
  details: Record<string, ScenarioInfo>;
}

// API 方法

/**
 * 获取LLM配置
 */
export const getLLMConfig = async () => {
  return youComicRequest<LLMConfig>('/llm/config', {
    method: 'GET',
  });
};

/**
 * 更新LLM配置
 */
export const updateLLMConfig = async (config: UpdateLLMConfigRequest) => {
  return youComicRequest<LLMConfig>('/llm/config', {
    method: 'PUT',
    data: config,
  });
};

/**
 * 从配置文件重新加载LLM配置
 */
export const reloadLLMConfig = async () => {
  return youComicRequest<LLMConfig>('/llm/config/reload', {
    method: 'POST',
  });
};

/**
 * 保存当前配置到配置文件
 */
export const saveLLMConfig = async () => {
  return youComicRequest<{ success: boolean; message: string }>('/llm/config/save', {
    method: 'POST',
  });
};

/**
 * 获取LLM状态
 */
export const getLLMStatus = async () => {
  return youComicRequest<LLMStatus>('/llm/status', {
    method: 'GET',
  });
};

/**
 * 测试LLM连接
 */
export const testLLMConnection = async (params?: TestLLMConnectionRequest) => {
  return youComicRequest<TestLLMConnectionResponse>('/llm/test', {
    method: 'POST',
    data: params || {},
  });
};

/**
 * 渲染模板
 */
export const renderTemplate = async (request: RenderTemplateRequest) => {
  return youComicRequest<RenderTemplateResponse>('/llm/render', {
    method: 'POST',
    data: request,
  });
};

/**
 * 获取所有可用的业务场景
 */
export const getScenarios = async () => {
  return youComicRequest<GetScenariosResponse>('/llm/scenarios', {
    method: 'GET',
  });
};
