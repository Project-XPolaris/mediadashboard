import {youMusicRequest} from "@/services/youmusic/client";

export type TagQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  withMusicCount?: boolean;
}
export const fetchTagList = async (params: TagQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Tag>> => {
  return youMusicRequest('/tag', {
    method: "GET",
    params: {
      ...params,
      withMusicCount: params.withMusicCount ? '1' : '0'
    }
  })
}

export const updateMusicTags = async (id: number, names: string[], replace: boolean): Promise<any> => {
  return youMusicRequest.post(`/music/${id}/tags`, {
    data: {names},
    params: {
      replace: replace ? "1" : "0"
    }
  })
}

export const createTag = async (name: string): Promise<YouMusicAPI.Tag> => {
  return youMusicRequest.post('/tag', {
    data: { name }
  })
}

export const updateTag = async (id: number, name: string): Promise<YouMusicAPI.Tag> => {
  return youMusicRequest.put(`/tag/${id}`, {
    data: { name }
  })
}

export const deleteTag = async (id: number): Promise<void> => {
  return youMusicRequest.delete(`/tag/${id}`)
}

export const deleteTags = async (ids: number[]): Promise<void> => {
  return youMusicRequest.delete('/tag/batch', {
    data: { ids }
  })
}

export const getTagDetail = async (id: number): Promise<YouMusicAPI.Tag & { musicCount: number }> => {
  return youMusicRequest.get(`/tag/${id}`)
}

export const mergeTag = async (sourceId: number, targetId: number): Promise<void> => {
  return youMusicRequest.post(`/tag/${sourceId}/merge`, {
    data: { targetId }
  })
}

export interface TagStatistics {
  totalTags: number;
  totalMusic: number;
  mostUsedTag?: {
    name: string;
    count: number;
  };
  recentlyCreated: number;
}

export const getTagStatistics = async (): Promise<TagStatistics> => {
  return youMusicRequest.get('/tag/statistics')
}
