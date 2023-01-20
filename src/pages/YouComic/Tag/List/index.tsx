import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {useEffect, useState} from "react";
import TagFilterDrawer from "@/components/YouComic/TagFilterDrawer";
import {Button, Divider, Dropdown, MenuProps, Modal, Popconfirm} from "antd";
import {MenuClickEventHandler} from "rc-menu/es/interface";

const { confirm } = Modal;

export const TagListPage = () => {
  const model = useModel('YouComic.tagList')
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  useEffect(() => {
    model.loadData({})
  }, [])
  const columns: ProColumnType<YouComicAPI.Tag>[] = [
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (text,rec) => {
        return (
          <>
            {
              model.selectTagIds.length > 0 && !model.selectTagIds.includes(rec.id) &&
              <Popconfirm
                title="Are you sure to merge to this tag?"
                onConfirm={() => {
                  model.mergeSelectTags(rec.id)
                }}
                okText="Yes"
                cancelText="No"
              >
                <a>Merge to this tag</a>
              </Popconfirm>

            }
          </>
        )
      }
    }
  ]
  const SelectedItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete',
    },
  ];
  const onSelectedMenuClick:MenuClickEventHandler = (info) => {
    switch (info.key) {
      case 'delete':
        confirm({
          title: 'Do you Want to delete these items?',
          content: 'Tag will be deleted',
          onOk() {
            model.deleteSelectedTags()
          },
        });
        break;
    }
  }
  return (
    <PageContainer
      extra={
      <>
        {
          model.selectTagIds.length !== 0 &&
          <Dropdown menu={{
            items: SelectedItems,
            onClick: onSelectedMenuClick,
          }}>
            <Button
              type={"primary"}
            >Selected {model.selectTagIds.length} items</Button>
          </Dropdown>
        }
        <Button onClick={() => {
          confirm({
            title: 'Confirm?',
            content: 'Remove all empty tags',
            onOk() {
              model.clearEmpty()
            },
          });
        }}>Clear empty tag</Button>
        <Divider type={"vertical"} />
        <Button type={"primary"} onClick={() => setFilterDialogOpen(true)}>Filter</Button>
      </>
      }
    >
      <TagFilterDrawer
        onClose={() => setFilterDialogOpen(false)}
        filter={model.filter}
        isOpen={filterDialogOpen}
        onFilterUpdate={model.updateFilter}
      />
      <ProTable<YouComicAPI.Tag>
        dataSource={model.tags}
        columns={columns}
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
              queryPagination:{
                ...model.pagination, page, pageSize
              }
            })
          }
        }}
        tableAlertRender={false}
        rowKey={(it) =>it.id}
        search={false}
        rowSelection={{
          selectedRowKeys: model.selectTagIds,
          onChange: (selectedRowKeys, selectedRows) => {
            model.setSelectTagIds(selectedRowKeys as any)
          }
        }}
      />
    </PageContainer>
  )
}
export default TagListPage;
