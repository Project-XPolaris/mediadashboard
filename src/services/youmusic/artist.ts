import {youMusicRequest} from "@/services/youmusic/client";

type ArtistQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  order?: string;
  random?: boolean;
  follow?: boolean;
  id?: number;
}

type UpdateArtistData = {
  name?: string;
}

export const fetchArtistList = async (
  {
    page = 1,
    pageSize = 20,
    search,
    order,
    random,
    follow,
    id,
  }: ArtistQueryParams): Promise<YouMusicAPI.ListContainer<YouMusicAPI.Artist>> => {
  return youMusicRequest('/artist', {
    method: "GET",
    params: {
      page, 
      pageSize, 
      search,
      order,
      random: random ? '1' : '0',
      follow: follow ? '1' : '0',
      id,
    }
  })
}

export const fetchArtistDetail = async (id: number): Promise<YouMusicAPI.Artist> => {
  return youMusicRequest(`/artist/${id}`, {
    method: "GET",
  })
}

export const fetchArtistDetailWithStats = async (id: number): Promise<YouMusicAPI.Artist & { musicCount: number; albumCount: number }> => {
  return youMusicRequest(`/artist/${id}/stats`, {
    method: "GET",
  })
}

export const updateArtist = async (id: number, data: UpdateArtistData): Promise<YouMusicAPI.Artist> => {
  return youMusicRequest(`/artist/${id}`, {
    method: "PATCH",
    data,
  })
}

export const updateArtistAvatar = async (id: number, file: File): Promise<{ success: boolean; data: YouMusicAPI.Artist }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return youMusicRequest(`/artist/${id}/avatar`, {
    method: "POST",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateArtistAvatarFromUrl = async (id: number, url: string): Promise<{ success: boolean; data: YouMusicAPI.Artist }> => {
  return youMusicRequest(`/artist/${id}/avatar/url`, {
    method: "POST",
    data: { url },
  })
}
