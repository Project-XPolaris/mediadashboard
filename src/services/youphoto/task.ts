import {BaseResponse} from "@/services/youvideo/library";
import {Task} from "@/services/types";
import {youPhotoRequest} from "@/services/youphoto/client";
import {Output} from "@/services/youvideo/task";
export type CreateImageOutput = {
  filename: string;
  filePath: string;
}
export const fetchYouPhotoTaskList = async (): Promise<BaseResponse<Task<YouPhotoAPI.YouPhotoTaskOutput>[]>> => {
  return youPhotoRequest<BaseResponse<Task<YouPhotoAPI.YouPhotoTaskOutput>[]>>("/tasks", {
    method: "GET"
  });
};

export const fetchTaskById = async (taskId: string): Promise<BaseResponse<Task<Output>>> => {
  return youPhotoRequest(`/task/object`, {
    method: 'GET',
    params: {
      id: taskId
    }
  });
}


