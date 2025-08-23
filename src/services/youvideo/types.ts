declare namespace YouVideoAPI {
  export interface Video {
    id: number;
    base_dir: string;
    dirName: string;
    name: string;
    library_id: number;
    type: string;
    files: File[];
    order?: number;
    ep?: string;
    entityId?: number;
    release?: string;
    infos?: { id: number; key: string; value: string }[];

  }

  export interface File {
    id: number;
    path: string;
    cover: string;
    duration: number;
    size: number;
    bitrate: number;
    MainVideoCodec: string;
    main_audio_codec: string;
    video_id: number;
    name: string;
    coverWidth: number;
    coverHeight: number;
    subtitles: Subtitle[];
  }

  export interface Subtitle {
    id: number;
    label: string;
  }

  export interface Entity {
    id: number;
    name: string;
    summary: string;
    videos: Video[];
    cover: string;
    coverWidth: number;
    coverHeight: number;
    libraryId: number;
    release?: string;
    infos?: {
      id: number;
      key: string;
      value: string;
    }[];
    tags?: {
      name: string;
      value: string;
    }[];
    template?: string;
  }
}
