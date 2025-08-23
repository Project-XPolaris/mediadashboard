import {youComicRequest} from "@/services/youcomic/client";
import {ListContainer} from "@/services/youvideo/library";

export type QueryBookListParams = {
  page?: number;
  page_size: number;
  id?: number | string;
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

export const queryPages = ({book, page, pageSize, order}: { book: string | number, page: number, pageSize: number, order?: string | undefined }):Promise<ListContainer<YouComicAPI.Page>> => {
  return youComicRequest.get(`/pages`, {
    params: {
      book,
      page,
      page_size: pageSize,
      order
    }
  })
}
