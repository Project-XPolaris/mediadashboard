import {Modal, Select, Space, Tag} from "antd";
import {fetchLibraryList, Library} from "@/services/youphoto/library";
import {useEffect, useState} from "react";
import {ProList} from "@ant-design/pro-components";
import {uploadImageWithBase64} from "@/services/youphoto/image";

export type UploadItem = {
  name: string
  base64: string
}
export type Base64UploadDialogProps = {
  open?: boolean
  onClose?: () => void
  uploadItems: UploadItem[]
}
const Base64UploadDialog = ({open, onClose, uploadItems}: Base64UploadDialogProps) => {
  const [libraryList, setLibraryList] = useState<Library[]>([])
  const [selectLibraryId, setSelectLibraryId] = useState<number | undefined>()
  const [uploadStatus, setUploadStatus] = useState<Record<string, { status: string, err: string }>>({})
  const loadLibraryList = async () => {
    const fetchLibraryResponse = await fetchLibraryList()
    if (fetchLibraryResponse) {
      if (fetchLibraryResponse.success && fetchLibraryResponse.result) {
        setLibraryList(fetchLibraryResponse.result)
        if (fetchLibraryResponse.result.length > 0) {
          setSelectLibraryId(fetchLibraryResponse.result[0].id)
        }
      }
    }
  }
  useEffect(() => {
    loadLibraryList()
  }, [])
  const upload = async () => {
    if (!selectLibraryId) {
      return
    }        const newStatus = uploadStatus

    for (let uploadItem of uploadItems) {
      try {
        const response = await uploadImageWithBase64({
          filename: uploadItem.name,
          base64: uploadItem.base64,
          libraryId: selectLibraryId
        })
        if (response) {
          if (response.success) {
            newStatus[uploadItem.name] = {
              status: "Success",
              err: ""
            }
            setUploadStatus(newStatus)
          } else {
            newStatus[uploadItem.name] = {
              status: "Error",
              err: response.err
            }
            setUploadStatus(newStatus)
          }
        }
      }catch (e){
        newStatus[uploadItem.name] = {
          status: "Error",
          err: (e as any).toString()
        }
        setUploadStatus(newStatus)
      }

    }
  }
  return (
    <Modal
      title={"Upload"}
      open={open}
      onCancel={onClose}
      onOk={upload}
    >
      <Space direction={"vertical"} style={{width: "100%"}}>
        <div>
          <Select
            style={{width: "100%"}}
            options={
              libraryList.map((library) => {
                return {
                  label: library.name,
                  value: library.id
                }
              })
            }
            value={selectLibraryId}
            onChange={(value) => {
              setSelectLibraryId(value as number)
            }}
          />
        </div>
        <div style={{ height:"40vh",overflowY:'scroll' }}>
          <ProList<UploadItem>
            rowKey="name"
            dataSource={uploadItems}
            metas={{
              title: {
                dataIndex: 'name',
              },
              avatar: {
                render: (text, rec) => {
                  return <img src={`data:image/jpeg;base64,${rec.base64}`} style={{maxWidth: 64, maxHeight: 64}}/>
                }
              },
              actions:{
                render: (text, rec) => {
                  return (
                    <Space>
                      <Tag >{uploadStatus[rec.name]?.status ?? "Not upload"}</Tag>
                    </Space>
                  )
                }
              },
              description:{
                render: (text, rec) => {
                  return (
                    <Space>
                      {uploadStatus[rec.name]?.err ?? ""}
                    </Space>
                  )
                }
              }
            }}
          />
        </div>
      </Space>
    </Modal>
  )
}
export default Base64UploadDialog
