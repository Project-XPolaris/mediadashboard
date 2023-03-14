import {LightFilter, PageContainer, ProColumns, ProFormSelect, ProTable} from "@ant-design/pro-components";
import {useModel} from "@@/exports";
import {useEffect, useState} from "react";
import {EntityItem} from "@/pages/YouVideo/models/entityList";
import styles from './style.less'
import SearchSubjectDialog from "@/components/Bangumi/SearchSubjectDialog";
import {DeleteOutlined, DownOutlined, VideoCameraOutlined} from "@ant-design/icons";
import {Button, Divider, Dropdown, Menu, Popconfirm, Select, Space, theme, Typography} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import EntityDrawer from "@/components/EntityDrawer";

type EntityDrawerState = {
  id?: number
  open: boolean
}
const EntityListPage = () => {
  const model = useModel("YouVideo.entityList")
  const [searchSubjectDialogVisible, setSearchSubjectDialogVisible] = useState(false)
  const [contextEntity, setContextEntity] = useState<EntityItem>()
  const [entityDrawerState, setEntityDrawerState] = useState<EntityDrawerState>({open: false})
  useEffect(() => {
    model.loadData({})
    model.loadLibrary()
  }, []);
  const {
    token: {
      colorPrimary,
    },
  } = theme.useToken();
  const column: ProColumns<EntityItem>[] = [
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
        if (!record.cover) {
          return <div className={styles.noCover}>
            <VideoCameraOutlined/>
          </div>
        }
        return (
          <img src={record.cover} className={styles.cover}/>
        )
      },
      width: 64
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        const name = record.edit?.name || record.name
        const isEditing = record.edit !== undefined
        return (
          <Space>
            <Typography.Text
              style={{color: isEditing?colorPrimary:undefined}}
              editable={{
                onChange: (value) => model.setEditFieldValue(record.id, "name", value)
              }}
            >
              {name}
            </Typography.Text>
            {
              isEditing && (<DeleteOutlined
                style={{color: colorPrimary}}
                onClick={() => model.setEditFieldValue(record.id, "name", undefined)}
              />)
            }
          </Space>


        )
      },
    },
    {
      title: 'Library',
      dataIndex: 'libraryId',
      key: 'library',
      render: (_, record) => {
        const library = model.libraryList.find(l => l.id === record.libraryId)
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
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => {
        const applyMenuItems: ItemType[] = [
          {
            key: '1',
            label: 'Bangumi',
            onClick: () => {
              setContextEntity(record)
              setSearchSubjectDialogVisible(true)
            }
          },
        ];
        return (
          <Dropdown overlay={<Menu items={applyMenuItems}/>}>
            <a onClick={e => e.preventDefault()}>
              <Space>
                apply from source
                <DownOutlined/>
              </Space>
            </a>
          </Dropdown>
        )
      }
    },
  ]
  return (
    <PageContainer>
      <EntityDrawer
        id={entityDrawerState.id}
        open={entityDrawerState.open}
        onClose={() => setEntityDrawerState({open: false})}
      />
      <SearchSubjectDialog
        visible={searchSubjectDialogVisible}
        onCancel={() => setSearchSubjectDialogVisible(false)}
        type={2}
        onOk={async (subject) => {
          if (!contextEntity) {
            return
          }
          await model.applyFromSource(contextEntity.id, "bangumi", String(subject.id))
          setSearchSubjectDialogVisible(false)
        }}
      />
      <ProTable<EntityItem>
        dataSource={model.entityList}
        columns={column}
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
          model.updateFilter(values)
        }}
        rowKey={it => it.id}
        rowSelection={{
          selectedRowKeys: model.selectedEntity.map(it => it.id),
          onChange: (selectedRowKeys, selectedRows) => {
            model.setSelectedEntity(selectedRows)
          }
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
                        queryOrder: value
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
              <Divider/>
              {
                model.hasChangeItem() && (
                  <>
                    <Button
                      type={"primary"}
                      onClick={model.saveChanges}>
                      Save changes
                    </Button>
                    <Button onClick={model.clearChanges}>
                      Clear changes
                    </Button>
                  </>
                )
              }
            </Space>

          ),
        }}
        tableAlertOptionRender={(props) => {
          return (
            <Popconfirm
              title={"Are you sure to delete these entities?"}
              onConfirm={() => model.deleteSelected()}
            >
              <a>Delete</a>
            </Popconfirm>
          )
        }}
      />
    </PageContainer>
  )
}
export default EntityListPage
