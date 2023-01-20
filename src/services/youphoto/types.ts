declare namespace YouPhotoAPI {
  type DeleteLibraryTaskOutput = {
    id: number;
    path: string;
    current: number;
    total: number;
    name: string;
  }
  type ScanLibraryTaskOutput = {
    id: number;
    path: string;
    current: number;
    total: number;
    currentPath: string;
    currentName: string;
    name: string;
  }
  type YouPhotoTaskOutput = DeleteLibraryTaskOutput | ScanLibraryTaskOutput
  type Photo = {
    id: number,
    name: string,
    thumbnail: string,
    created: string,
    updated: string,
  }
}
