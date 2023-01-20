import {youComicRequest} from "@/services/youcomic/client";
import {ListContainer} from "@/services/youvideo/library";

export type QueryTagListParams = {
  page?: number;
  page_size?: number
  nameSearch?: string
  type?: string[] | string
  order?: string | string[]
}
export const fetchTagList = async (params: QueryTagListParams): Promise<ListContainer<YouComicAPI.Tag>> => {
  return youComicRequest.get('/tags', {params})
}

export const matchTagWithName = async (name: string): Promise<YouComicAPI.MatchTag[]> => {
  return youComicRequest.post(`/tags/match`, {
    data: {
      text: name
    }
  })
}

export const newCleanEmptyTagTask = () => {
  return youComicRequest.post(`/tags/clean`)
}

export const batchTag = (
  {
    deleteIds
  }:{
    deleteIds?: number[]
  }
) => {
  return youComicRequest.post(`/tags/batch`, {
    data: {
      'delete':deleteIds
    }
  })
}

export const mergeTags = ({from,to}:{from:number,to:number}) => {
  return youComicRequest.post(`/tags/addTag`, {
    data: {
      from,to
    }
  })
}
