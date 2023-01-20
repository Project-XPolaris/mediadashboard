import {request} from "@umijs/max";

export type Auth = {
  name: string;
  type: string;
  url: string;
}
export type AppInfo = {
  auth: Auth[];
  name: string;
  success: boolean;
}

export const fetchAppInfo = async (baseUrl: string): Promise<AppInfo> => {
  return request(`${baseUrl}/info`, {
    method: 'GET'
  })
}
