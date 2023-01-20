import {youMusicRequest} from "@/services/youmusic/client";

export const fetchAlbumList = async ({page = 1,pageSize = 20}:{page:number,pageSize:number}):Promise<YouMusicAPI.ListContainer < YouMusicAPI.Album >> => {
  return youMusicRequest('/album', {
    method: "GET",
    params:{
      page,pageSize
    }
  })
}

export const fetchAlbumById = async (albumId:number) :Promise<YouMusicAPI.Album> => {
  return youMusicRequest(`/album/${albumId}`,{
    method:"GET"
  })
}
