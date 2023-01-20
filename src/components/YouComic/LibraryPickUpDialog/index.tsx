import {useEffect, useState} from "react";
import {Modal, Select} from "antd";
import style from './style.less'
import {fetchLibraryList} from "@/services/youcomic/library";
export const LibraryPickUpDialog = ({ onOk,onCancel,isOpen = false }:{ onOk:(id:number) => void, onCancel:() => void,isOpen?:boolean }) => {
  const [libraryList,setLibraryList] = useState<YouComicAPI.Library[]>([])
  const [value,setValue] = useState<string>()
  const refreshLibrary = async () => {
    const list = await fetchLibraryList({ page_size:1000 })
    setLibraryList(list.result)
  }
  useEffect(() => {
    if (isOpen) {
      refreshLibrary()
    }
  },[isOpen])
  const onDialogOk = () => {
    if (value) {
      onOk(Number(value))
    }
  }
  return (
    <Modal visible={isOpen} title={"选择书库"} onCancel={onCancel} onOk={onDialogOk}>
      <Select
        value={value}
        onChange={(v) => setValue(v)}
        className={style.select}
        placeholder={"选择书库"}
      >
        {
          libraryList.map(it => {
            return (
              <Select.Option value={it.id} className={style.select}>
                { it.name }
              </Select.Option>
            )
          })
        }
      </Select>
    </Modal>
  )
}
