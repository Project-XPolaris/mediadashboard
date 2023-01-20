import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse, ListContainer} from "@/services/youvideo/library";

export const fetchImageList = async (param: { page: number, pageSize: number } = { page: 1, pageSize: 20 }) => {
  return youPhotoRequest<ListContainer<YouPhotoAPI.Photo> & BaseResponse<undefined>>("/images", {
    method: "GET",
    params: param
  });
};
