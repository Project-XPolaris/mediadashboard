
import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse} from "@/services/youvideo/library";


export const fetchServiceState = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.ServiceState>>(`/state`, {
    method: "GET",
  });
}
