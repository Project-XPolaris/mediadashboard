import {youComicRequest} from "@/services/youcomic/client";
import {ListContainer} from "@/services/youvideo/library";

export type QueryTagListParams = {
  page?: number;
  page_size?: number
  nameSearch?: string
  type?: string[] | string
  order?: string | string[]
}
export const fetchTagList = async (params: QueryTagListParams): Promise<ListContainer<YouComicAPI.Tag>> => {
  return youComicRequest.get('/tags', {params})
}

export const matchTagWithName = async (
  name: string, 
  useLLM: boolean = true, 
  customPrompt?: string,
  abortSignal?: AbortSignal,
  forceReprocess?: boolean
): Promise<YouComicAPI.MatchTag[]> => {
  return youComicRequest.post(`/tags/match`, {
    data: {
      text: name,
      useLLM: useLLM,
      customPrompt: customPrompt,
      forceReprocess: forceReprocess
    },
    signal: abortSignal
  })
}

export const batchMatchTagWithName = async (
  texts: string[], 
  useLLM: boolean = true, 
  customPrompt?: string,
  abortSignal?: AbortSignal,
  forceReprocess?: boolean
): Promise<YouComicAPI.BatchMatchTag[]> => {
  return youComicRequest.post(`/tags/batch-match`, {
    data: {
      texts: texts,
      useLLM: useLLM,
      customPrompt: customPrompt,
      forceReprocess: forceReprocess
    },
    signal: abortSignal
  })
}

export const newCleanEmptyTagTask = () => {
  return youComicRequest.post(`/tags/clean`)
}

export const batchTag = (
  {
    deleteIds
  }:{
    deleteIds?: number[]
  }
) => {
  return youComicRequest.post(`/tags/batch`, {
    data: {
      'delete':deleteIds
    }
  })
}

export const mergeTags = ({from,to}:{from:number,to:number}) => {
  return youComicRequest.post(`/tags/addTag`, {
    data: {
      from,to
    }
  })
}

export interface LLMTagHistoryItem {
  id: number;
  originalText: string;
  modelName: string;
  modelVersion: string;
  customPrompt: string;
  results: Array<{
    name: string;
    type: string;
  }>;
  processingTimeMs: number;
  success: boolean;
  usageCount: number;
  createdAt: string;
  lastUsedAt?: string;
}

export interface LLMTagHistoryResponse {
  count: number;
  data: LLMTagHistoryItem[];
}

export const getLLMTagHistory = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<LLMTagHistoryResponse> => {
  return youComicRequest.post('/tags/llm-history', {
    data: {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      search: params.search
    }
  })
}
