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
  type PhotoColor = {
    cnt: number,
    value: string,
    percent: number,
    rank: number,
  }
  type Classify = {
    label: string,
    prob: number,
  }
  type Photo = {
    id: number,
    name: string,
    thumbnail: string,
    created: string,
    updated: string,
    width: number,
    height: number,
    domain?: string,
    imageColors?: PhotoColor[],
    classify?: Classify[],
  }

  type NearImage = {
    image: Photo,
    avgDistance: number,
  }
}
