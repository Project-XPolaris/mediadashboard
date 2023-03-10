import {BaseResponse, ListContainer} from "@/services/youvideo/library";
import {youComicRequest} from "@/services/youcomic/client";

export type QueryLibraryParam = {
  page?: number
  page_size?: number
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

export const fetchLibraryList = async (params: QueryLibraryParam): Promise<ListContainer<YouComicAPI.Library>> => {
  return youComicRequest<ListContainer<YouComicAPI.Library>>("/libraries", {
    method: "GET",
    params
  })
}
export const scanLibraryById = async ({id}: { id: number }) => {
  return youComicRequest.put(`/library/${id}/scan`);
};

export const matchLibraryBooksTag = async (libraryId: number) => {
  return youComicRequest.put(`/library/${libraryId}/match`);
}
export const deleteLibrary = async (id: number) => {
  return youComicRequest.delete(`/library/${id}`);
}
export const fetchDirInfo = async (path: string): Promise<FetchDirInfo> => {
  console.log(path);
  return youComicRequest<FetchDirInfo>("/explore/read", {
    method: "GET",
    params: {
      path
    }
  });
};

export const createLibrary = async (param: { name: string, path: string }) => {
  return youComicRequest<YouComicAPI.Library>("/libraries", {
    method: "POST",
    data: param
  })
}
export const generateLibraryThumbnail = async (libraryId: number, force: boolean) => {
  return youComicRequest.put(`/library/${libraryId}/thumbnails`, {
    params: {
      force: force ? "1" : ""
    }
  })
}

