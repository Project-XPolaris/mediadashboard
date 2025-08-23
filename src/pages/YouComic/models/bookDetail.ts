import {fetchBookList, queryPages} from "@/services/youcomic/book";
import {useState} from "react";

const bookDetailModel = () => {
  const [bookDetail, setBookDetail] = useState<YouComicAPI.Book | undefined>(undefined);
  const [activeKey, setActiveKey] = useState<string>("base")
  const [bookPagePageSize, setBookPagePageSize] = useState<number>(10)
  const [bookPageCurrent, setBookPageCurrent] = useState<number>(1)
  const [bookPageTotal, setBookPageTotal] = useState<number>(0)
  const [bookPageList, setBookPageList] = useState<YouComicAPI.Page[]>([])
  const initBookPageData = async (
    id: string, {page = bookPageCurrent, pageSize = bookPagePageSize}: {
      page: number,
      pageSize: number
    }
  ) => {
    const resp = await queryPages({
      book: id,
      pageSize: pageSize,
      page: bookPageCurrent
    })
    if (resp.result) {
      setBookPageList(resp.result)
      setBookPageTotal(resp.count)
      setBookPageCurrent(pageSize)
      setBookPageCurrent(page)
    }
  }

  const pageUpdate = async (id: string, {page = bookPageCurrent, pageSize = bookPagePageSize}: {
    page: number,
    pageSize: number
  }) => {
    await initBookPageData(id, {page, pageSize})
  }


  const initData = async (id: string) => {
    if (bookDetail !== undefined && bookDetail.id.toString() === id) {
      return
    }
    const resp = await fetchBookList({
      id: id,
      page_size: 1
    })
    if (resp.result) {
      setBookDetail(resp.result[0])
    }
    await initBookPageData(id, {page: 1, pageSize: 20})

  }
  return {
    initData,
    bookDetail,
    activeKey,
    setActiveKey,
    bookPagePageSize,
    setBookPagePageSize,
    bookPageCurrent,
    setBookPageCurrent,
    bookPageTotal,
    setBookPageTotal,
    bookPageList,
    setBookPageList,
    pageUpdate
  }
}

export default bookDetailModel
