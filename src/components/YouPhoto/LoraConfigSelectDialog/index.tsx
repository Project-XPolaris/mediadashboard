import {message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {fetchLoraConfigList} from "@/services/youphoto/lora";
import TextArea from "antd/es/input/TextArea";

export type LoraConfigSelectDialogDialogProps = {
  open?: boolean
  onClose?: () => void
  onOk?: ({id}: { id: number }) => void
}
export const LoraConfigSelectDialogDialog = ({open, onOk, onClose}: LoraConfigSelectDialogDialogProps) => {
  const [configList, setConfigList] = useState<YouPhotoAPI.LoraConfig[]>([])
  const [selectId, setSelectId] = useState<number | undefined>()
  const loadList = async () => {
    const response = await fetchLoraConfigList()
    if (response.data) {
      setConfigList(response.data)
      if (response.data.length > 0) {
        setSelectId(response.data[0].id)
      }
    } else {
      message.error("load failed")
    }
  }
  useEffect(() => {
    loadList()
  }, [])
  const getCurrentConfig = (): string | undefined => {
    return configList.find(it => it.id === selectId)?.config
  }
  return (
    <Modal
      open={open}
      onOk={() => {
        if (selectId && onOk) {
          onOk({id: selectId})
        }
      }}
      title={"Select train config"}
      onCancel={onClose}
    >
      <Select
        options={
          configList.map(it => {
            return {
              label: it.name,
              value: it.id,
            }
          })
        }
        onChange={(value) => {
          setSelectId(value)
        }}
        style={{width: '100%'}}
      />
      <div style={{maxHeight: "60vh", overflowY: "scroll", marginTop: 16}}>
        <pre>{getCurrentConfig() && JSON.stringify(JSON.parse(getCurrentConfig()!), null, 2)
        }</pre>
      </div>

    </Modal>
  )
}
export default LoraConfigSelectDialogDialog
