import {useState} from "react";
import {message} from "antd";
import {fetchImageList} from "@/services/youphoto/image";
import {DataPagination} from "@/utils/page";
import {getYouPhotoConfig} from "@/utils/config";

export type PhotoItem  = {
  thumbnailUrl:string
  rawUrl:string
} &YouPhotoAPI.Photo
const usePhotoListModel = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<DataPagination>({page: 1, pageSize: 20, total: 0});
  const refresh = async ({queryPage, queryPageSize}: { queryPage: number, queryPageSize: number } = {
    queryPage: pagination.page,
    queryPageSize: pagination.pageSize
  }) => {
    try {
      setLoading(true);
      const response = await fetchImageList({page: queryPage, pageSize: queryPageSize});
      if (response.success) {
        const youPhotoConfig = await getYouPhotoConfig()
        if (!youPhotoConfig) {
          throw new Error("youPhotoConfig is null")
        }

        const photosData:PhotoItem[]= response.result.map(photo => {
          return {
            ...photo,
            thumbnailUrl: youPhotoConfig.baseUrl + `/image/${photo.id}/thumbnail?token=${youPhotoConfig.token}`,
            rawUrl: youPhotoConfig.baseUrl +`/image/${photo.id}/raw?token=${youPhotoConfig.token}`
          }
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
  return {
    photos,
    loading,
    refresh,
    pagination,
  };
};
export default usePhotoListModel;
