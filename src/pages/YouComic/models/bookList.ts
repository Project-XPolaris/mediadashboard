import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {bookBatch, deleteBook, fetchBookList, updateBook} from "@/services/youcomic/book";
import {BookFilter} from "@/components/YouComic/BookFilterDrawer";
import {fetchTagList} from "@/services/youcomic/tag";
import {message, notification} from "antd";
import {newMoveBookTask} from "@/services/youcomic/task";
import {matchTagInfo} from "@/utils/match";

const bookListModel = () => {
  const [books, setBooks] = useState<YouComicAPI.Book[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1, pageSize: 20, total: 0
  });
  const [filter, setFilter] = useState<BookFilter>({
    order: [],
    tags: [],
    tagIds: [],
    libraryIds: [],
    library: [],
  });
  const [searchTags, setSearchTags] = useState<YouComicAPI.Tag[]>([]);
  const [contextBook, setContextBook] = useState<YouComicAPI.Book | null>(null);
  const loadData = async (
    {
      page = pagination.page,
      pageSize = pagination.pageSize,
      queryFilter = filter
    }: {
      page?: number,
      pageSize?: number
      queryFilter?: BookFilter
    }) => {
    let orderString = queryFilter.order
      .map(
        (item: any) => `
        ${item.order === 'asc' ? '' : '-'}books.${item.orderKey}
      `,
      )
      .join(',');
    if (orderString.length === 0) {
      orderString = '-books.id';
    }
    // const filterTags: any = searchParams.get('tagIds')
    // if (filterTags) {
    //   if (queryFilter.tagIds) {
    //     queryFilter.tagIds.push(filterTags as any)
    //   } else {
    //     queryFilter.tagIds = [filterTags as any]
    //   }
    // }
    const response = await fetchBookList({
      page: page,
      page_size: pageSize,
      order: orderString,
      nameSearch: queryFilter.nameSearch,
      startTime: queryFilter.startTime,
      endTime: queryFilter.endTime,
      tag: queryFilter.tagIds,
      library: queryFilter.library.map((it: YouComicAPI.Library) => it.id),
      pathSearch: queryFilter.pathSearch,
      tagNameSearch: queryFilter.tagSearch,
      tagNameSearchType: queryFilter.tagSearchType
    } as any)
    if (response.result) {
      setBooks(response.result)
      setPagination({
        total: response.count,
        pageSize: response.pageSize,
        page: response.page
      })
    }
  }
  const updatePagination = async (page: number, pageSize: number) => {
    setPagination({
      page, pageSize, total: pagination.total
    })
    await loadData({page, pageSize})
  }
  const [selectedBooks, setSelectedBooks] = useState<YouComicAPI.Book[]>([]);
  const updateFilter = (newFilter: BookFilter) => {
    setFilter(newFilter)
    loadData({queryFilter: newFilter})
  }
  const searchBookTags = async ({type, searchKey}: { type?: string, searchKey: string }) => {
    const queryTagsResponse = await fetchTagList({
      type, nameSearch:searchKey,page:1
    })

    setSearchTags(queryTagsResponse.result)

  }
  const updateList = async (
    {
      books
    }: {
      books: Array<{ id: number; title: string; tags: { name: string; type: string }[] }>
    }
  ) => {
    console.log(books)
    for (let book of books) {
      await updateBook(book.id,{name: book.title, updateTags: book.tags, overwriteTag: true})
    }
    loadData({})
    message.success(`update success`);
  }
  const move = async ({id}: { id: number }) => {
    await newMoveBookTask({bookIds: selectedBooks.map(it => it.id), to: id})
    setSelectedBooks([])
    message.success(`移动书籍任务已添加`);
  }
  const deleteSelectedBooks = async ({permanently}: { permanently: boolean }) => {
    for (const selectedBook of selectedBooks) {
      await deleteBook(selectedBook.id, permanently)
    }
    await loadData({})
    setSelectedBooks([])
    message.success(`removed ${selectedBooks.length}items`);
  }
  const matchSelectBook = async () => {
    const update = [];
    notification.open({
      type: 'info',
      message: 'Matching',
    });
    for (const selectedBook of selectedBooks) {
      const updateBook: any = {
        id: selectedBook.id,
        updateTags: [],
        overwriteTag: true,
      };
      const result = matchTagInfo(selectedBook.dirName);
      if (!result) {
        continue;
      }
      updateBook.name = result.title ?? selectedBook.name;
      if (result.artist) {
        updateBook.updateTags.push({
          name: result.artist,
          type: 'artist',
        });
      }
      if (result.theme) {
        updateBook.updateTags.push({
          name: result.theme,
          type: 'theme',
        });
      }
      if (result.series) {
        updateBook.updateTags.push({
          name: result.series,
          type: 'series',
        });
      }
      if (result.translator) {
        updateBook.updateTags.push({
          name: result.translator,
          type: 'translator',
        });
      }
      update.push(updateBook);
    }
    const updateKey = 'matchSelectBook';
    message.loading({content: 'Matching...', key: updateKey});
    await bookBatch({data: {update}})
    setSelectedBooks([])
    await loadData({})
    message.success({content: 'Complete', key: updateKey});
  }
  return {
    books,
    pagination,
    selectedBooks,
    setSelectedBooks,
    loadData,
    updatePagination,
    filter,
    updateFilter,
    setSearchTags,
    searchTags,
    searchBookTags,
    updateList,
    contextBook,
    setContextBook,
    move,
    deleteSelectedBooks,
    matchSelectBook
  }
}
export default bookListModel
