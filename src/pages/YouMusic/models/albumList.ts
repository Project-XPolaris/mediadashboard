import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {fetchAlbumList} from "@/services/youmusic/album";

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
      const token = localStorage.getItem("token")
      const newList = response.data
      newList.forEach((album) => {
        const baseUrl = "/api/music" + album.cover
        album.cover = token ? `${baseUrl}?token=${token}` : baseUrl
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
