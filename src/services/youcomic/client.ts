import {extend} from "umi-request";
import {YouPhotoConfig} from "@/models/appsModel";
import {getYouComicConfig} from "@/utils/config";

export const youComicRequest = extend({
  timeout: 3000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youComicRequest.interceptors.request.use((url, options) => {
  const youComicConfig: YouPhotoConfig | null = getYouComicConfig()
  if (!youComicConfig) {
    throw new Error("YouPhotoConfig is null")
  }
  if (youComicConfig.token) {
    options.headers = {
      Authorization: `Bearer ${youComicConfig.token}`
    }
  }
  return {
    url: youComicConfig.baseUrl + url,
    options: options
  }
}, {global: false})
