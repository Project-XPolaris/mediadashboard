import {youMusicRequest} from "@/services/youmusic/client";

type AlbumQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  order?: string;
}

export const fetchAlbumList = async ({
  page = 1,
  pageSize = 20,
  search,
  order
}: AlbumQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Album>> => {
  return youMusicRequest('/album', {
    method: "GET",
    params: {
      page,
      pageSize,
      search,
      order
    }
  })
}

export const fetchAlbumById = async (albumId:number) :Promise<YouMusicAPI.Album> => {
  return youMusicRequest(`/album/${albumId}`,{
    method:"GET"
  })
}
