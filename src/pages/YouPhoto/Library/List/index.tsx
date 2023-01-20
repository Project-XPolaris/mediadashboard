import {PageContainer} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {ColumnsType} from "antd/es/table";
import {Button, Card, Divider, Popconfirm, Table} from "antd";
import {Library} from "@/services/youphoto/library";
import {useState} from "react";
import NewYouPhotoLibraryDialog from "@/components/YouPhoto/NewLibraryDialog";

const YouPhotoLibraryListPage = () => {
  const model = useModel('YouPhoto.libraryList')
  const [createLibraryDialogOpen, setCreateLibraryDialogOpen] = useState(false)
  const columns: ColumnsType<Library> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return (
          <>
            <Popconfirm
              title="Are you sure to scan?"
              onConfirm={() => model.scan(text)}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Scan
              </a>
            </Popconfirm>
            <Divider type={"vertical"} />
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => model.removeLibrary(text)}
              okText="Yes"
              cancelText="No"
            >
              <a>
                Delete
              </a>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  return (
    <PageContainer extra={
      <>
        <Button onClick={() => setCreateLibraryDialogOpen(true)}>
          New library
        </Button>
      </>
    }>
      <NewYouPhotoLibraryDialog
        onOk={async (name, isPrivate, path) => {
          await model.create({
            name, path, private: isPrivate
          })
          setCreateLibraryDialogOpen(false)
        }}
        onCancel={() => setCreateLibraryDialogOpen(false)}
        visible={createLibraryDialogOpen}
      />
      <Card>
        <Table dataSource={model.libraryList} columns={columns}/>
      </Card>
    </PageContainer>
  )
}
export default YouPhotoLibraryListPage
