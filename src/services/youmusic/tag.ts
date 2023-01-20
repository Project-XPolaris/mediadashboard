import {youMusicRequest} from "@/services/youmusic/client";

export type TagQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
}
export const fetchTagList = async (params: TagQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Tag>> => {
  return youMusicRequest('/tag', {
    method: "GET",
    params
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
