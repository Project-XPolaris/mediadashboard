import { extend } from "umi-request";

export const youComicRequest = extend({
  timeout: 600000, // 10分钟超时，适应LLM识别的长时间处理
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
