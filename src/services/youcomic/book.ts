import {youComicRequest} from "@/services/youcomic/client";
import {ListContainer} from "@/services/youvideo/library";

export type QueryBookListParams = {
  page?: number;
  page_size: number
}
export const fetchBookList = async (params: QueryBookListParams): Promise<ListContainer<YouComicAPI.Book>> => {
  return youComicRequest.get('/books', {params})
}
export const updateBook = async (id: number, data: any): Promise<any> => {

  return youComicRequest.patch(`/book/${id}`, {
    data
  })
}

export const deleteBook = async (id: number, permanently: boolean): Promise<any> => {
  return youComicRequest.delete(`/book/${id}`, {
    params: {
      permanently: permanently ? "true" : "false"
    }
  })
}

export const bookBatch = async (data: any): Promise<any> => {
  return youComicRequest.post(`/book/batch`, {
    data
  })
}
