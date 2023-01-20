import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {fetchVideoList} from "@/services/youvideo/video";
import {YouVideoConfig} from "@/models/appsModel";
import {getYouVideoConfig} from "@/utils/config";
import {addVideoToEntity, newEntity} from "@/services/youvideo/entity";
import {fetchLibraryList, Library} from "@/services/youvideo/library";

export type VideoItem = {} & YouVideoAPI.Video
export type VideoFilter = {
  name?:string,
  library?:number
}
const videoListModel = () => {
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0
  })
  const [selectedVideo, setSelectedVideo] = useState<VideoItem[]>([])
  const [libraryList, setLibraryList] = useState<Library[]>([])
  const [filter, setFilter] = useState<VideoFilter>({})
  const [order, setOrder] = useState<string>("iddesc")

  const loadData = async (
    {
      page = pagination,
      paramFilter = filter,
      queryOrder = order
    }: {
      page?: DataPagination,
      paramFilter?: VideoFilter,
      queryOrder?:string
    }) => {
    const response = await fetchVideoList({
      page: page.page,
      pageSize: page.pageSize,
      ...paramFilter
    })
    if (response?.result) {
      const config: YouVideoConfig | null = getYouVideoConfig()
      if (config === null) {
        return
      }
      const newList = response.result
      newList.forEach((video) => {
        if (video.files) {
          video.files.forEach((file) => {
            file.cover = config.baseUrl + file.cover
          })
        }
      })
      setVideoList(newList)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: response.count
      })
    }
  }
  const createNewEntity = async (name: string) => {
    if (!selectedVideo || selectedVideo.length === 0) {
      return
    }
    const libraryId = selectedVideo[0].library_id
    const entity = await newEntity({name, libraryId})
    await addVideoToEntity(entity.id, {
      ids: selectedVideo.map((video) => video.id)
    })
  }
  const loadLibrary = async () => {
    const response = await fetchLibraryList()
    if (response?.result) {
      setLibraryList(response.result)
    }
  }
  const updateFilter = async (newFilter: VideoFilter) => {
    setFilter(newFilter)
    await loadData({
      paramFilter:newFilter
    })
  }
  const uploadOrder = async (newOrder: string) => {
    setOrder(newOrder)
    await loadData({queryOrder: newOrder})
  }
  return {
    videoList,
    loadData,
    pagination,
    selectedVideo,
    setSelectedVideo,
    createNewEntity,
    libraryList,
    loadLibrary,
    updateFilter,
    order,
    uploadOrder
  }

}
export default videoListModel
