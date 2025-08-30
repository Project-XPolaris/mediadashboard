import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {LibraryItem} from "@/pages/YouComic/models/libraryList";
import {useEffect, useState} from "react";
import {Button, Divider, Popconfirm} from "antd";
import {PlusOutlined, AppstoreAddOutlined, DeleteOutlined, SyncOutlined, TagsOutlined, PictureOutlined, FileTextOutlined} from "@ant-design/icons";
import NewYouComicLibraryDialog from "@/components/YouComic/NewLibraryDialog";
import BatchCreateLibrariesDialog from "@/components/YouComic/BatchCreateLibrariesDialog";
import {batchCreateLibraries, batchDeleteLibraries} from "@/services/youcomic/library";
import ScanOptionDialog from "@/components/YouComic/GenerateThumbnailOptionDialog";

const LibraryListPage = () => {
  const model = useModel('YouComic.libraryList')
  const [newLibraryDialog, setNewLibraryDialog] = useState(false)
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([])
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
      key: 'name',
      render: (text, record) => <a href={`#/youcomic/library/${record.id}`}>{text}</a>
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
              <a><SyncOutlined /> Scan</a>
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
              <a><TagsOutlined /> Match Tags</a>
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
              <a><DeleteOutlined /> Delete</a>
            </Popconfirm>
            <Divider type={"vertical"}/>
            <ScanOptionDialog
              trigger={<a><PictureOutlined /> Generate thumbnails</a>}
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
              <a><FileTextOutlined /> Write meta</a>
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
          <Button icon={<PlusOutlined />} onClick={() => setNewLibraryDialog(true)}>Add library</Button>
          <Button icon={<AppstoreAddOutlined />} style={{marginLeft: 8}} onClick={() => setBatchDialogOpen(true)}>Batch create</Button>
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
      <ProTable
        rowKey={(r) => String(r.id)}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as (string | number)[])
        }}
        dataSource={model.libraryList}
        columns={columns}
        tableAlertRender={({selectedRowKeys}) => `Selected ${selectedRowKeys.length} items`}
        tableAlertOptionRender={({selectedRowKeys, onCleanSelected}) => (
          <>
            <a
              onClick={async () => {
                const ids = (selectedRowKeys as any[]).map((k) => Number(k))
                if (ids.length === 0) return
                await batchDeleteLibraries(ids)
                onCleanSelected?.()
                setSelectedRowKeys([])
                await model.refresh({})
              }}
            >Delete</a>
          </>
        )}
      />
      <BatchCreateLibrariesDialog
        visible={batchDialogOpen}
        onCancel={() => setBatchDialogOpen(false)}
        onSubmit={async (drafts, scan) => {
          if (drafts.length === 0) {
            setBatchDialogOpen(false)
            return
          }
          await batchCreateLibraries({
            libraries: drafts.map(d => ({name: d.name, path: d.path})),
            scan
          })
          await model.refresh({})
          setBatchDialogOpen(false)
        }}
      />
    </PageContainer>
  )
}
export default LibraryListPage;
