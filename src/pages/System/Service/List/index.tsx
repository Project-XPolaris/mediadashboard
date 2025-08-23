import React, {useEffect, useState} from 'react';
import {PageContainer, ProColumns, ProTable} from '@ant-design/pro-components';
import {Card, Tag, Typography} from 'antd';
import {history} from '@umijs/max';
import {getProxyList} from '@/services/ant-design-pro/api';

const ServiceListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.ProxyItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProxyList();
      if (res?.success) {
        setData(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ProColumns<API.ProxyItem>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix',
      key: 'prefix',
      width: 220,
      render: (_, rec) => <Typography.Text code>{rec.prefix}</Typography.Text>,
    },
    {
      title: 'Target / Discovery',
      dataIndex: 'target',
      key: 'target',
      render: (_, rec) => {
        if (rec.useNacos) {
          return (
            <>
              <Tag color="blue">Nacos</Tag>
              <Typography.Text>
                {rec.scheme || 'http'}://{rec.serviceName}
                {rec.group ? `@${rec.group}` : ''}
              </Typography.Text>
            </>
          );
        }
        return <Typography.Text>{rec.target || '-'}</Typography.Text>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, rec) => [
        <a key="view" onClick={() => history.push(`/system/service/${rec.name}`)}>查看</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<API.ProxyItem>
          rowKey={(r) => `${r.prefix}-${r.name}`}
          columns={columns}
          dataSource={data}
          loading={loading}
          search={false}
          pagination={false}
        />
      </Card>
    </PageContainer>
  );
};

export default ServiceListPage;


