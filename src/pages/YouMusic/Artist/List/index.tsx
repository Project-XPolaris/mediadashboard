import React, { useRef, useState } from 'react';
import { history } from '@umijs/max';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Upload, Avatar, Space, Tag, Input } from 'antd';
import { EditOutlined, UserOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchArtistList, updateArtist, updateArtistAvatar } from '@/services/youmusic/artist';
import styles from './styles.less';

interface ArtistItem extends YouMusicAPI.Artist {
  avatar?: string;
}

interface EditArtistForm {
  name: string;
}

const ArtistList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  
  // 编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistItem | null>(null);
  const [editForm] = Form.useForm<EditArtistForm>();
  
  // 头像上传相关状态
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ProTable数据请求函数
  const requestData = async (params: any) => {
    try {
      const response = await fetchArtistList({
        page: params.current || 1,
        pageSize: params.pageSize || 20,
        search: params.name || '',
      });
      
      if (response?.data) {
        // 处理头像URL
        const processedData = response.data.map(artist => ({
          ...artist,
          avatar: artist.avatar ? `/api/music/cover/${artist.avatar}` : undefined,
        }));
        
        return {
          data: processedData,
          success: true,
          total: response.count,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    } catch (error) {
      message.error('加载艺术家列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleEdit = (artist: ArtistItem) => {
    setEditingArtist(artist);
    editForm.setFieldsValue({ name: artist.name });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingArtist) {
        await updateArtist(editingArtist.id, values);
        message.success('艺术家信息更新成功');
        setEditModalVisible(false);
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleAvatarUpload = (artist: ArtistItem) => {
    setEditingArtist(artist);
    setAvatarModalVisible(true);
  };

  const handleAvatarUploadSubmit = async (file: File) => {
    if (!editingArtist) return;
    
    setUploadingAvatar(true);
    try {
      await updateArtistAvatar(editingArtist.id, file);
      message.success('头像上传成功');
      setAvatarModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('头像上传失败');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const columns: ProColumns<ArtistItem>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      search: false,
      render: (_, record) => (
        <Avatar
          size={48}
          src={record.avatar}
          icon={!record.avatar ? <UserOutlined /> : undefined}
          className={styles.artistAvatar}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      search: false,
      sorter: true,
    },
    {
      title: '艺术家名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      copyable: true,
      render: (text: string, record) => (
        <Button
          type="link"
          onClick={() => history.push(`/youmusic/artist/detail/${record.id}`)}
          style={{ padding: 0, height: 'auto' }}
        >
          <Tag color="blue" style={{ margin: 0, cursor: 'pointer' }}>
            {text}
          </Tag>
        </Button>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      search: false,
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      search: false,
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true, // 默认隐藏，可通过列设置显示
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      search: false,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<UploadOutlined />}
            onClick={() => handleAvatarUpload(record)}
          >
            头像
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '艺术家管理',
        subTitle: '管理音乐艺术家信息和头像',
      }}
    >
      <ProTable<ArtistItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
          reload: true,
          density: true,
          fullScreen: true,
        }}
        scroll={{ x: 800 }}
        size="middle"
        cardBordered
        headerTitle="艺术家列表"
        toolBarRender={() => [
          <Button
            key="refresh"
            onClick={() => actionRef.current?.reload()}
          >
            刷新
          </Button>,
        ]}
      />

      {/* 编辑艺术家模态框 */}
      <Modal
        title="编辑艺术家"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="艺术家名称"
            rules={[{ required: true, message: '请输入艺术家名称' }]}
          >
            <Input placeholder="请输入艺术家名称" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 头像上传模态框 */}
      <Modal
        title="上传艺术家头像"
        open={avatarModalVisible}
        onCancel={() => setAvatarModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div className={styles.avatarUpload}>
          <div className={styles.currentAvatar}>
            <Avatar
              size={120}
              src={editingArtist?.avatar ? `/api/music/cover/${editingArtist.avatar}` : undefined}
              icon={!editingArtist?.avatar ? <UserOutlined /> : undefined}
            />
            <p>当前头像</p>
          </div>
          
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarUploadSubmit(file);
              return false;
            }}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploadingAvatar}
              size="large"
            >
              选择新头像
            </Button>
          </Upload>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ArtistList;
