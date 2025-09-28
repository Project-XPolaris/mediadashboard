import { youComicRequest } from '@/services/youcomic/client';

// 模板类型定义
export interface Template {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  type: string;
  content: string;
  description?: string;
  is_default: boolean;
  version?: string;
  last_used_at?: string;
}

// 模板类型选项
export interface TemplateType {
  value: string;
  label: string;
  description: string;
}

// API响应类型
export interface TemplateListResponse {
  success: boolean;
  data: {
    templates: Template[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface TemplateDetailResponse {
  success: boolean;
  data: Template;
}

export interface TemplateTypesResponse {
  success: boolean;
  data: TemplateType[];
}

// 创建/更新模板的请求参数
export interface CreateTemplateRequest {
  name: string;
  type: string;
  content: string;
  description?: string;
  version?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  type?: string;
  content?: string;
  description?: string;
  version?: string;
}

// API函数
export async function getTemplateList(params?: {
  type?: string;
  page?: number;
  pageSize?: number;
}): Promise<TemplateListResponse> {
  return youComicRequest.get('/templates', { params });
}

export async function getTemplateDetail(id: number): Promise<TemplateDetailResponse> {
  return youComicRequest.get(`/template/${id}`);
}

export async function createTemplate(data: CreateTemplateRequest): Promise<TemplateDetailResponse> {
  return youComicRequest.post('/templates', { data });
}

export async function updateTemplate(id: number, data: UpdateTemplateRequest): Promise<TemplateDetailResponse> {
  return youComicRequest.put(`/template/${id}`, { data });
}

export async function deleteTemplate(id: number): Promise<{ success: boolean; message: string }> {
  return youComicRequest.delete(`/template/${id}`);
}

export async function getTemplateTypes(): Promise<TemplateTypesResponse> {
  return youComicRequest.get('/template/types');
}
