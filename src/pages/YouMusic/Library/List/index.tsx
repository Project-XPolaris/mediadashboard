import {PageContainer} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {ColumnsType} from "antd/es/table";
import {Button, Card, Divider, Popconfirm, Table} from "antd";
import {useState} from "react";
import NewYouMusicLibraryDialog from "@/components/YouMusic/NewLibraryDialog";

const YouMusicLibraryListPage = () => {
  const model = useModel('YouMusic.libraryList')
  const [newLibraryDialogOpen, setNewLibraryDialogOpen] = useState(false)
  const columns: ColumnsType<YouMusicAPI.Library> = [
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
              onConfirm={() => {
                model.scan(text)
              }}
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
              onConfirm={() => model.remove(text)}
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
        <Button onClick={() => setNewLibraryDialogOpen(true)}>New library</Button>
      </>
    }>
      <NewYouMusicLibraryDialog
        onOk={async (path) => {
          await model.create(path)
          setNewLibraryDialogOpen(false)
        }}
        onCancel={() => setNewLibraryDialogOpen(false)}
        visible={newLibraryDialogOpen}
      />
      <Card>

        <Table dataSource={model.libraryList} columns={columns} />
      </Card>
    </PageContainer>
  )
}
export default YouMusicLibraryListPage
