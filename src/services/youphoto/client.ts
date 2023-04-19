import {extend} from "umi-request";
import {YouPhotoConfig} from "@/models/appsModel";

export const youPhotoRequest = extend({
  timeout: 3000000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youPhotoRequest.interceptors.request.use((url, options) => {
  const youPhotoConfig: YouPhotoConfig = JSON.parse(localStorage.getItem('YouPhotoConfig') || '{}')
  if (!youPhotoConfig.baseUrl) {
    throw new Error("YouPhotoConfig is null")
  }
  if (youPhotoConfig.token) {
    options.headers = {
      Authorization: `Bearer ${youPhotoConfig.token}`
    }
  }
  return {
    url: youPhotoConfig.baseUrl + url,
    options: options
  }
},{global:false})
