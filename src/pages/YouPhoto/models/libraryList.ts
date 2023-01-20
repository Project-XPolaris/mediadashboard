import {useEffect, useState} from "react";
import {createLibrary, deleteLibrary, fetchLibraryList, Library, scanLibrary} from "@/services/youphoto/library";
import {message} from "antd";

const libraryListModel = () => {
  const [libraryList, setLibraryList] = useState<Library[]>([]);
  const loadData = async () => {
    const response = await fetchLibraryList()
    console.log(response)
    if (response?.result) {
      setLibraryList(response.result)
    }
  }
  const create = async (data: { name: string, path: string, private: boolean }) => {
    await createLibrary(data)
    message.success("Library created")
    await loadData()
  }
  const removeLibrary = async (libraryId: number) => {
    await deleteLibrary({id: libraryId})
    message.success("Library delete task created")
    await loadData()
  }
  const scan = async (libraryId: number) => {
    await scanLibrary({id: libraryId})
    message.success("Library scan task created")
  }
  useEffect(() => {
    loadData()
  }, []);

  return {
    libraryList, create, removeLibrary, scan
  }
}
export default libraryListModel
