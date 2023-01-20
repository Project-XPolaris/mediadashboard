import {youMusicRequest} from "@/services/youmusic/client";
import {BaseResponse} from "@/services/youvideo/library";
import {Directory} from "@/hooks/explore";


export const fetchLibraryList = (): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Library>> => {
  return youMusicRequest(`/library`, {
    method: 'GET',
  });
}
export const deleteLibrary = (libraryId: number): Promise<BaseResponse<undefined>> => {
  return youMusicRequest.delete(`/library/${libraryId}`, {})
}
export const readDir = (path: string): Promise<Directory> => {
  return youMusicRequest(`/explore/read`, {
    params: {
      path
    }
  })
}

export const createLibrary = (libraryPath: string): Promise<BaseResponse<undefined>> => {
  return youMusicRequest("/library", {
    method: 'POST',
    data: {
      libraryPath
    }
  })
}
export const scanLibrary = (libraryId:number) => {
  return youMusicRequest(`/library/${libraryId}/scan`, {
    method: 'POST',
  })
}
