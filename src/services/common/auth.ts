import {BaseResponse} from "@/services/youvideo/library";
import {request} from "@umijs/max";

export type AuthResult = {
  accessToken: string
  username: string
}
export const fetchUserAuth = (url: string, username: string, password: string): Promise<BaseResponse<AuthResult>> => {
  return request(url, {
    method: 'POST',
    data: {
      username, password
    }
  })
}
