import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse} from "@/services/youvideo/library";

export const fetchModelList = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.SDWModel[]>>("/sdw/models", {
    method: "GET",
  })
}

export const fetchSDWOptions = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.SDWOption>>("/sdw/info", {
    method: "GET",
  })
}
export const changeSDWModel = async (param: { model: string }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/sdw/currentModel", {
    method: "POST",
    data: {
      name: param.model
    }
  })
}

export type Text2ImageOptions = {
  prompt: string
  negative_prompt: string
  width: number
  height: number
  steps: number
  sampler_name: string
  cfg_scale: number
  enable_hr: boolean
  hr_upscaler: string
  hr_scale: number
  hr_resize_x: number
  hr_resize_y: number
  hr_second_pass_steps: number
  denoising_strength: number
  batch_size: number
  n_iter: number
}

export const text2Image = async (param: Text2ImageOptions) => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.Text2ImageResponse>>("/sdw/text2image", {
    method: "POST",
    data: {
      ...param,
    }
  })
}

export const fetchSamplerList = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.Sampler[]>>("/sdw/samplers", {
    method: "GET",
  })
}

export const fetchUpscalerList = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.Upscaler[]>>("/sdw/upscalers", {
    method: "GET",
  })
}

export const fetchProgress = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.SDWProgress>>("/sdw/progress", {
    method: "GET",
  })
}
export type saveSDWConfigParam = {
  name: string
  config: string
}

export const saveSDWConfig = async (param: saveSDWConfigParam) => {
  return youPhotoRequest<BaseResponse<undefined>>("/sdw/config", {
    method: "POST",
    data: param
  })
}

export const fetchSDWConfigList = async () => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.SDWConfig[]>>("/sdw/config", {
    method: "GET",
  })
}

export const deleteSDWConfig = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/sdw/config", {
    method: "DELETE",
    params: param
  })
}

export const interruptSDW = async () => {
  return youPhotoRequest<BaseResponse<undefined>>("/sdw/interrupt", {
    method: "POST",
  })
}

export const skipSDW = async () => {
  return youPhotoRequest<BaseResponse<undefined>>("/sdw/skip", {
    method: "POST",
  })
}

