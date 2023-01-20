import {extend} from "umi-request";
import {YouMusicConfig} from "@/models/appsModel";

export const youMusicRequest = extend({
  timeout: 3000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youMusicRequest.interceptors.request.use((url, options) => {
  const youMusicConfig: YouMusicConfig = JSON.parse(localStorage.getItem('YouMusicConfig') || '{}')
  if (!youMusicConfig.baseUrl) {
    throw new Error("YouMusicConfig is null")
  }
  if (youMusicConfig.token) {
    options.headers = {
      Authorization: `Bearer ${youMusicConfig.token}`
    }
  }
  return {
    url: youMusicConfig.baseUrl + url,
    options: options
  }
},{global:false})
