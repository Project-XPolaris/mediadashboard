import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {message} from "antd";
import {
  createLibrary,
  deleteLibrary,
  fetchLibraryList, generateLibraryThumbnail,
  matchLibraryBooksTag,
  scanLibraryById
} from "@/services/youcomic/library";
import {newWriteBookMetaTask} from "@/services/youcomic/task";

export type LibraryItem = {} & YouComicAPI.Library
const libraryListModel = () => {
  const [libraryList, setLibraryList] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1, pageSize: 20, total: 0
  })
  const refresh = async ({queryPagination = pagination}: { queryPagination?: DataPagination }) => {
    try {
      setLoading(true);
      const response = await fetchLibraryList({page: queryPagination.page, page_size: queryPagination.pageSize});
      if (response.result) {
        setLibraryList(response.result);
        setPagination({
          page: response.page,
          pageSize: response.pageSize,
          total: response.count
        })
      }
    } catch (e) {
      message.error("load library list error");
    } finally {
      setLoading(false);
    }
  }
  const scanLibrary = async (id: number) => {
    await scanLibraryById({id})
    message.success('Scan task added');
  }
  const matchLibrary = async (id: number) => {
    await matchLibraryBooksTag(id)
    message.success('Tag match task added');
  }
  const remove = async (id: number) => {
    await deleteLibrary(id)
    message.success('Tag match task added');
  }
  const create = async ({name,path}:{name:string,path:string}) => {
    await createLibrary({name,path})
    await refresh({})
    message.success('library created');
  }
  const generateThumbnails = async (id: number,force:boolean) => {
    await generateLibraryThumbnail(id,force)
    message.success('Generate thumbnail task added');
  }
  const writeMeta = async (id: number) => {
    await newWriteBookMetaTask({libraryId:id})
    message.success('Write meta task added');
  }
  return {
    refresh, libraryList, loading, pagination, scanLibrary,matchLibrary,remove,create,generateThumbnails,writeMeta
  }
}
export default libraryListModel
