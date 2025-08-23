import {extend} from "umi-request";


export const youVideoRequest = extend({
  timeout: 3000,
  // errorHandler: (error) => {
  //   throw error
  // }
})
youVideoRequest.interceptors.request.use((url, options) => {
  if (localStorage.getItem('token')) {
    options.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
  // 添加代理前缀
  return {
    url: '/api/video' + url,
    options: options
  }
},{global:false})
