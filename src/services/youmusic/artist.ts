import {youMusicRequest} from "@/services/youmusic/client";
type ArtistQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
}
export const fetchArtistList = async (
  {
    page = 1,
    pageSize = 20,
    search,
  }: ArtistQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Artist>> => {
  return youMusicRequest('/artist', {
    method: "GET",
    params: {
      page, pageSize, search
    }
  })
}
