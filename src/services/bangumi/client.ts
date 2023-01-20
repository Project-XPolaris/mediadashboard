import {extend} from "umi-request";

export const bangumiClient = extend({
  timeout: 3000,
  baseURL: 'https://api.bgm.tv',
  headers: {
    'User-Agent': 'allentom/YouVideo (https://github.com/Project-XPolaris/YouVideo)',
  }
})

bangumiClient.interceptors.request.use((url, options) => {
  url  = "https://api.bgm.tv" + url
  return {
    url: url,
    options: options
  }
},{global:false})
