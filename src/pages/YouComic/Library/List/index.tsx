import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {LibraryItem} from "@/pages/YouComic/models/libraryList";
import {useEffect, useState} from "react";
import {Button, Divider, Popconfirm} from "antd";
import NewYouComicLibraryDialog from "@/components/YouComic/NewLibraryDialog";
import ScanOptionDialog from "@/components/YouComic/GenerateThumbnailOptionDialog";

const LibraryListPage = () => {
  const model = useModel('YouComic.libraryList')
  const [newLibraryDialog, setNewLibraryDialog] = useState(false)
  useEffect(() => {
    model.refresh({})
  }, [])
  const columns: ProColumnType<LibraryItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'path',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: "action",
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <>
            <Popconfirm
              title="Are you sure to scan?"
              onConfirm={() => {
                model.scanLibrary(record.id)
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Scan
              </a>
            </Popconfirm>
            <Divider type={"vertical"}/>
            <Popconfirm
              title="Are you sure to match books tag?"
              onConfirm={() => {
                model.matchLibrary(record.id)
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Match Tags
              </a>
            </Popconfirm>
            <Divider type={"vertical"}/>

            <Popconfirm
              title="Are you sure to delete library?"
              onConfirm={() => {
                model.remove(record.id)
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Delete
              </a>
            </Popconfirm>
            <Divider type={"vertical"}/>
            <ScanOptionDialog
              trigger={
                <a>Generate thumbnails</a>
              }
              onOk={
                (values) => model.generateThumbnails(record.id,values.force)
              }
            />
            <Divider type={"vertical"}/>
            <Popconfirm
              title="Are you sure to write meta?"
              onConfirm={() => {
                model.writeMeta(record.id)
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Write meta
              </a>
            </Popconfirm>
            </>
        )
      }
    }
  ]
  return (
    <PageContainer
      extra={
        <>
          <Button onClick={() => setNewLibraryDialog(true)}>Add library</Button>
        </>
      }
    >
      <NewYouComicLibraryDialog
        onOk={async (name, path) => {
          await model.create({name, path})
          setNewLibraryDialog(false)
        }}
        onCancel={
          () => setNewLibraryDialog(false)
        }
        visible={newLibraryDialog}
      />
      <ProTable dataSource={model.libraryList} columns={columns}/>
    </PageContainer>
  )
}
export default LibraryListPage;
