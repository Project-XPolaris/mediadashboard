import {BaseResponse} from "@/services/youvideo/library";
import {youMusicRequest} from "@/services/youmusic/client";

export const searchAlbumMeta = async (key: string):Promise<BaseResponse<YouMusicAPI.SearchAlbumMeta[]>> => {
  return youMusicRequest.get('/meta/search/album', {
    params: {
      key
    }
  })
}
export const fetchAlbumMeta = async (params:{mbId?: string, nemId?: string}):Promise<BaseResponse<YouMusicAPI.AlbumMeta>> => {
  return youMusicRequest.get('/meta/album', {
    params
  })
}
