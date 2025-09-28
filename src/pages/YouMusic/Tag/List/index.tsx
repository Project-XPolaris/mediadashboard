import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Input,
  Table,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
  Tag,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  MergeOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import tagListModel, { TagItem } from '../../models/tagList';
import {
  createTag,
  updateTag,
  deleteTag,
  deleteTags,
  mergeTag,
  getTagDetail,
  getTagStatistics,
  type TagStatistics,
} from '@/services/youmusic/tag';
import TagStatisticsComponent from '../components/TagStatistics';
import { formatDate } from '../utils/dateFormat';
import './style.less';

const { Search } = Input;
const { Option } = Select;

interface TagFormData {
  name: string;
}

interface MergeFormData {
  targetId: number;
}

const YouMusicTagList: React.FC = () => {
  const {
    tagList,
    pagination,
    loading,
    selectedTags,
    loadData,
    refreshData,
    handleSearch,
    handlePageChange,
    selectTag,
    selectAllTags,
    clearSelection,
  } = tagListModel();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<TagItem | null>(null);
  const [statistics, setStatistics] = useState<TagStatistics | null>(null);

  const [createForm] = Form.useForm<TagFormData>();
  const [editForm] = Form.useForm<TagFormData>();
  const [mergeForm] = Form.useForm<MergeFormData>();

  useEffect(() => {
    loadData();
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await getTagStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  // 移除了loadTagDetails函数，因为现在API直接返回音乐数量

  const handleCreateTag = async (values: TagFormData) => {
    try {
      await createTag(values.name);
      message.success('标签创建成功');
      setCreateModalVisible(false);
      createForm.resetFields();
      refreshData();
      loadStatistics();
    } catch (error) {
      message.error('标签创建失败');
    }
  };

  const handleEditTag = async (values: TagFormData) => {
    if (!currentTag) return;
    
    try {
      await updateTag(currentTag.id, values.name);
      message.success('标签更新成功');
      setEditModalVisible(false);
      setCurrentTag(null);
      editForm.resetFields();
      refreshData();
    } catch (error) {
      message.error('标签更新失败');
    }
  };

  const handleDeleteTag = async (tag: TagItem) => {
    try {
      await deleteTag(tag.id);
      message.success('标签删除成功');
      refreshData();
    } catch (error) {
      message.error('标签删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedTags.length === 0) {
      message.warning('请选择要删除的标签');
      return;
    }

    try {
      const ids = selectedTags.map(tag => tag.id);
      await deleteTags(ids);
      message.success(`成功删除 ${selectedTags.length} 个标签`);
      clearSelection();
      refreshData();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  const handleMergeTag = async (values: MergeFormData) => {
    if (!currentTag) return;
    
    try {
      await mergeTag(currentTag.id, values.targetId);
      message.success('标签合并成功');
      setMergeModalVisible(false);
      setCurrentTag(null);
      mergeForm.resetFields();
      refreshData();
    } catch (error) {
      message.error('标签合并失败');
    }
  };

  const openEditModal = (tag: TagItem) => {
    setCurrentTag(tag);
    editForm.setFieldsValue({ name: tag.name });
    setEditModalVisible(true);
  };

  const openMergeModal = (tag: TagItem) => {
    setCurrentTag(tag);
    setMergeModalVisible(true);
  };

  const columns: ColumnsType<TagItem> = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TagItem) => (
        <Space>
          <Tag color="blue">{name}</Tag>
          <Badge 
            count={record.musicCount || 0} 
            showZero 
            style={{ backgroundColor: '#52c41a' }}
          />
        </Space>
      ),
    },
    {
      title: '音乐数量',
      key: 'musicCount',
      width: 120,
      render: (_, record: TagItem) => (
        <Tooltip title="使用此标签的音乐数量">
          <Space>
            <SoundOutlined />
            {record.musicCount || 0}
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: TagItem) => (
        <Space>
          <Tooltip title="编辑标签">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="合并标签">
            <Button
              type="text"
              icon={<MergeOutlined />}
              onClick={() => openMergeModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个标签吗？"
            description="删除后将从所有音乐中移除此标签"
            onConfirm={() => handleDeleteTag(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除标签">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedTags.map(tag => tag.id),
    onChange: (selectedRowKeys: React.Key[]) => {
      const newSelectedTags = tagList.filter(tag => 
        selectedRowKeys.includes(tag.id)
      );
      selectedTags.forEach(tag => {
        if (!selectedRowKeys.includes(tag.id)) {
          selectTag(tag);
        }
      });
      newSelectedTags.forEach(tag => {
        if (!selectedTags.find(t => t.id === tag.id)) {
          selectTag(tag);
        }
      });
    },
    onSelectAll: selectAllTags,
  };

  return (
    <div className="youmusic-tag-list">
      {statistics && (
        <TagStatisticsComponent
          totalTags={statistics.totalTags}
          totalMusic={statistics.totalMusic}
          mostUsedTag={statistics.mostUsedTag}
          recentlyCreated={statistics.recentlyCreated}
        />
      )}
      
      <Card>
        <div className="tag-list-header">
          <div className="header-left">
            <h2>YouMusic 标签管理</h2>
            <p>管理音乐标签，支持创建、编辑、删除和合并操作</p>
          </div>
          <div className="header-actions">
            <Space>
              <Search
                placeholder="搜索标签名称"
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                新建标签
              </Button>
            </Space>
          </div>
        </div>

        {selectedTags.length > 0 && (
          <div className="batch-actions">
            <Space>
              <span>已选择 {selectedTags.length} 个标签</span>
              <Popconfirm
                title={`确定要删除选中的 ${selectedTags.length} 个标签吗？`}
                description="删除后将从所有音乐中移除这些标签"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
              <Button onClick={clearSelection}>
                取消选择
              </Button>
            </Space>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={tagList}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
        />
      </Card>

      {/* 创建标签模态框 */}
      <Modal
        title="创建新标签"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateTag}
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { min: 1, max: 50, message: '标签名称长度应在1-50字符之间' },
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑标签模态框 */}
      <Modal
        title="编辑标签"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentTag(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditTag}
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { min: 1, max: 50, message: '标签名称长度应在1-50字符之间' },
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 合并标签模态框 */}
      <Modal
        title="合并标签"
        open={mergeModalVisible}
        onCancel={() => {
          setMergeModalVisible(false);
          setCurrentTag(null);
          mergeForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={mergeForm}
          layout="vertical"
          onFinish={handleMergeTag}
        >
          <div style={{ marginBottom: 16 }}>
            <p>将标签 <Tag color="blue">{currentTag?.name}</Tag> 合并到：</p>
          </div>
          <Form.Item
            name="targetId"
            label="目标标签"
            rules={[{ required: true, message: '请选择目标标签' }]}
          >
            <Select
              placeholder="选择要合并到的标签"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {tagList
                .filter(tag => tag.id !== currentTag?.id)
                .map(tag => (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name} ({tag.musicCount || 0} 首音乐)
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              合并后，所有使用源标签的音乐将改为使用目标标签，源标签将被删除。
            </p>
          </div>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认合并
              </Button>
              <Button onClick={() => setMergeModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default YouMusicTagList;
