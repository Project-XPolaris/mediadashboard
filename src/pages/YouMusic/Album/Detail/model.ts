import {useState} from "react";
import {fetchAlbumById} from "@/services/youmusic/album";
import {getYouMusicConfig} from "@/utils/config";

const useAlbumDetailModel = () => {
  const [album, setAlbum] = useState<YouMusicAPI.Album | undefined>();
  const loadData = async (id: number) => {
    const response = await fetchAlbumById(id)
    setAlbum(response)
  }
  const getAlbumCover = (): string | undefined => {
    if (!album) {
      return
    }
    const config = getYouMusicConfig()
    if (!config) {
      return
    }
    return config.baseUrl + album.cover
  }
  return {
    loadData, album, getAlbumCover
  }
}
export default useAlbumDetailModel
