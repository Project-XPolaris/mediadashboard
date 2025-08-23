import {extend} from "umi-request";
import {YouMusicConfig} from "@/models/appsModel";

export const youMusicRequest = extend({
  timeout: 3000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youMusicRequest.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token')
  options.headers = {
    Authorization: `Bearer ${token}`
  }
  return {
    url: "/api/music" + url,
    options: options
  }
},{global:false})
