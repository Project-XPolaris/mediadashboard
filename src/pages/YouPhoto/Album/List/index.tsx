import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { 
  Button, 
  Card, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Space,
  Image,
  Checkbox
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useModel, history } from '@umijs/max';
import { Album } from '@/services/youphoto/album';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import './styles.less';

const AlbumListPage: React.FC = () => {
  const model = useModel('YouPhoto.albumList');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [searchText, setSearchText] = useState('');
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [tagForm] = Form.useForm();

  useEffect(() => {
    model.refresh();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    model.refresh(1, model.pageSize, value);
  };

  const handleCreateAlbum = async () => {
    try {
      const values = await createForm.validateFields();
      const success = await model.create(values.name);
      if (success) {
        setCreateModalOpen(false);
        createForm.resetFields();
      }
    } catch (error) {
      // Form validation error
    }
  };

  const handleEditAlbum = async () => {
    if (!currentAlbum) return;
    try {
      const values = await editForm.validateFields();
      const success = await model.updateName(currentAlbum.id, values.name);
      if (success) {
        setEditModalOpen(false);
        setCurrentAlbum(null);
        editForm.resetFields();
      }
    } catch (error) {
      // Form validation error
    }
  };

  const handleAddTags = async () => {
    if (!currentAlbum) return;
    try {
      const values = await tagForm.validateFields();
      const tagNames = values.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      const success = await model.addTags(currentAlbum.id, tagNames);
      if (success) {
        setTagModalOpen(false);
        setCurrentAlbum(null);
        tagForm.resetFields();
      }
    } catch (error) {
      // Form validation error
    }
  };

  const openEditModal = (album: Album) => {
    setCurrentAlbum(album);
    editForm.setFieldsValue({ name: album.name });
    setEditModalOpen(true);
  };

  const openTagModal = (album: Album) => {
    setCurrentAlbum(album);
    setTagModalOpen(true);
  };

  const handleDeleteAlbum = async (id: number, deleteImage: boolean = false) => {
    await model.remove(id, deleteImage);
  };

  const showDeleteConfirm = (album: Album) => {
    let deleteImage = false;
    
    Modal.confirm({
      title: '删除相册',
      content: (
        <div>
          <div style={{ marginBottom: 16 }}>确定要删除相册 "{album.name}" 吗？</div>
          <Checkbox 
            onChange={(e) => { deleteImage = e.target.checked; }}
          >
            同时删除相册中的图片
          </Checkbox>
        </div>
      ),
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        handleDeleteAlbum(album.id, deleteImage);
      },
    });
  };

  const columns: ColumnsType<Album> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      render: (cover, record) => (
        cover ? (
          <Image
            width={60}
            height={60}
            src={`/api/youphoto/image/${cover}/thumbnail`}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div 
            style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 4
            }}
          >
            无封面
          </div>
        )
      ),
    },
    {
      title: '相册名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div 
            style={{ 
              fontWeight: 500,
              color: '#1890ff',
              cursor: 'pointer'
            }}
            onClick={() => history.push(`/youphoto/album/detail/${record.id}`)}
          >
            {text}
          </div>
          {record.imageCount !== undefined && (
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.imageCount} 张照片
            </div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<TagOutlined />}
            onClick={() => openTagModal(record)}
          >
            标签
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '相册管理',
        extra: [
          <Input.Search
            key="search"
            placeholder="搜索相册名称"
            style={{ width: 200 }}
            onSearch={handleSearch}
            allowClear
          />,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            创建相册
          </Button>,
        ],
      }}
    >
      <Card>
        <Table
          dataSource={model.albumList}
          columns={columns}
          loading={model.loading}
          rowKey="id"
          pagination={{
            current: model.page,
            pageSize: model.pageSize,
            total: model.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => model.refresh(page, pageSize, searchText),
          }}
        />
      </Card>

      {/* 创建相册弹窗 */}
      <Modal
        title="创建相册"
        open={createModalOpen}
        onOk={handleCreateAlbum}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="name"
            label="相册名称"
            rules={[
              { required: true, message: '请输入相册名称' },
              { min: 1, max: 50, message: '相册名称长度应在1-50个字符之间' },
            ]}
          >
            <Input placeholder="请输入相册名称" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑相册弹窗 */}
      <Modal
        title="编辑相册"
        open={editModalOpen}
        onOk={handleEditAlbum}
        onCancel={() => {
          setEditModalOpen(false);
          setCurrentAlbum(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="相册名称"
            rules={[
              { required: true, message: '请输入相册名称' },
              { min: 1, max: 50, message: '相册名称长度应在1-50个字符之间' },
            ]}
          >
            <Input placeholder="请输入相册名称" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加标签弹窗 */}
      <Modal
        title="添加标签"
        open={tagModalOpen}
        onOk={handleAddTags}
        onCancel={() => {
          setTagModalOpen(false);
          setCurrentAlbum(null);
          tagForm.resetFields();
        }}
        okText="添加"
        cancelText="取消"
      >
        <Form form={tagForm} layout="vertical">
          <Form.Item
            name="tags"
            label="标签"
            rules={[
              { required: true, message: '请输入标签' },
            ]}
          >
            <Input.TextArea 
              placeholder="请输入标签，多个标签用逗号分隔" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AlbumListPage;
