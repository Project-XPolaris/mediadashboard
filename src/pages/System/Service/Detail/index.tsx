import React, {useEffect, useState} from 'react';
import {PageContainer, ProDescriptions} from '@ant-design/pro-components';
import {Card, Tag, Typography} from 'antd';
import {getProxyDetail} from '@/services/ant-design-pro/api';
import {useParams} from '@umijs/max';

const ServiceDetailPage: React.FC = () => {
  const {name} = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.ProxyItem | undefined>();

  const fetchData = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await getProxyDetail(String(name));
      if (res?.success) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);

  return (
    <PageContainer title={name as string}>
      <Card loading={loading}>
        <ProDescriptions<API.ProxyItem>
          column={1}
          dataSource={data}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Prefix',
              dataIndex: 'prefix',
              render: (_, rec) => <Typography.Text code>{rec?.prefix}</Typography.Text>,
            },
            {
              title: 'Target',
              dataIndex: 'target',
              render: (_, rec) => <Typography.Text>{rec?.target || '-'}</Typography.Text>,
            },
            {
              title: 'Use Nacos',
              dataIndex: 'useNacos',
              render: (_, rec) => rec?.useNacos ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>,
            },
            {
              title: 'Service Name',
              dataIndex: 'serviceName',
              render: (_, rec) => rec?.serviceName || '-',
            },
            {
              title: 'Group',
              dataIndex: 'group',
              render: (_, rec) => rec?.group || '-',
            },
            {
              title: 'Scheme',
              dataIndex: 'scheme',
              render: (_, rec) => rec?.scheme || '-',
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default ServiceDetailPage;


