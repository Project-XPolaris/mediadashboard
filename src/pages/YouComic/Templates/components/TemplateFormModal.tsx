import { Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import {
  createTemplate,
  updateTemplate,
  type CreateTemplateRequest,
  type Template,
  type TemplateType,
  type UpdateTemplateRequest,
} from '@/services/youcomic/template';

const { TextArea } = Input;

interface TemplateFormModalProps {
  open: boolean;
  template?: Template | null;
  templateTypes: TemplateType[];
  onCancel: () => void;
  onSuccess: () => void;
}

const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  open,
  template,
  templateTypes,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!template;

  // 当模态框打开时，设置表单初始值
  useEffect(() => {
    if (open) {
      if (template) {
        form.setFieldsValue({
          name: template.name,
          type: template.type,
          content: template.content,
          description: template.description,
          version: template.version,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, template, form]);

  // 处理提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit && template) {
        // 更新模板
        const updateData: UpdateTemplateRequest = {
          name: values.name,
          type: values.type,
          content: values.content,
          description: values.description,
          version: values.version,
        };
        
        const response = await updateTemplate(template.ID, updateData);
        if (response.success) {
          message.success('模板更新成功');
          onSuccess();
        } else {
          message.error('更新失败');
        }
      } else {
        // 创建模板
        const createData: CreateTemplateRequest = {
          name: values.name,
          type: values.type,
          content: values.content,
          description: values.description,
          version: values.version,
        };
        
        const response = await createTemplate(createData);
        if (response.success) {
          message.success('模板创建成功');
          onSuccess();
        } else {
          message.error('创建失败');
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败');
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? '编辑模板' : '创建模板'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      okText={isEdit ? '更新' : '创建'}
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          version: '1.0',
        }}
      >
        <Form.Item
          name="name"
          label="模板名称"
          rules={[
            { required: true, message: '请输入模板名称' },
            { min: 1, max: 100, message: '模板名称长度应在1-100个字符之间' },
          ]}
        >
          <Input placeholder="请输入模板名称" />
        </Form.Item>

        <Form.Item
          name="type"
          label="模板类型"
          rules={[{ required: true, message: '请选择模板类型' }]}
        >
          <Select placeholder="请选择模板类型">
            {templateTypes.map(type => (
              <Select.Option key={type.value} value={type.value}>
                <div>
                  <div>{type.label}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {type.description}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="模板内容"
          rules={[
            { required: true, message: '请输入模板内容' },
            { min: 10, message: '模板内容至少需要10个字符' },
          ]}
          extra="支持使用 %s 或 {{content}} 作为内容占位符"
        >
          <TextArea
            rows={12}
            placeholder="请输入模板内容，可以使用 %s 或 {{content}} 作为占位符"
            showCount
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="模板描述"
          rules={[{ max: 500, message: '描述长度不能超过500个字符' }]}
        >
          <TextArea
            rows={3}
            placeholder="请输入模板描述（可选）"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="version"
          label="版本号"
          rules={[{ max: 20, message: '版本号长度不能超过20个字符' }]}
        >
          <Input placeholder="请输入版本号（如：1.0）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateFormModal;
