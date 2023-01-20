import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {fetchAlbumList} from "@/services/youmusic/album";
import {getYouMusicConfig} from "@/utils/config";

const albumListModel = () => {
  const [albumList, setAlbumList] = useState<YouMusicAPI.Album[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0
  })
  const loadData = async ({page = pagination}: { page?: DataPagination }) => {
    const response = await fetchAlbumList({page: page.page, pageSize: page.pageSize})

    if (response?.data) {
      const config = getYouMusicConfig()
      if (!config) {
        return
      }
      const newList = response.data
      newList.forEach((album) => {
        album.cover = config.baseUrl + album.cover
      })
      setAlbumList(newList)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: response.count
      })
    }
  }

  return {
    loadData, albumList
  }
}
export default albumListModel
