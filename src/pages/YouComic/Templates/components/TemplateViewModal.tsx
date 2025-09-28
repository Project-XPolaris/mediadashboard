import { CopyOutlined } from '@ant-design/icons';
import { Button, Descriptions, message, Modal, Tag, Typography } from 'antd';
import React from 'react';
import type { Template, TemplateType } from '@/services/youcomic/template';

const { Text, Paragraph } = Typography;

interface TemplateViewModalProps {
  open: boolean;
  template: Template | null;
  templateTypes: TemplateType[];
  onCancel: () => void;
}

const TemplateViewModal: React.FC<TemplateViewModalProps> = ({
  open,
  template,
  templateTypes,
  onCancel,
}) => {
  if (!template) return null;

  // 获取类型信息
  const typeInfo = templateTypes.find(t => t.value === template.type);

  // 复制内容到剪贴板
  const handleCopyContent = () => {
    navigator.clipboard.writeText(template.content).then(() => {
      message.success('模板内容已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  return (
    <Modal
      title="查看模板"
      open={open}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyContent}>
          复制内容
        </Button>,
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="模板名称" span={2}>
          <Text strong>{template.name}</Text>
          {template.is_default && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              系统默认
            </Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="模板类型">
          <Tag color="geekblue">{typeInfo?.label || template.type}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="版本号">
          {template.version || '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label="创建时间">
          {new Date(template.CreatedAt).toLocaleString()}
        </Descriptions.Item>
        
        <Descriptions.Item label="更新时间">
          {new Date(template.UpdatedAt).toLocaleString()}
        </Descriptions.Item>
        
        <Descriptions.Item label="最后使用时间" span={2}>
          {template.last_used_at ? new Date(template.last_used_at).toLocaleString() : '未使用'}
        </Descriptions.Item>
        
        {template.description && (
          <Descriptions.Item label="模板描述" span={2}>
            <Text>{template.description}</Text>
          </Descriptions.Item>
        )}
        
        {typeInfo?.description && (
          <Descriptions.Item label="类型说明" span={2}>
            <Text type="secondary">{typeInfo.description}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
      
      <div style={{ marginTop: 16 }}>
        <Text strong>模板内容：</Text>
        <div style={{ marginTop: 8 }}>
          <Paragraph
            code
            copyable={{
              text: template.content,
              tooltips: ['复制内容', '已复制'],
            }}
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 6,
              maxHeight: 400,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {template.content}
          </Paragraph>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateViewModal;
