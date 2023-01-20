import {LightFilter, PageContainer, ProColumns, ProFormSelect, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {useEffect} from "react";
import {VideoItem} from "@/pages/YouVideo/models/videoList";
import styles from './style.less'
import {Divider, Select} from "antd";
import NewEntityDialog from "@/components/YouVideo/NewEntityDialog";
const VideoListPage = () => {
  const model = useModel("YouVideo.videoList")
  useEffect(() => {
    model.loadData({})
    model.loadLibrary()
  }, []);
  const column: ProColumns<VideoItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
    },
    {
      title:'cover',
      dataIndex:'cover',
      key:'cover',
      hideInSearch: true,
      render:(_,record)=>{
        if ( record.files?.length === 0) {
          return <></>
        }
        const file = record.files[0]
        return (
          <img src={file.cover} className={styles.cover} />
        )
      },
      width:64
    },
    {
      title:'name',
      dataIndex:'name',
      key:'name',
    },
    {
      title: 'Library',
      dataIndex: 'library_id',
      key: 'library',
      render: (_, record) => {
        const library = model.libraryList.find(l => l.id === record.library_id)
        if (!library) {
          return "unknown"
        }
        return `${library.name}(${library.id})`
      },
      proFieldProps:{
        renderFormItem: (_:any, {type, defaultRender, formItemProps, fieldProps, ...rest}:any, form:any) => {
          if (type === 'form') {
            return null;
          }
          return (
            <Select {...fieldProps} options={model.libraryList.map(it => ({label:it.name,value:it.id}))} />
          )
        }
      },

    },

  ]

  return (
    <PageContainer>
      <ProTable
        dataSource={model.videoList}
        columns={column}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            model.setSelectedVideo(selectedRows)
          },
          selectedRowKeys: model.selectedVideo.map((it: VideoItem) => it.id)
        }}
        tableAlertOptionRender={(props) => {
          return (
            <>
              <NewEntityDialog
                trigger={
                  <a>
                    Create new entity
                  </a>
                }
                onOk={
                  (values) => model.createNewEntity(values.name)
                }
              />

              <Divider type='vertical'/>
              <a onClick={() => model.setSelectedVideo([])}>
                Clear all
              </a>
            </>
          )
        }}
        toolbar={{
          filter: (
            <LightFilter>
              <ProFormSelect
                name="order"
                label="Order"
                fieldProps={{
                  dropdownMatchSelectWidth: false,
                  onChange: (value) => {
                    model.loadData({
                      queryOrder:value
                    })
                  }
                }}
                initialValue={model.order}
                allowClear={false}
                valueEnum={{
                  idasc: 'ID Asc',
                  iddesc: 'ID Desc',
                  nameasc: 'Name Asc',
                  namedesc: 'Name Desc',
                  createdasc: 'Created Asc',
                  createddesc: 'Created Desc',
                }}
              />
            </LightFilter>
          ),
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
        rowKey={(rec) => rec.id}
        onSubmit={(values) => model.updateFilter(values)}
      />
    </PageContainer>
  )
}
export default VideoListPage
