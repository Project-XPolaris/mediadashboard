import {BaseResponse, ListContainer} from "@/services/youvideo/library";
import {youVideoRequest} from "@/services/youvideo/client";

export type fetchVideoListParams = {
  page?: number;
  pageSize?: number;
  library?:number
  search?:string
  order?:string
}
export const fetchVideoList = async (params: fetchVideoListParams): Promise<BaseResponse<ListContainer<YouVideoAPI.Video>>> => {
  return youVideoRequest(`/videos`, {
    method: "GET",
    params
  })
}
