import {BaseResponse} from "@/services/youvideo/library";
import {youVideoRequest} from "@/services/youvideo/client";
import {Task} from "@/services/types";

export type YouVideoTask = {
  id: string;
  type: string;
  status: string;
  created: string;
  output: Output;
}

export type ScanLibraryTaskOutput = {
  id: number;
  path: string;
  total: number;
  current: number;
  currentPath: string;
  currentName: string;
}
export type GenerateVideoMetaTaskOutput = {
  id: number;
  path: string;
  total: number;
  current: number;
  currentPath: string;
  currentName: string;
}
export type CreateVideoOutput = {
  filename: string;
  path: string;
}
export type DeleteLibraryTaskOutput = {
  id: number;
  path:string;
}
export type Output = ScanLibraryTaskOutput | DeleteLibraryTaskOutput | GenerateVideoMetaTaskOutput

export const fetchTaskList = async (): Promise<BaseResponse<Task<Output>[]>> => {
  return youVideoRequest(`/task`, {
    method: 'GET',
  });
}
export const fetchTaskById = async (taskId: string): Promise<BaseResponse<Task<Output>>> => {
  return youVideoRequest(`/task/object`, {
    method: 'GET',
    params: {
      id: taskId
    }
  });
}
