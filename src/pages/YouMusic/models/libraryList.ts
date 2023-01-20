import {useEffect, useState} from "react";
import {createLibrary, deleteLibrary, fetchLibraryList, scanLibrary} from "@/services/youmusic/library";
import {message} from "antd";

const libraryListModel = () => {
  const [libraryList, setLibraryList] = useState<YouMusicAPI.Library[]>([]);
  const loadData = async () => {
    const response = await fetchLibraryList()
    if (response?.data) {
      setLibraryList(response.data)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  const remove = async (libraryId: number) => {
    await deleteLibrary(libraryId)
    message.success("delete library")
    await loadData()
  }
  const create = async (libraryPath: string) => {
    await createLibrary(libraryPath)
    message.success("create library")
    await loadData()
  }
  const scan = async (libraryId:number) => {
    await scanLibrary(libraryId)
    message.success("scan library")
    await loadData()
  }
  return {
    libraryList, remove,create,scan
  }
}
export default libraryListModel
