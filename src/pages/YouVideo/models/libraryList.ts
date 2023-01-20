import {
  fetchLibraryList,
  Library,
  newDeleteLibraryTask,
  newGenerateVideoMetaTask,
  newLibrary,
  newScanLibraryTask,
  syncLibraryIndex
} from "@/services/youvideo/library";
import {useState} from "react";
import {message} from "antd";
import {DataPagination} from "@/utils/page";

const libraryListModel = () => {
  const [libraryList, setLibraryList] = useState<Library[]>([]);
  const [newLibraryDialogOpen, setNewLibraryDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0
  })
  const initData = async ({page = pagination}: { page?: DataPagination }) => {
    const response = await fetchLibraryList()
    if (!response.success) {
      message.error(response.err)
      return
    }
    const dataList = response.data
    if (!dataList) {
      message.error("library list is null")
      return
    }
    if (dataList.result) {
      setLibraryList(dataList.result)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: dataList.count
      })
    }
  }
  const scan = async (libraryId: number, data: {
    directoryMode?: boolean
    excludeDir?: string[]
  }) => {
    await newScanLibraryTask(libraryId, data)
    message.success("Scan task created")
  }
  const syncIndex = async (libraryId: number) => {
    await syncLibraryIndex(libraryId)
    message.success("Sync task created")
  }
  const deleteLibrary = async (libraryId: number) => {
    await newDeleteLibraryTask(libraryId)
    message.success("Library delete task created")
    await initData({})
  }
  const createLibrary = async (data: { name: string, path: string, private?: boolean }) => {
    await newLibrary(data)
    message.success("Library created")
    setNewLibraryDialogOpen(false)
    await initData({})
  }
  const generateMeta = async (libraryId: number) => {
    await newGenerateVideoMetaTask(libraryId)
    message.success("Generate meta task created")
  }
  return {
    libraryList,
    scan,
    syncIndex,
    deleteLibrary,
    newLibraryDialogOpen,
    setNewLibraryDialogOpen,
    createLibrary,
    generateMeta,
    initData,
    pagination
  }
}
export default libraryListModel
