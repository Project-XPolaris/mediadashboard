import React, { useEffect, useState } from 'react';
import { useParams, history } from '@umijs/max';
import { PageContainer, ProCard, ProDescriptions, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { 
  Avatar, 
  Button, 
  Space, 
  Statistic, 
  Tag, 
  message, 
  Modal, 
  Form, 
  Input, 
  Upload,
  Tabs,
  Row,
  Col,
  Card
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  UserOutlined, 
  UploadOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  SoundOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { fetchArtistDetailWithStats, updateArtist, updateArtistAvatar } from '@/services/youmusic/artist';
import { fetchMusicList } from '@/services/youmusic/music';
import { fetchAlbumList } from '@/services/youmusic/album';
import styles from './styles.less';

interface ArtistDetailData extends YouMusicAPI.Artist {
  avatar?: string;
  musicCount?: number;
  albumCount?: number;
}

interface MusicItem extends YouMusicAPI.Music {
  key?: string;
}

interface AlbumItem extends YouMusicAPI.Album {
  key?: string;
}

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artistData, setArtistData] = useState<ArtistDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  
  // 头像上传相关状态
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 加载艺术家详情数据
  const loadArtistDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetchArtistDetailWithStats(Number(id));
      if (response) {
        const token = localStorage.getItem("token");
        const processedData = {
          ...response,
          avatar: response.avatar ? 
            (token ? `/api/music/cover/${response.avatar}?token=${token}` : `/api/music/cover/${response.avatar}`) 
            : undefined,
        };
        setArtistData(processedData);
      }
    } catch (error) {
      message.error('加载艺术家详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载相关音乐数据
  const loadRelatedMusic = async (params: any) => {
    if (!id) return { data: [], success: false, total: 0 };
    
    try {
      const response = await fetchMusicList({
        page: params.current || 1,
        pageSize: params.pageSize || 20,
        artistSearch: artistData?.name || '',
        withTag: "1",
      });
      
      if (response?.data) {
        const token = localStorage.getItem("token");
        const processedData = response.data.map((music, index) => ({
          ...music,
          album: music.album ? {
            ...music.album,
            cover: music.album.cover ? (token ? `/api/music${music.album.cover}?token=${token}` : `/api/music${music.album.cover}`) : undefined,
          } : undefined,
          key: `music-${music.id}-${index}`,
        }));
        
        return {
          data: processedData,
          success: true,
          total: response.count,
        };
      }
      return { data: [], success: false, total: 0 };
    } catch (error) {
      message.error('加载相关音乐失败');
      return { data: [], success: false, total: 0 };
    }
  };

  // 加载相关专辑数据
  const loadRelatedAlbums = async (params: any) => {
    if (!id) return { data: [], success: false, total: 0 };
    
    try {
      const response = await fetchAlbumList({
        page: params.current || 1,
        pageSize: params.pageSize || 20,
        search: artistData?.name || '',
      });
      
      if (response?.data) {
        const token = localStorage.getItem("token");
        const processedData = response.data.map((album, index) => ({
          ...album,
          cover: album.cover ? (token ? `/api/music${album.cover}?token=${token}` : `/api/music${album.cover}`) : undefined,
          key: `album-${album.id}-${index}`,
        }));
        
        return {
          data: processedData,
          success: true,
          total: response.count,
        };
      }
      return { data: [], success: false, total: 0 };
    } catch (error) {
      message.error('加载相关专辑失败');
      return { data: [], success: false, total: 0 };
    }
  };

  useEffect(() => {
    loadArtistDetail();
  }, [id]);

  // 编辑艺术家
  const handleEdit = () => {
    if (artistData) {
      editForm.setFieldsValue({ name: artistData.name });
      setEditModalVisible(true);
    }
  };

  const handleEditSubmit = async () => {
    if (!artistData) return;
    
    try {
      const values = await editForm.validateFields();
      await updateArtist(artistData.id, values);
      message.success('艺术家信息更新成功');
      setEditModalVisible(false);
      loadArtistDetail();
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 头像上传
  const handleAvatarUpload = () => {
    setAvatarModalVisible(true);
  };

  const handleAvatarUploadSubmit = async (file: File) => {
    if (!artistData) return;
    
    setUploadingAvatar(true);
    try {
      await updateArtistAvatar(artistData.id, file);
      message.success('头像上传成功');
      setAvatarModalVisible(false);
      loadArtistDetail();
    } catch (error) {
      message.error('头像上传失败');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 音乐列表列配置
  const musicColumns: ProColumns<MusicItem>[] = [
    {
      title: '封面',
      dataIndex: ['album', 'cover'],
      width: 60,
      search: false,
      render: (_, record) => (
        <Avatar
          size={40}
          src={record.album?.cover}
          icon={<AppstoreOutlined />}
          shape="square"
        />
      ),
    },
    {
      title: '歌曲名称',
      dataIndex: 'title',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '专辑',
      dataIndex: ['album', 'name'],
      ellipsis: true,
      search: false,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 80,
      search: false,
      render: (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
    },
    {
      title: '比特率',
      dataIndex: 'bitrate',
      width: 80,
      search: false,
      render: (bitrate: number) => `${bitrate}kbps`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      search: false,
      valueType: 'dateTime',
    },
  ];

  // 专辑列表列配置
  const albumColumns: ProColumns<AlbumItem>[] = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 60,
      search: false,
      render: (cover: string) => (
        <Avatar
          size={40}
          src={cover}
          icon={<AppstoreOutlined />}
          shape="square"
        />
      ),
    },
    {
      title: '专辑名称',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '歌曲数量',
      dataIndex: 'music',
      width: 100,
      search: false,
      render: (music: any[]) => music?.length || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      search: false,
      valueType: 'dateTime',
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <ProCard loading={true} />
      </PageContainer>
    );
  }

  if (!artistData) {
    return (
      <PageContainer>
        <ProCard>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>艺术家不存在或已被删除</p>
            <Button onClick={() => history.back()}>返回</Button>
          </div>
        </ProCard>
      </PageContainer>
    );
  }

  const tabItems = [
    {
      key: 'music',
      label: (
        <span>
          <SoundOutlined />
          相关音乐
        </span>
      ),
      children: (
        <ProTable<MusicItem>
          columns={musicColumns}
          request={loadRelatedMusic}
          rowKey="key"
          search={false}
          options={{
            reload: true,
            density: true,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      ),
    },
    {
      key: 'albums',
      label: (
        <span>
          <AppstoreOutlined />
          相关专辑
        </span>
      ),
      children: (
        <ProTable<AlbumItem>
          columns={albumColumns}
          request={loadRelatedAlbums}
          rowKey="key"
          search={false}
          options={{
            reload: true,
            density: true,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '艺术家详情',
        breadcrumb: {
          items: [
            { title: 'YouMusic' },
            { title: '艺术家管理', path: '/youmusic/artist/list' },
            { title: '详情' },
          ],
        },
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
          >
            返回
          </Button>,
        ],
      }}
    >
      {/* 艺术家基本信息 */}
      <ProCard className={styles.artistHeader}>
        <Row gutter={24} align="middle">
          <Col flex="none">
            <div className={styles.avatarSection}>
              <Avatar
                size={120}
                src={artistData.avatar}
                icon={!artistData.avatar ? <UserOutlined /> : undefined}
                className={styles.artistAvatar}
              />
              <div className={styles.avatarActions}>
                <Button
                  type="primary"
                  size="small"
                  icon={<UploadOutlined />}
                  onClick={handleAvatarUpload}
                >
                  更换头像
                </Button>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={styles.artistInfo}>
              <div className={styles.artistName}>
                <h1>{artistData.name}</h1>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  编辑
                </Button>
              </div>
              <div className={styles.artistMeta}>
                <Tag icon={<CalendarOutlined />} color="blue">
                  创建于 {new Date(artistData.createdAt).toLocaleDateString()}
                </Tag>
                <Tag icon={<CalendarOutlined />} color="green">
                  更新于 {new Date(artistData.updatedAt).toLocaleDateString()}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
      </ProCard>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="音乐数量"
              value={artistData.musicCount || 0}
              prefix={<SoundOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="专辑数量"
              value={artistData.albumCount || 0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="艺术家ID"
              value={artistData.id}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <ProCard>
        <Tabs items={tabItems} />
      </ProCard>

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
              src={artistData.avatar}
              icon={!artistData.avatar ? <UserOutlined /> : undefined}
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

export default ArtistDetail;
