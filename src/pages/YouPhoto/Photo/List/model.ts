import {useState} from "react";
import {message} from "antd";
import {fetchImageList} from "@/services/youphoto/image";
import {DataPagination} from "@/utils/page";
import {getYouPhotoConfig} from "@/utils/config";
import {fetchLibraryList, Library} from "@/services/youphoto/library";

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

}
export type InfoMode = "none" | "simple" | "full"
const usePhotoListModel = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<DataPagination>({page: 1, pageSize: 24 * 3, total: 0});
  const [filter, setFilter] = useState<PhotoListFilter>({});
  const [imageFit, setImageFit] = useState<"contain" | "cover">("cover")
  const [imageSpan, setImageSpan] = useState<number | undefined>(6)
  const [order, setOrder] = useState<string>("id desc")
  const [infoMode, setInfoMode] = useState<InfoMode>("none")
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
      minProbability = filter.minProbability
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
        minProbability
      });
      if (response.success) {
        const youPhotoConfig = await getYouPhotoConfig()
        if (!youPhotoConfig) {
          throw new Error("youPhotoConfig is null")
        }
        const photosData: PhotoItem[] = response.result.map(photo => {
          const item: PhotoItem = {
            ...photo,
            thumbnailUrl: youPhotoConfig.baseUrl + `/image/${photo.id}/thumbnail?token=${youPhotoConfig.token}`,
            rawUrl: youPhotoConfig.baseUrl + `/image/${photo.id}/raw?token=${youPhotoConfig.token}`,
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
  };
};
export default usePhotoListModel;
