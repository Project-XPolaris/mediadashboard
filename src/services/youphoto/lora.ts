import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse} from "@/services/youvideo/library";

export type saveLoraConfigParam = {
  name: string
  config: string
}
export const saveLoraConfig = async (param: saveLoraConfigParam) => {
  return youPhotoRequest<BaseResponse<undefined>>("/lora/config", {
    method: "POST",
    data: param
  })
}

export const fetchLoraConfigList = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.LoraConfig[]>>("/lora/config", {
    method: "GET",
  })
}

export const deleteLoraConfig = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/lora/config", {
    method: "DELETE",
    params: param
  })
}

export const interruptLoraTrain = async (param: { id: string }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/lora/task/interrupt", {
    method: "GET",
    params: param
  })
}
