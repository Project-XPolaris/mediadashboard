import { fetchArtistList, updateArtist, updateArtistAvatar, updateArtistAvatarFromUrl } from "@/services/youmusic/artist";

export type ArtistItem = YouMusicAPI.Artist & {
  avatar?: string;
};

export type ArtistFilter = {
  search?: string;
  order?: string;
  random?: boolean;
  follow?: boolean;
}

// ProTable请求数据的工具函数
export const requestArtistData = async (params: any) => {
  try {
    const response = await fetchArtistList({
      page: params.current || 1,
      pageSize: params.pageSize || 20,
      search: params.name || '',
      order: params.sorter ? `${params.sorter.field}_${params.sorter.order}` : undefined,
    });
    
    if (response?.data) {
      const token = localStorage.getItem("token");
      
      // 处理头像URL
      const processedData = response.data.map(artist => ({
        ...artist,
        avatar: artist.avatar ? 
          (token ? `/api/music/cover/${artist.avatar}?token=${token}` : `/api/music/cover/${artist.avatar}`) 
          : undefined,
      }));
      
      return {
        data: processedData,
        success: true,
        total: response.count,
      };
    }
    return {
      data: [],
      success: false,
      total: 0,
    };
  } catch (error) {
    console.error('Failed to load artist list:', error);
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

// 艺术家管理操作函数
export const artistOperations = {
  updateArtist: async (id: number, data: { name?: string }) => {
    try {
      await updateArtist(id, data);
      return { success: true };
    } catch (error) {
      console.error('Failed to update artist:', error);
      throw error;
    }
  },

  uploadAvatar: async (id: number, file: File) => {
    try {
      await updateArtistAvatar(id, file);
      return { success: true };
    } catch (error) {
      console.error('Failed to upload artist avatar:', error);
      throw error;
    }
  },

  setAvatarFromUrl: async (id: number, url: string) => {
    try {
      await updateArtistAvatarFromUrl(id, url);
      return { success: true };
    } catch (error) {
      console.error('Failed to set artist avatar from URL:', error);
      throw error;
    }
  },
};
