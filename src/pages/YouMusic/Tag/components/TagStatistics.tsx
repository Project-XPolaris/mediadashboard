import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
  TagOutlined,
  SoundOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

interface TagStatisticsProps {
  totalTags: number;
  totalMusic: number;
  mostUsedTag?: {
    name: string;
    count: number;
  };
  recentlyCreated: number;
}

const TagStatistics: React.FC<TagStatisticsProps> = ({
  totalTags,
  totalMusic,
  mostUsedTag,
  recentlyCreated,
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总标签数"
            value={totalTags}
            prefix={<TagOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="标记音乐数"
            value={totalMusic}
            prefix={<SoundOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="最热门标签"
            value={mostUsedTag?.count || 0}
            prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
            valueStyle={{ color: '#fa8c16' }}
            suffix={mostUsedTag ? `(${mostUsedTag.name})` : ''}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="本月新增"
            value={recentlyCreated}
            prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TagStatistics;
