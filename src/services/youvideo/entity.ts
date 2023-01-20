import {youVideoRequest} from "@/services/youvideo/client";
import {BaseResponse, ListContainer} from "@/services/youvideo/library";
export type EntityQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  order?: string;
  library?:number
}
export const fetchEntityList = async (params:EntityQueryParams):Promise<BaseResponse<ListContainer<YouVideoAPI.Entity>>> => {
  return youVideoRequest('/entities', {
    method: "GET",
    params
  })
}

export const newEntity = async (data:{libraryId:number,name:string}):Promise<YouVideoAPI.Entity> => {
  return youVideoRequest('/entities', {
    method: "POST",
    data
  })
}
export const addVideoToEntity = async(entityId:number,data:{ids:number[]}):Promise<BaseResponse<YouVideoAPI.Entity>> => {
  return youVideoRequest(`/entity/${entityId}/videos`, {
    method: "POST",
    data
  })
}

export const applyEntityInfoFromSource = async(entityId:number,source:string,sourceId:string):Promise<YouVideoAPI.Entity> => {
  return youVideoRequest(`/entity/${entityId}/apply`, {
    method: "POST",
    data:{
      source,
      sourceId
    }
  })

}

export type BatchEntityData =  {
  deleteIds?:number[]
}

export const batchEntity = async (data:BatchEntityData):Promise<BaseResponse<undefined>> => {
  return youVideoRequest('/entity/batch', {
    method: "POST",
    data
  })
}
