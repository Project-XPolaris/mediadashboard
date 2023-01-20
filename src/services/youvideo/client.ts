import {extend} from "umi-request";
import {YouVideoConfig} from "@/models/appsModel";


export const youVideoRequest = extend({
  timeout: 3000,
  // errorHandler: (error) => {
  //   throw error
  // }
})
youVideoRequest.interceptors.request.use((url, options) => {
  const youvideoConfig: YouVideoConfig = JSON.parse(localStorage.getItem('YouVideoConfig') || '{}')
  if (!youvideoConfig.baseUrl) {
    throw new Error("YouVideoConfig is null")
  }
  if (youvideoConfig.token) {
    options.headers = {
      Authorization: `Bearer ${youvideoConfig.token}`
    }
  }
  return {
    url: youvideoConfig.baseUrl + url,
    options: options
  }
},{global:false})
