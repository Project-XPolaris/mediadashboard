import { extend } from "umi-request";

export const youComicRequest = extend({
  timeout: 10000,
  errorHandler: (error) => {
    console.log(error)
  }
})
youComicRequest.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token')
  options.headers = {
    Authorization: `Bearer ${token}`
  }
  return {
    url: "/api/comic" + url,
    options: options
  }
}, {global: false})
