import {extend} from "umi-request";
import {YouComicConfig} from "@/models/appsModel";
import {getYouComicConfig} from "@/utils/config";

export const youComicRequest = extend({
  timeout: 3000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youComicRequest.interceptors.request.use((url, options) => {
  const youComicConfig: YouComicConfig | null = getYouComicConfig()
  if (!youComicConfig) {
    throw new Error("YouComicConfig is null")
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
