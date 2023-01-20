import {youMusicRequest} from "@/services/youmusic/client";
import {BaseResponse} from "@/services/youvideo/library";

export type MusicQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  albumSearch?: string;
  artistSearch?: string;
  withTag?:string
}
export const fetchMusicList = async (
  {
    page = 1,
    pageSize = 20,
    search,
    albumSearch,
    artistSearch,
    withTag
  }: MusicQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Music>> => {
  return youMusicRequest('/music', {
    method: "GET",
    params: {
      page, pageSize, search, albumSearch, artistSearch,withTag
    }
  })
}

export const updateMusic = async (id: number, updateData: YouMusicAPI.UpdateMusicData): Promise<BaseResponse<any>> => {
  return youMusicRequest.post(`/music/${id}/file`, {
    data: updateData
  })
}

export const uploadMusicCover = async (id: number, cover: File): Promise<BaseResponse<any>> => {
  const formData = new FormData()
  formData.append("file", cover)
  return youMusicRequest.post(`/music/${id}/cover`, {
    data: formData
  })
}
