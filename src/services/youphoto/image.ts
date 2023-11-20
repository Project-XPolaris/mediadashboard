import {youPhotoRequest} from "@/services/youphoto/client";
import {BaseResponse, ListContainer} from "@/services/youvideo/library";

export const fetchImageList = async (param: {
  page: number,
  pageSize: number
  order: string,
  colorRank1?: string
  colorRank2?: string
  colorRank3?: string
  maxDistance?: number
  nearAvgId?: number
  minAvgDistance?: number
  libraryId?: number
  searchLabel?: string
  maxProbability?: number
  minProbability?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number,
  dbTag?: string[]
  dbTagNot?: string[],
  tag?: string[],
  tagNot?: string[],
} = {
  page: 1,
  pageSize: 20,
  order: "id",
}) => {
  return youPhotoRequest<ListContainer<YouPhotoAPI.Photo> & BaseResponse<undefined>>("/images", {
    method: "GET",
    params: param
  });
};


export const fetchNearImageList = async ({id, maxDistance}: {
  id: number,
  maxDistance: number,
}): Promise<BaseResponse<YouPhotoAPI.NearImage[]>> => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.NearImage[]>>(`/image/${id}/near`, {
    method: "GET",
    params: {
      maxDistance
    }
  });
}

export const deepdanbooruAnalyze = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.DeepdanbooruResult[]>>(`/image/deepdanbooru`, {
    method: "POST",
    params: param
  });
}

export const uploadImageWithBase64 = async (param: { base64: string, filename: string, libraryId: number }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/image/base64", {
    method: "POST",
    data: param
  });
}

export const imageTagger = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.DeepdanbooruResult[]>>(`/image/${param.id}/tagger`, {
    method: "GET",
  });
}

export const getImage = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.Photo>>(`/image/${param.id}`, {
    method: "GET",
  });
}

export const fetchTagList = async (
  params: {
    page?: number,
    pageSize?: number,
    nameSearch?: string,
  } = {
    page: 1,
    pageSize: 20,
  }
) => {
  return youPhotoRequest<BaseResponse<YouPhotoAPI.ImageTag>>(`/tags`, {
    method: "GET",
    params
  });
}


export const fetchTaggerModelList = async () => {
  return youPhotoRequest<BaseResponse<string[]>>("/tagger/models", {
    method: "GET",
  });
}
