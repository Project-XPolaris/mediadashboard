import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import {
  deleteTemplate,
  getTemplateList,
  getTemplateTypes,
  type Template,
  type TemplateType,
} from '@/services/youcomic/template';
import TemplateFormModal from '../components/TemplateFormModal';
import TemplateViewModal from '../components/TemplateViewModal';

const { Text } = Typography;

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // 模态框状态
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);

  // 加载模板类型
  const loadTemplateTypes = async () => {
    try {
      const response = await getTemplateTypes();
      if (response.success) {
        setTemplateTypes(response.data);
      }
    } catch (error) {
      console.error('加载模板类型失败:', error);
    }
  };

  // 加载模板列表
  const loadTemplates = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const response = await getTemplateList({
        type: selectedType || undefined,
        page: currentPage,
        pageSize: currentPageSize,
      });
      
      if (response.success) {
        setTemplates(response.data.templates);
        setTotal(response.data.total);
        setPage(response.data.page);
        setPageSize(response.data.pageSize);
      }
    } catch (error) {
      message.error('加载模板列表失败');
      console.error('加载模板列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    loadTemplateTypes();
    loadTemplates();
  }, [selectedType]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    // 这里可以添加搜索逻辑，目前先简单过滤
    if (value) {
      const filtered = templates.filter(template => 
        template.name.toLowerCase().includes(value.toLowerCase()) ||
        template.description?.toLowerCase().includes(value.toLowerCase())
      );
      setTemplates(filtered);
    } else {
      loadTemplates();
    }
  };

  // 处理删除
  const handleDelete = (template: Template) => {
    if (template.is_default) {
      message.warning('不能删除系统默认模板');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模板 "${template.name}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteTemplate(template.ID);
          if (response.success) {
            message.success('模板删除成功');
            loadTemplates();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除模板失败');
          console.error('删除模板失败:', error);
        }
      },
    });
  };

  // 处理编辑
  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormModalOpen(true);
  };

  // 处理查看
  const handleView = (template: Template) => {
    setViewingTemplate(template);
    setViewModalOpen(true);
  };

  // 处理创建
  const handleCreate = () => {
    setEditingTemplate(null);
    setFormModalOpen(true);
  };

  // 表格列定义
  const columns: ColumnsType<Template> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.is_default && (
            <Tag color="blue" size="small">
              系统默认
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => {
        const typeInfo = templateTypes.find(t => t.value === type);
        return (
          <Tooltip title={typeInfo?.description}>
            <Tag color="geekblue">{typeInfo?.label || type}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (text) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      width: 180,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '最后使用',
      dataIndex: 'last_used_at',
      key: 'last_used_at',
      width: 180,
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {!record.is_default && (
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '模板管理',
        subTitle: '管理LLM提示模板，用于标签分析等功能',
        extra: [
          <Input.Search
            key="search"
            placeholder="搜索模板名称或描述"
            style={{ width: 250 }}
            onSearch={handleSearch}
            allowClear
          />,
          <Select
            key="type-filter"
            placeholder="筛选类型"
            style={{ width: 180 }}
            allowClear
            value={selectedType || undefined}
            onChange={setSelectedType}
          >
            {templateTypes.map(type => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建模板
          </Button>,
        ],
      }}
    >
      <Card>
        <Table
          dataSource={templates}
          columns={columns}
          loading={loading}
          rowKey="ID"
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize || pageSize);
              loadTemplates(newPage, newPageSize || pageSize);
            },
          }}
        />
      </Card>

      {/* 创建/编辑模板弹窗 */}
      <TemplateFormModal
        open={formModalOpen}
        template={editingTemplate}
        templateTypes={templateTypes}
        onCancel={() => {
          setFormModalOpen(false);
          setEditingTemplate(null);
        }}
        onSuccess={() => {
          setFormModalOpen(false);
          setEditingTemplate(null);
          loadTemplates();
        }}
      />

      {/* 查看模板弹窗 */}
      <TemplateViewModal
        open={viewModalOpen}
        template={viewingTemplate}
        templateTypes={templateTypes}
        onCancel={() => {
          setViewModalOpen(false);
          setViewingTemplate(null);
        }}
      />
    </PageContainer>
  );
};

export default TemplateList;
