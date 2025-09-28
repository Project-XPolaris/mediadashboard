import {BaseResponse, ListContainer} from "@/services/youvideo/library";
import {youPhotoRequest} from "@/services/youphoto/client";

export type Album = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  coverId?: number;
  cover?: number; // 封面图片ID
  imageCount?: number;
}

export type Tag = {
  id: number;
  tag: string;
}

export const createAlbum = async (param: { name: string }) => {
  return youPhotoRequest<BaseResponse<Album>>("/album", {
    method: "POST",
    data: param
  });
};

export const fetchAlbumList = async (param: { 
  page?: number, 
  pageSize?: number,
  nameSearch?: string 
} = {page: 1, pageSize: 20}) => {
  return youPhotoRequest<ListContainer<Album> & { success: boolean }>("/albums", {
    method: "GET",
    params: param
  });
};

export const deleteAlbum = async (param: { id: number, deleteImage?: boolean }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/album/${param.id}`, {
    method: "DELETE",
    params: { deleteImage: param.deleteImage }
  });
};

export const updateAlbumName = async (param: { id: number, name: string }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/album/${param.id}`, {
    method: "PUT",
    data: { name: param.name }
  });
};

export const addImageToAlbum = async (param: { albumId: number, imageIds: number[] }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/album/${param.albumId}/image`, {
    method: "POST",
    data: { imageIds: param.imageIds }
  });
};

export const removeImageFromAlbum = async (param: { albumId: number, imageIds: number[] }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/album/${param.albumId}/image`, {
    method: "DELETE",
    data: { imageIds: param.imageIds }
  });
};

export const addTagsToAlbum = async (param: { albumId: number, tagNames: string[] }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/album/${param.albumId}/tags`, {
    method: "POST",
    data: { tagNames: param.tagNames }
  });
};

export const getAlbumDetail = async (id: number) => {
  return youPhotoRequest<BaseResponse<Album>>(`/album/${id}`, {
    method: "GET"
  });
};
