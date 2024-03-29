import {Directory} from "@/hooks/explore";
import {youVideoRequest} from "@/services/youvideo/client";

export type Library = {
  id: number;
  path: string;
  name: string;
  dir_name: string;

}

export type ListContainer<T> = {
  count: number
  page: number
  pageSize: number
  result: T[]
}
export type BaseResponse<T> = {
  success: boolean
  data?: T
  err: string
  code: string
}

export async function fetchLibraryList(): Promise<BaseResponse<ListContainer<Library>>> {
  return youVideoRequest(`/library`, {
    method: 'GET',
    params: {
      pageSize: 1000
    }
  });
}
export type ScanTaskOptions = {
  directoryMode?: boolean
  excludeDir?: string[]
  videoOption?:{
    forceNSFWCheck?: boolean
    enableNSFWCheck?: boolean
  }
}
export async function newScanLibraryTask(libraryId: number, data: ScanTaskOptions): Promise<BaseResponse<undefined>> {
  return youVideoRequest(`/library/${libraryId}/scan`, {
    method: 'POST',
    data
  });
}

export async function syncLibraryIndex(libraryId: number): Promise<BaseResponse<undefined>> {
  return youVideoRequest(`/library/${libraryId}/syncindex`, {
    method: 'POST',
  });
}

export async function newDeleteLibraryTask(libraryId: number): Promise<BaseResponse<undefined>> {
  return youVideoRequest(`/library/${libraryId}`, {
    method: 'DELETE',
  });
}

export async function readDirectory(path: string): Promise<Directory> {
  return youVideoRequest(`/files`, {
    method: 'GET',
    params: {
      path
    }
  });
}

export async function newLibrary(data: { path: string, private?: boolean, name: string }): Promise<BaseResponse<any>> {
  return youVideoRequest(`/library`, {
    method: 'POST',
    data
  });
}

export async function newGenerateVideoMetaTask(libraryId: number): Promise<BaseResponse<any>> {
  return youVideoRequest(`/library/${libraryId}/meta`, {
    method: 'POST',
  });
}
