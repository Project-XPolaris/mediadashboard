import {BaseResponse} from "@/services/youvideo/library";
import {Task} from "@/services/types";
import {youComicRequest} from "@/services/youcomic/client";

export const fetchYouComicTaskList = async (): Promise<BaseResponse<Task<YouComicAPI.TaskOutput>[]>> => {
  return youComicRequest<BaseResponse<Task<any>[]>>("/task", {
    method: "GET"
  })
}
export const newMoveBookTask = async ({bookIds, to}: { bookIds: number[]; to: number; }):
  Promise<any> => {
  return youComicRequest<BaseResponse<Task<any>>>("/task/bookMove", {
    method: "POST",
    data: {
      bookIds,
      to
    },
  })
}

export const newWriteBookMetaTask = async ({libraryId}: { libraryId: number }):
  Promise<any> => {
  return youComicRequest<BaseResponse<Task<any>>>(`/library/${libraryId}/task/writemeta`, {
    method: "POST",
  })
}

