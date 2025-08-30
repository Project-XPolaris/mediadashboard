declare namespace YouComicAPI {
  export type Library = {
    id: number;
    name: string;
    path: string;
    created_at: string;
    updated_at: string;
  }
  export type Tag = {
    id: number;
    created_at: Date;
    name: string;
    type: string;
  }
  export type Book = {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    cover: string;
    tags: Tag[];
    dirName: string;
  }
  export type User = {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  }
  export type UserGroup = {
    id: number;
    name: string;
  }
  export type Permission = {
    id: number
    name: string
  }

  export interface MatchTag {
    id: string
    name: string
    type: string
    source: 'raw' | 'pattern' | 'database' | 'custom' | 'ai' | 'llm'
  }

  export type BatchMatchTag = {
    text: string;
    result: MatchTag[];
  }
  export type ScanLibraryOutput = {
    targetDir: string;
    libraryId: number;
    name: string;
    total: number;
    current: number;
    currentDir: string;
    err: string;
    errorFiles: string[];
  }
  export type MatchTagTaskOutput = {
    targetDir: string;
    libraryId: number;
    name: string;
    total: number;
    current: number;
    currentDir: string;
  }
  export type RemoveLibraryTaskOutput = {
    libraryId: number;
    name: string;
    path: string;
  }
  export type GenerateLibraryThumbnailTaskOutput = {
    libraryId: number;
    total: number;
    current: number;
    skip: number;
    err?: any;
    fileErrors: any[];
  }
  export type MoveBookTaskOutput = {
    currentDir: string;
    total: number;
    current: number;
  }
  export type WriteMetaTaskOutput = {
    current: number;
    total: number;
    currentBook: string;
  }
  export type RemoveEmptyTaskOutput = {
    currentTagName: string;
    total: number;
    current: number;
  }
  export type TaskOutput =
    ScanLibraryOutput
    | MatchTagTaskOutput
    | RemoveLibraryTaskOutput
    | GenerateLibraryThumbnailTaskOutput
    | MoveBookTaskOutput
    | WriteMetaTaskOutput
    | RemoveEmptyTaskOutput

  export type Page = {
    id: number;
    created_at: string;
    order: number;
    book_id: number;
    path: string;
  }
}
