import {LightFilter, PageContainer, ProColumns, ProFormSelect, ProTable} from "@ant-design/pro-components";
import {useModel, history} from "@umijs/max";
import {useEffect, useState} from "react";
import {VideoItem} from "@/pages/YouVideo/models/videoList";
import styles from './style.less'
import {Button, Card, Col, Divider, Input, Row, Select, Space, Tag, theme, Typography} from "antd";
import NewEntityDialog from "@/components/YouVideo/NewEntityDialog";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";

const VideoListPage = () => {
  const model = useModel("YouVideo.videoList")
  const [newRegexInput, setNewRegexInput] = useState<string>('')
  const [selectNameRegex, setSelectNameRegex] = useState<string>('')
  const {
    token: {
      colorPrimary,
    },
  } = theme.useToken();
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
      title: 'cover',
      dataIndex: 'cover',
      key: 'cover',
      hideInSearch: true,
      render: (_, record) => {
        if (record.files?.length === 0) {
          return <></>
        }
        const file = record.files[0]
        return (
          <img src={file.cover} className={styles.cover}/>
        )
      },
      width: 64
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        const matchTitle = record.regexResult?.name
        const name = record.edit?.name || record.name
        const isEdited = record.edit?.name !== undefined
        return (
          <>
            <Space>
              <Typography.Text
                editable={{
                  onChange: (value) => model.applyEditItem(record.id, 'name', value)
                }}
                style={{color: isEdited ? colorPrimary : undefined}}
              >
                {name}
              </Typography.Text>
              {
                isEdited && (<CloseOutlined size={12} onClick={() => model.resetEditItem(record.id, 'name')}/>)
              }
              <a onClick={() => history.push(`/youvideo/video/detail?id=${record.id}`)}>Detail</a>
            </Space>
            {
              matchTitle && (
                <div>
                  <Tag.CheckableTag
                    checked={matchTitle.apply}
                    onChange={(checked) => model.onSelectRegexResult(record.id, 'name', checked)}
                  >{matchTitle.value} </Tag.CheckableTag>
                </div>
              )
            }
          </>
        )
      }
    },
    {
      title: 'ep',
      dataIndex: 'ep',
      key: 'ep',
      render: (_, record) => {
        const matchEp = record.regexResult?.ep
        const ep = record.edit?.ep || record.ep
        const isEdited = record.edit?.ep !== undefined
        return (
          <>
            <Space>
              <Typography.Text
                style={{color: isEdited ? colorPrimary : undefined}}
                editable={{
                  onChange: (value) => model.applyEditItem(record.id, 'ep', value)
                }}
              >
                {ep}
              </Typography.Text>
              {
                isEdited && (<CloseOutlined size={12} onClick={() => model.resetEditItem(record.id, 'ep')}/>)
              }
            </Space>
            {
              matchEp && (
                <div>
                  <Tag.CheckableTag
                    checked={matchEp.apply}
                    onChange={(checked) => model.onSelectRegexResult(record.id, 'ep', checked)}
                  >{matchEp.value} </Tag.CheckableTag>
                </div>
              )
            }
          </>
        )
      }
    },
    {
      title: 'order',
      dataIndex: 'order',
      key: 'order',
      render: (_, record) => {
        const matchOrder = record.regexResult?.order
        const order = record.edit?.order || record.order
        const isEdited = record.edit?.order !== undefined
        return (
          <>
            <Space>
              <Typography.Text
                style={{color: isEdited ? colorPrimary : undefined}}
                editable={{
                  onChange: (value) => model.applyEditItem(record.id, 'order', Number(value))

                }}>
                {order}
                {
                  isEdited && (<CloseOutlined size={12} onClick={() => model.resetEditItem(record.id, 'order')}/>)
                }
              </Typography.Text>
            </Space>
            {
              matchOrder && (
                <div>
                  <Tag.CheckableTag
                    checked={matchOrder.apply}
                    onChange={(checked) => model.onSelectRegexResult(record.id, 'order', checked)}
                  >{matchOrder.value} </Tag.CheckableTag>
                </div>
              )
            }
          </>
        )
      }
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
      proFieldProps: {
        renderFormItem: (_: any, {type, defaultRender, formItemProps, fieldProps, ...rest}: any, form: any) => {
          if (type === 'form') {
            return null;
          }
          return (
            <Select {...fieldProps} options={model.libraryList.map(it => ({label: it.name, value: it.id}))}/>
          )
        }
      },

    },

  ]

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={12}>
                <Space>
                  <Select<string>
                    style={{width: 720}}
                    options={model.nameMatchRegex.map(it => ({label: it, value: it}))}
                    onSelect={(value) => {
                      setSelectNameRegex(value as string)
                    }}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{margin: '8px 0'}}/>
                        <Space style={{padding: '0 8px 4px'}}>
                          <Input
                            placeholder="New regex"
                            onChange={(e) => setNewRegexInput(e.target.value)}
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined/>}
                            onClick={() => {
                              if (newRegexInput.length > 0) {
                                model.addNameMatchRegex(newRegexInput)
                              }
                            }}
                          >
                            Add item
                          </Button>
                        </Space>
                      </>
                    )}
                  />
                  <Button
                    onClick={() => {
                      model.applyNameRegexMatch(selectNameRegex)
                    }}
                    type={"primary"}
                  >
                    Apply Regex
                  </Button>
                  {
                    model.inNameMatchMode && (
                      <>
                        <Divider/>
                        <Button
                          onClick={() => {
                            model.saveMatchResult()
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            model.resetMatchResult()
                          }}
                        >
                          Clear
                        </Button>
                      </>
                    )
                  }

                </Space>

              </Col>
            </Row>

          </Card>
        </Col>
        <Col span={24}>
          <ProTable
            dataSource={model.videoList}
            columns={column}
            loading={model.loading}
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
                <Space>
                  <LightFilter>
                    <ProFormSelect
                      name="order"
                      label="Order"
                      fieldProps={{
                        dropdownMatchSelectWidth: false,
                        onChange: (value) => {
                          model.loadData({
                            queryOrder: value as string
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
                  {
                    model.videoHasEdited &&
                    <>
                      <Button type={"primary"} onClick={() => model.applyChange()}>Save changes</Button>
                      <Button onClick={() => model.resetChange()}>Reset changes</Button>
                    </>
                  }

                </Space>
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
        </Col>
      </Row>

    </PageContainer>
  )
}
export default VideoListPage
