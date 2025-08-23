import {useState} from "react";
import {message} from "antd";
import {deepdanbooruAnalyze, fetchImageList, getImage, imageTagger} from "@/services/youphoto/image";
import {DataPagination} from "@/utils/page";
import {fetchLibraryList, Library} from "@/services/youphoto/library";
import {useLocalStorageState} from "ahooks";

export type PhotoItem = {
  thumbnailUrl: string
  rawUrl: string
  mostClassify: string[] | undefined
} & YouPhotoAPI.Photo

export type PhotoListFilter = {
  colorRank1?: string,
  colorRank2?: string,
  colorRank3?: string,
  maxDistance?: number
  nearImageId?: number
  libraryId?: number
  nearImageDistance?: number
  searchLabel?: string
  maxProbability?: number
  minProbability?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  dbTag?: string[]
  dbTagNot?: string[]
  tag?: string[]
  tagNot?: string[]
}
export type InfoMode = "none" | "simple" | "full"
const usePhotoListModel = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<DataPagination>({page: 1, pageSize: 24 * 3, total: 0});
  const [filter, setFilter] = useState<PhotoListFilter>({});
  const [imageFit, setImageFit] = useLocalStorageState<"contain" | "cover">("youphoto.image.fit",{
    defaultValue:"cover"
  })
  const [imageSpan, setImageSpan] = useLocalStorageState<number | undefined>("youphoto.image.span",{
    defaultValue: 6,
  })
  const [order, setOrder] = useState<string>("id desc")
  const [infoMode, setInfoMode] = useLocalStorageState<InfoMode>("youphoto.image.mode",{
    defaultValue: "none",
  })
  const [libraryList, setLibraryList] = useState<Library[]>([])
  const initModel = async () => {
    const libraryResponse = await fetchLibraryList()
    if (libraryResponse.success) {
      setLibraryList(libraryResponse.result)
    }
  }
  const refresh = async (
    {
      queryPage = pagination.page,
      queryPageSize = pagination.pageSize,
      queryOrder = order,
      colorRank1 = filter.colorRank1,
      colorRank2 = filter.colorRank2,
      colorRank3 = filter.colorRank3,
      maxDistance = filter.maxDistance,
      nearImageId = filter.nearImageId,
      nearImageDistance = filter.nearImageDistance,
      libraryId = filter.libraryId,
      searchLabel = filter.searchLabel,
      maxProbability = filter.maxProbability,
      minProbability = filter.minProbability,
      minWidth = filter.minWidth,
      minHeight = filter.minHeight,
      maxWidth = filter.maxWidth,
      maxHeight = filter.maxHeight,
      dbTag = filter.dbTag,
      dbTagNot = filter.dbTagNot,
      tag = filter.tag,
      tagNot = filter.tagNot,
    }:
      {
        queryPage?: number,
        queryPageSize?: number,
        queryOrder?: string
        colorRank1?: string,
        colorRank2?: string,
        colorRank3?: string,
        maxDistance?: number,
        nearImageId?: number
        nearImageDistance?: number
        libraryId?: number
        searchLabel?: string
        maxProbability?: number
        minProbability?: number
        minWidth?: number
        minHeight?: number
        maxWidth?: number
        maxHeight?: number,
        dbTag?: string[]
        dbTagNot?: string[]
        tag?: string[]
        tagNot?: string[]
      }) => {
    try {
      setPhotos([])
      setLoading(true);
      const response = await fetchImageList({
        page: queryPage,
        pageSize: queryPageSize,
        order: queryOrder,
        colorRank1,
        colorRank2,
        colorRank3,
        maxDistance,
        nearAvgId: nearImageId,
        minAvgDistance: nearImageDistance,
        libraryId,
        searchLabel,
        maxProbability,
        minProbability,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        dbTag,
        dbTagNot,
        tag,
        tagNot,
      });
      if (response.success) {
        const token = localStorage.getItem("token")
        if (!token) {
          return
        }
        const photosData: PhotoItem[] = response.result.map(photo => {
          const item: PhotoItem = {
            ...photo,
            thumbnailUrl:`/api/photo/image/${photo.id}/thumbnail?token=${token}`,
            rawUrl: `/api/photo/image/${photo.id}/raw?token=${token}`,
            mostClassify: undefined
          }
          if (photo.classify && photo.classify.length > 0) {
            const sortedProbe = photo.classify.sort((a, b) => b.prob - a.prob)
            if (sortedProbe[0].prob > 0.8) {
              item.mostClassify = sortedProbe[0].label.split(",")
            }
          }
          return item
        })
        setPhotos(photosData);
        setPagination({
          page: response.page, pageSize: response.pageSize, total: response.count
        })
      }
    } catch (e) {
      message.error("load photo list error");
    } finally {
      setLoading(false);
    }

  };
  const getCurrentNearImage = () => {
    if (filter.nearImageId) {
      return photos.find(photo => photo.id === filter.nearImageId)
    }
    return undefined
  }
  const updateFilter = async (newFilter: PhotoListFilter) => {
    setFilter({...filter, ...newFilter})
    await refresh({
      ...filter,
      ...newFilter
    })
  }
  const updateOrder = async (newOrder: string) => {
    setOrder(newOrder)
    await refresh({
      queryOrder: newOrder,
      queryPage: 1
    })
  }
  const RunDeepdanbooruAnalyze = async (id: number) => {
    const response = await deepdanbooruAnalyze({id: id})
    if (!response.success) {
      message.error(response.err)
      return
    }
    message.success("analyze success")
    setPhotos(photos.map(photo => {
      if (photo.id === id) {
        photo.deepdanbooruResult = response.data
      }
      return photo
    }))
  }
  const runImageTagger = async (id: number) => {
    const response = await imageTagger({id: id})
    if (!response.success) {
      message.error(response.err)
      return
    }
    const imageResponse = await getImage({id: id})
    if (!imageResponse.success) {
      message.error(imageResponse.err)
      return
    }

    message.success("tag success")
    setPhotos(photos.map(photo => {
      if (photo.id === id) {
        photo.tag = imageResponse.data!.tag
      }
      return photo
    }))
  }
  return {
    photos,
    loading,
    refresh,
    pagination,
    filter,
    updateFilter,
    setFilter,
    getCurrentNearImage,
    imageFit,
    setImageFit,
    imageSpan,
    setImageSpan,
    updateOrder,
    order,
    setInfoMode,
    infoMode,
    initModel,
    libraryList,
    RunDeepdanbooruAnalyze,
    runImageTagger
  };
};
export default usePhotoListModel;
