import {BaseResponse} from "@/services/youvideo/library";
import {Task} from "@/services/types";
import {youPhotoRequest} from "@/services/youphoto/client";

export const fetchYouPhotoTaskList = async (): Promise<BaseResponse<Task<YouPhotoAPI.YouPhotoTaskOutput>[]>> => {
  return youPhotoRequest<BaseResponse<Task<YouPhotoAPI.YouPhotoTaskOutput>[]>>("/tasks", {
    method: "GET"
  });
};
