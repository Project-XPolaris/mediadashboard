import {BaseResponse, ListContainer} from "@/services/youvideo/library";
import {youPhotoRequest} from "@/services/youphoto/client";
export type Library = {
  id: number;
  name: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}
type File = {
  type: string;
  name: string;
  path: string;
}

type DirInfo = {
  backPath: string;
  files: File[];
  path: string;
  sep: string;
}
type  FetchDirInfo = BaseResponse<DirInfo>
export const createLibrary = async (param: { name: string, path: string, private: boolean }) => {
  return youPhotoRequest<BaseResponse<undefined>>("/libraries", {
    method: "POST",
    data: param
  });
};
export const fetchLibraryList = async (param: { page: number, pageSize: number } = { page: 1, pageSize: 100 }) => {
  return youPhotoRequest<ListContainer<Library> & BaseResponse<undefined>>("/libraries", {
    method: "GET",
    params: param
  });
};

export const scanLibrary = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/library/${param.id}/scan`, {
    method: "POST"
  });
};
export const deleteLibrary = async (param: { id: number }) => {
  return youPhotoRequest<BaseResponse<undefined>>(`/library/${param.id}`, {
    method: "DELETE"
  });
};
export const fetchDirInfo = async (path: string):Promise<FetchDirInfo> => {
  console.log(path);
  return youPhotoRequest<FetchDirInfo>("/readdir", {
    method: "GET",
    params: {
      path
    }
  });
};
