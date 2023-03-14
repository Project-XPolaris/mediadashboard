import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse, ListContainer} from "@/services/youvideo/library";

export const fetchImageList = async (param: {
  page: number,
  pageSize: number
  order: string,
  colorRank1?: string
  colorRank2?: string
  colorRank3?: string
  maxDistance?: number
  nearAvgId?: number
  minAvgDistance?: number
  libraryId?: number
  searchLabel?: string
  maxProbability?:number
  minProbability?:number
} = {
  page: 1,
  pageSize: 20,
  order: "id",
}) => {
  return youPhotoRequest<ListContainer<YouPhotoAPI.Photo> & BaseResponse<undefined>>("/images", {
    method: "GET",
    params: param
  });
};


export const fetchNearImageList = async ({id, maxDistance}: {
  id: number,
  maxDistance: number,
}): Promise<BaseResponse<YouPhotoAPI.NearImage[]>> => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.NearImage[]>>(`/image/${id}/near`, {
    method: "GET",
    params: {
      maxDistance
    }
  });
}
