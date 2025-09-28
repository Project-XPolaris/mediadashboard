import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Image, 
  Typography, 
  Space,
  Spin,
  message,
  Empty
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAlbumDetail, Album } from '@/services/youphoto/album';

const { Title, Text } = Typography;

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAlbumDetail(parseInt(id));
    }
  }, [id]);

  const loadAlbumDetail = async (albumId: number) => {
    setLoading(true);
    try {
      const response = await getAlbumDetail(albumId);
      if (response.success && response.data) {
        setAlbum(response.data);
      }
    } catch (error) {
      message.error('获取相册详情失败');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    history.push('/youphoto/album/list');
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!album) {
    return (
      <PageContainer>
        <Empty description="相册不存在" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: album.name,
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
          >
            返回列表
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
          >
            编辑相册
          </Button>,
        ],
      }}
    >
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">相册名称：</Text>
                <Title level={4} style={{ margin: 0 }}>{album.name}</Title>
              </div>
              <div>
                <Text type="secondary">创建时间：</Text>
                <Text>{new Date(album.createdAt).toLocaleString()}</Text>
              </div>
              <div>
                <Text type="secondary">最后更新：</Text>
                <Text>{new Date(album.updatedAt).toLocaleString()}</Text>
              </div>
              {album.imageCount !== undefined && (
                <div>
                  <Text type="secondary">图片数量：</Text>
                  <Text>{album.imageCount} 张</Text>
                </div>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Card 
        title="相册图片" 
        style={{ marginTop: 16 }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
          >
            添加图片
          </Button>
        }
      >
        <Empty description="暂无图片，点击上方按钮添加图片" />
      </Card>
    </PageContainer>
  );
};

export default AlbumDetailPage;
