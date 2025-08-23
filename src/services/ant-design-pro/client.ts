import { extend } from "umi-request";
import { history } from '@umijs/max';

export const mediaDashboardRequest = extend({
  timeout: 10000,
  errorHandler: (error) => {
    // 统一处理未授权
    // @ts-ignore
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      const { pathname, search } = window.location;
      if (!pathname.includes('/user/login')) {
        history.push(`/user/login?redirect=${encodeURIComponent(pathname + search)}`);
      }
      return;
    }
    // 其他错误走控制台，交由调用方自行处理
    // eslint-disable-next-line no-console
    console.log(error);
  }
})
mediaDashboardRequest.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token')
  options.headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return {
    url: url,
    options: options
  }
}, {global: false})
mediaDashboardRequest.interceptors.response.use((response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    const { pathname, search } = window.location;
    if (!pathname.includes('/user/login')) {
      history.push(`/user/login?redirect=${encodeURIComponent(pathname + search)}`);
    }
  }
  return response;
}, { global: false })
