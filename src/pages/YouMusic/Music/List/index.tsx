import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {useEffect} from "react";
import styles from './styles.less'
import MusicEditor from "@/components/YouMusic/MusicEditor";
import {Button, Divider} from "antd";
import {MusicItem} from "@/pages/YouMusic/models/musicList";
import UpdateProcessDialog from "@/components/YouMusic/UpdateProcessDialog";

const MusicListPage = () => {
  const model = useModel('YouMusic.musicList')
  useEffect(() => {
    model.loadData({})
  }, [])
  const column: ProColumns<MusicItem>[] = [
    {
      title: 'cover',
      dataIndex: 'id',
      key: 'id',
      width: 48,
      hideInSearch: true,
      render: (text, record) => {
        if (!record.album?.cover) {
          return <></>
        }
        return (
          <img src={record.editor?.coverFile ? URL.createObjectURL(record.editor.coverFile) : record.album.cover}
               className={styles.cover}/>
        )
      }
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        return (
          <div className={record.editor?.title ? styles.edited : undefined}>
            {record.editor?.title ?? record.title}
          </div>
        )
        return
      }
    },
    {
      title: 'Album',
      dataIndex: 'album',
      key: 'album',
      render: (_, rec) => {
        return (
          <div className={rec.editor?.album ? styles.edited : undefined}>
            {rec.editor?.album ?? rec.album?.name}
          </div>
        )
      }
    },
    {
      title: 'Artist',
      dataIndex: 'id',
      key: 'artist',
      render: (text, record) => {
        const artist = record.editor?.artist ?? record.artist.map(it => it.name)
        if (!artist) {
          return <></>
        }
        return artist.map(it => {
          return (
            <>
              <span className={record.editor?.artist ? styles.edited : undefined}>{it}</span>
              <Divider type="vertical"/>
            </>
          )
        })
      }
    },
  ]
  return (
    <PageContainer
      extra={
        <>
          {
            model.hasEditedMusic() && <Button onClick={() => model.applyEdit()}>
              Save
            </Button>
          }
        </>
      }
    >
      <MusicEditor
        open={model.isEditorOpen}
        onClose={() => model.setIsEditorOpen(false)}
        {...model.getEditValues()}
        onSave={(values) => {
          model.updateValues(values)
        }}
      />
      <UpdateProcessDialog
        open={model.updateInfo.open}
        total={model.updateInfo.total}
        success={model.updateInfo.success}
        current={model.updateInfo.success + model.updateInfo.fail}
        name={model.updateInfo.name}
      />
      <ProTable
        dataSource={model.musicList}
        columns={column}
        bordered={false}
        size={"small"}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            model.setContextMusics(selectedRows)
          },
          selectedRowKeys: model.contextMusics.map((it: MusicItem) => it.id)
        }}
        toolbar={{

        }}
        tableAlertOptionRender={(props) => {
          return (
            <>
              <a onClick={() => model.setIsEditorOpen(true)}>
                Edit
              </a>
              <Divider type='vertical'/>
              <a onClick={() => model.setContextMusics([])}>
                Clear all
              </a>
            </>
          )
        }}
        pagination={{
          showQuickJumper: true,
          total: model.pagination.total,
          current: model.pagination.page,
          pageSize: model.pagination.pageSize,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          defaultPageSize: 50,
          onChange: (page, pageSize) => {
            model.loadData({
              page: {
                ...model.pagination, page, pageSize
              },
            })
          }
        }}
        onSubmit={(values) => {
          model.loadData({
            ...values
          })
        }}
        rowKey={(rec) => rec.id}
      />
    </PageContainer>
  )
}
export default MusicListPage
