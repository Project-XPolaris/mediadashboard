import React, {useEffect} from "react";
import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {Button, Card, Divider, Popconfirm} from "antd";
import {useModel} from "@umijs/max";
import {Library} from "@/services/youvideo/library";
import ScanOptionDialog from "@/components/YouVideo/ScanOptionDialog";
import styles from './styles.less'
import NewYouVideoLibraryDialog from "@/components/YouVideo/NewLibraryDialog";

const LibraryListPage: React.FC = () => {
  const model = useModel('YouVideo.libraryList')
  useEffect(() => {
    model.initData({})
  }, [])
  const columns: ProColumnType<Library>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      hideInSearch: true,
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
      render: (text,rec) => {
        return (
          <>
            <ScanOptionDialog
              trigger={
                <a className={styles.action}>
                  Scan
                </a>
              }
              onOk={(values) => {
                model.scan(rec.id, values)
              }}
            />
            <Divider type="vertical"/>
            <a className={styles.action} onClick={() => model.syncIndex(rec.id)}>
              Sync Index
            </a>
            <Divider type="vertical"/>
            <a className={styles.action} onClick={() => model.generateMeta(rec.id)}>
              Generate Meta
            </a>
            <Divider type="vertical"/>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => model.deleteLibrary(rec.id)}
              okText="Yes"
              cancelText="No"
            >
              <a className={styles.action}>
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
        <Button onClick={() => model.setNewLibraryDialogOpen(true)}>New library</Button>
      </>
    }>
      <NewYouVideoLibraryDialog
        onOk={(name, isPrivate, path) => model.createLibrary({
          name, path, private: isPrivate
        })}
        onCancel={() => model.setNewLibraryDialogOpen(false)}
        visible={model.newLibraryDialogOpen}
      />
      <Card>
        <ProTable
          columns={columns}
          dataSource={model.libraryList}
          pagination={{
            showQuickJumper: true,
            total: model.pagination.total,
            current: model.pagination.page,
            pageSize: model.pagination.pageSize,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            defaultPageSize: 50,
            onChange: (page, pageSize) => {
              model.initData({
                page: {
                  ...model.pagination, page, pageSize
                },
              })
            }
          }}
          search={false}
        />
      </Card>
    </PageContainer>
  )
}
export default LibraryListPage
