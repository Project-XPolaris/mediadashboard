import {extend} from "umi-request";

export const youPhotoRequest = extend({
  timeout: 3000000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youPhotoRequest.interceptors.request.use((url, options) => {
  if (localStorage.getItem('token')) {
    options.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
  // 添加代理前缀
  return {
    url: '/api/photo' + url,
    options: options
  }
},{global:false})
