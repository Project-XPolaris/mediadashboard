import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {fetchVideoList, updateVideo} from "@/services/youvideo/video";
import {YouVideoConfig} from "@/models/appsModel";
import {getYouVideoConfig} from "@/utils/config";
import {addVideoToEntity, newEntity} from "@/services/youvideo/entity";
import {fetchLibraryList, Library} from "@/services/youvideo/library";
import {message} from "antd";
import {getOrderQueryParam} from "@/utils/param";
import {useLocalStorageState} from "ahooks";

export type VideoItem = {
  regexResult?: Record<string, {
    value: string,
    apply: boolean
  }>,
  edit?: {
    name?: string,
    ep?: string,
    order?: number,
  }
} & YouVideoAPI.Video
export type VideoFilter = {
  name?: string,
  library?: number
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
  const [nameMatchRegex, setNameMatchRegex] = useLocalStorageState<string[]>("mediadashboard.youvideo.nameMatchRegex", {
    defaultValue: []
  })
  const [loading, setLoading] = useState<boolean>(false)

  const loadData = async (
    {
      page = pagination,
      paramFilter = filter,
      queryOrder = order
    }: {
      page?: DataPagination,
      paramFilter?: VideoFilter,
      queryOrder?: string
    }) => {
    console.log("loadData", getOrderQueryParam(queryOrder))
    const response = await fetchVideoList({
      page: page.page,
      pageSize: page.pageSize,
      ...paramFilter,
      search: paramFilter.name,
      order: getOrderQueryParam(queryOrder),
    })
    if (!response.success) {
      message.error(response.err)
      return
    }
    const listWrap = response.data
    if (!listWrap) {
      message.error("video list is null")
      return
    }
    if (listWrap.result) {
      const config: YouVideoConfig | null = getYouVideoConfig()
      if (config === null) {
        return
      }
      const newList = listWrap.result
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
        total: listWrap.count
      })
    }
  }
  const createNewEntity = async (name: string) => {
    if (!selectedVideo || selectedVideo.length === 0) {
      return
    }
    const libraryId = selectedVideo[0].library_id
    const entity = await newEntity({name, libraryId})
    await addVideoToEntity(entity.data!.id, {
      ids: selectedVideo.map((video) => video.id)
    })
  }
  const loadLibrary = async () => {
    const response = await fetchLibraryList()
    if (!response.success) {
      message.error(response.err)
      return
    }
    const listWrap = response.data
    if (!listWrap) {
      message.error("library list is null")
      return
    }
    setLibraryList(listWrap.result)
  }
  const updateFilter = async (newFilter: VideoFilter) => {
    setFilter(newFilter)
    await loadData({
      paramFilter: newFilter
    })
  }
  const uploadOrder = async (newOrder: string) => {
    setOrder(newOrder)
    await loadData({queryOrder: newOrder})
  }
  const addNameMatchRegex = (regex: string) => {
    const newRegex = [...nameMatchRegex, regex]
    setNameMatchRegex(newRegex)
  }
  const removeNameMatchRegex = (regex: string) => {
    const newRegex = nameMatchRegex.filter((r) => r !== regex)
    setNameMatchRegex(newRegex)
  }
  const applyNameRegexMatch = (regexString: string) => {
    setVideoList(videoList.map(video => {
      const regex = new RegExp(regexString)
      const match = regex.exec(video.name)
      if (match && match.groups) {
        const result = {}
        for (const key in match.groups) {
          if (Object.prototype.hasOwnProperty.call(match.groups, key)) {
            const element = match.groups[key];
            result[key] = {
              value: element,
              apply: false
            }
            if (key === "ep") {
              result["order"] = {
                value: element,
                apply: false
              }
            }
            if (
              key === "name" ||
              key === "ep"
            ) {
              result[key].apply = true
            }
          }
        }
        return {
          ...video,
          regexResult: result
        }
      }
      return video
    }))
  }
  const onSelectRegexResult = (id: number, key: string, checked: boolean) => {
    setVideoList(videoList.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          regexResult: {
            ...v.regexResult,
            [key]: {
              ...v.regexResult![key],
              apply: checked
            }
          }
        }
      }
      return v
    }))
  }
  const saveMatchResult = () => {
    setVideoList(videoList.map((v) => {
      if (!v.regexResult) {
        return v
      }
      Object.getOwnPropertyNames(v.regexResult).forEach((key) => {
        if (v.regexResult![key].apply) {
          if (key !== "order") {
            v.edit = {
              ...v.edit,
              [key]: v.regexResult![key].value
            }
            return
          }else{
            v.edit = {
              ...v.edit,
              [key]: parseInt(v.regexResult![key].value)
            }
            return
          }

        }
      })
      v.regexResult = undefined
      return v
    }))
  }
  const applyChange = async () => {
    const changeList = videoList.filter((v) => v.edit)
    if (changeList.length === 0) {
      return
    }
    setLoading(true)
    for (const video of changeList) {
      const response = await updateVideo(video.id, {
        episode: video.edit?.ep,
        name: video.edit?.name,
        order: video.edit?.order
      })
      if (!response.success) {
        message.error(response.err)
        setLoading(false)
        return
      }
    }
    message.success("apply change success")
    await loadData({})
    setLoading(false)
  }
  const videoHasEdited = videoList.some((v) => v.edit)
  const resetChange = () => {
    setVideoList(videoList.map((v) => {
      v.regexResult = undefined
      v.edit = undefined
      return v
    }))
  }
  const resetMatchResult = () => {
    setVideoList(videoList.map((v) => {
      v.regexResult = undefined
      return v
    }))
  }
  const resetEditItem = (id: number,fieldName:string) => {
    setVideoList(videoList.map((v) => {
      if (v.id === id) {
        v.edit = {
          ...v.edit,
          [fieldName]: undefined
        }
      }
      return v
    }))
  }
  const applyEditItem = (id: number,fieldName:string,value:any) => {
    setVideoList(videoList.map((v) => {
      if (v.id === id) {
        v.edit = {
          ...v.edit,
          [fieldName]: value
        }
      }
      return v
    }))
  }
  const inNameMatchMode = videoList.some((v) => v.regexResult)
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
    uploadOrder,
    nameMatchRegex,
    addNameMatchRegex,
    removeNameMatchRegex,
    applyNameRegexMatch,
    onSelectRegexResult,
    saveMatchResult,
    applyChange,
    videoHasEdited,
    loading,
    resetChange,
    resetMatchResult,
    resetEditItem,
    applyEditItem,
    inNameMatchMode
  }

}
export default videoListModel
