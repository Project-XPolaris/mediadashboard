declare namespace YouMusicAPI {
  export type Library = {
    id: number;
    path: string;
    name: string;
  }
  export type ListContainer<T> = {
    count: number
    data: T[]
  }

  export type ScanLibraryTaskOutput = {
    total: number
    current: number
  }

  export type TaskOutput = ScanLibraryTaskOutput

  export interface Tag {
    id: number
    name: string,
  }

  export interface Album {
    artist: Artist[];
    music: Music[];
    id: number;
    name: string;
    blurHash: string;
    color: string;
    cover: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Artist {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Music {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    duration: number;
    track?: number;
    filename: string;
    ext: string;
    album: Album;
    artist: Artist[];
    tag?: Tag[];
    bitrate: number;
    sampleRate: number;
    lossless: boolean;
    size: number;
    year?: number;
  }

  export type UpdateMusicData = {
    title?: string;
    artist?: string[];
    album?: string;
    year?: number;
    track?: number;
    genre?: string[];
    disc?: number;
    coverUrl?: string;
  }
  export type SearchAlbumMeta = {
    id: string;
    name: string;
    cover: string;
    artists: string;
    source: string;
  }
  export type AlbumMeta = {
    nemId?: string
    mbId?: string;
    name: string;
    artist: string;
    cover: string;
  }
}
