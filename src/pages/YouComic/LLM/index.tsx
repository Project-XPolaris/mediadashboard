import React, { useEffect, useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  message,
  notification,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  getLLMConfig,
  getLLMStatus,
  reloadLLMConfig,
  saveLLMConfig,
  testLLMConnection,
  updateLLMConfig,
  type LLMConfig,
  type LLMStatus,
  type UpdateLLMConfigRequest,
} from '@/services/youcomic/llm';

const { Text } = Typography;

const LLMConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<LLMConfig | null>(null);
  const [status, setStatus] = useState<LLMStatus | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [formRef] = ProForm.useForm();
  


  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [configRes, statusRes] = await Promise.all([
        getLLMConfig(),
        getLLMStatus(),
      ]);
      
      if (configRes) {
        setConfig(configRes);
        
        // 准备表单值
        const formValues = {
          enable: configRes.enable,
          default: configRes.default,
          openai: {
            enable: configRes.openai?.enable || false,
            model: configRes.openai?.model || 'gpt-3.5-turbo',
            base_url: configRes.openai?.base_url || 'https://api.openai.com/v1',
          },
          ollama: {
            enable: configRes.ollama?.enable || false,
            base_url: configRes.ollama?.base_url || 'http://localhost:11434',
            model: configRes.ollama?.model || 'llama2',
          },
          gemini: {
            enable: configRes.gemini?.enable || false,
            model: configRes.gemini?.model || 'gemini-pro',
            location: configRes.gemini?.location || '',
            project: configRes.gemini?.project || '',
          },
        };
        
        // 设置表单值
        formRef.setFieldsValue(formValues);
      }
      
      if (statusRes) {
        setStatus(statusRes);
      }
    } catch (error) {
      console.error('Failed to load LLM config:', error);
      message.error('加载LLM配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 保存配置
  const handleSave = async (values: any, persist = false) => {
    try {
      const updateData: UpdateLLMConfigRequest = {
        enable: values.enable,
        default: values.default,
        persist,
      };

      // 处理OpenAI配置
      if (values.openai) {
        updateData.openai = {
          enable: values.openai.enable || false,
          model: values.openai.model || 'gpt-3.5-turbo',
          base_url: values.openai.base_url || 'https://api.openai.com/v1',
          api_key: values.openai.api_key || undefined,
        };
      }

      // 处理Ollama配置
      if (values.ollama) {
        updateData.ollama = {
          enable: values.ollama.enable || false,
          base_url: values.ollama.base_url || 'http://localhost:11434',
          model: values.ollama.model || 'llama2',
        };
      }

      // 处理Gemini配置
      if (values.gemini) {
        updateData.gemini = {
          enable: values.gemini.enable || false,
          model: values.gemini.model || 'gemini-pro',
          location: values.gemini.location || undefined,
          project: values.gemini.project || undefined,
          api_key: values.gemini.api_key || undefined,
        };
      }



      await updateLLMConfig(updateData);
      message.success(persist ? '配置更新并保存成功' : '配置更新成功');
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('Failed to update LLM config:', error);
      message.error('配置更新失败');
    }
  };

  // 重新加载配置
  const handleReload = async () => {
    try {
      await reloadLLMConfig();
      message.success('配置重新加载成功');
      loadData();
    } catch (error) {
      console.error('Failed to reload LLM config:', error);
      message.error('配置重新加载失败');
    }
  };

  // 保存到文件
  const handleSaveToFile = async () => {
    try {
      await saveLLMConfig();
      message.success('配置已保存到文件');
    } catch (error: any) {
      console.error('Failed to save LLM config to file:', error);
      
      // 显示详细错误信息
      let errorMessage = '保存配置文件失败';
      if (error?.response?.data?.error) {
        errorMessage = `保存失败: ${error.response.data.error}`;
      } else if (error?.message) {
        errorMessage = `保存失败: ${error.message}`;
      }
      
      notification.error({
        message: '配置保存失败',
        description: errorMessage,
        duration: 8,
      });
    }
  };

  // 测试连接
  const handleTest = async (provider?: string) => {
    setTestLoading(true);
    try {
      const result = await testLLMConnection({
        provider,
        prompt: 'Hello, this is a test message. Please respond with "Test successful".',
      });
      
      if (result.success) {
        notification.success({
          message: '连接测试成功',
          description: `提供商: ${provider || 'default'}\n响应长度: ${result.response_length} 字符`,
          duration: 5,
        });
      } else {
        notification.error({
          message: '连接测试失败',
          description: result.error || '未知错误',
          duration: 5,
        });
      }
    } catch (error) {
      console.error('Failed to test LLM connection:', error);
      notification.error({
        message: '连接测试失败',
        description: '网络错误或服务不可用',
        duration: 5,
      });
    } finally {
      setTestLoading(false);
    }
  };

  // 获取提供商状态标签
  const getProviderStatusTag = (providerName: string) => {
    const isAvailable = status?.providers.includes(providerName);
    const isDefault = status?.default === providerName;
    
    return (
      <Space>
        {isAvailable ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            可用
          </Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            不可用
          </Tag>
        )}
        {isDefault && (
          <Tag color="blue">默认</Tag>
        )}
      </Space>
    );
  };

  return (
    <PageContainer
      title="LLM配置管理"
      subTitle="配置和管理大语言模型服务"
      extra={[
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          onClick={handleReload}
          loading={loading}
        >
          重新加载
        </Button>,
        <Button
          key="saveFile"
          icon={<SaveOutlined />}
          onClick={handleSaveToFile}
          loading={loading}
        >
          保存到文件
        </Button>,
        <Button
          key="test"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => handleTest()}
          loading={testLoading}
          disabled={!status?.available}
        >
          测试连接
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {/* 状态概览 */}
        <ProCard title="状态概览" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {status?.available ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        可用
                      </Tag>
                    ) : (
                      <Tag color="red" icon={<CloseCircleOutlined />}>
                        不可用
                      </Tag>
                    )}
                  </div>
                  <div>插件状态</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {status?.providers.length || 0}
                  </div>
                  <div>可用提供商</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {status?.default || '无'}
                  </div>
                  <div>默认提供商</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {config?.enable ? '启用' : '禁用'}
                  </div>
                  <div>插件状态</div>
                </div>
              </Card>
            </Col>
          </Row>
        </ProCard>

        {/* 配置表单 */}
        <ProCard title="配置设置">
          <ProForm
            form={formRef}
            layout="vertical"
            onFinish={(values) => handleSave(values, false)}
            submitter={{
              render: (_, doms) => (
                <Space>
                  <Button type="primary" onClick={() => formRef.submit()}>
                    更新配置
                  </Button>
                  <Button
                    onClick={() => {
                      formRef.validateFields().then((values) => {
                        handleSave(values, true);
                      });
                    }}
                  >
                    更新并保存到文件
                  </Button>
                  <Button onClick={() => formRef.resetFields()}>
                    重置
                  </Button>
                </Space>
              ),
            }}
          >
                         <Tabs
               defaultActiveKey="basic"
               type="card"
               items={[
                 {
                   key: 'basic',
                   label: (
                     <span>
                       <SettingOutlined />
                       基本设置
                     </span>
                   ),
                   children: (
                     <Row gutter={16}>
                       <Col span={12}>
                         <ProFormSwitch
                           name="enable"
                           label="启用LLM插件"
                           checkedChildren="启用"
                           unCheckedChildren="禁用"
                         />
                       </Col>
                       <Col span={12}>
                         <ProFormSelect
                           name="default"
                           label="默认提供商"
                           options={[
                             { label: 'OpenAI', value: 'openai' },
                             { label: 'Ollama', value: 'ollama' },
                             { label: 'Gemini', value: 'gemini' },
                           ]}
                           placeholder="选择默认的LLM提供商"
                         />
                       </Col>
                     </Row>
                   ),
                 },
                 {
                   key: 'providers',
                   label: (
                     <span>
                       <PlayCircleOutlined />
                       LLM提供商
                     </span>
                   ),
                   children: (
                     <div>
                       {/* OpenAI配置 */}
                       <ProCard
                         title={
                           <Space>
                             <span>OpenAI配置</span>
                             {getProviderStatusTag('openai')}
                           </Space>
                         }
                         bordered
                         style={{ marginBottom: 16 }}
                         extra={
                           <Button
                             size="small"
                             onClick={() => handleTest('openai')}
                             loading={testLoading}
                             disabled={!status?.providers.includes('openai')}
                             type="primary"
                             icon={<PlayCircleOutlined />}
                           >
                             测试连接
                           </Button>
                         }
                       >
                         <Row gutter={16}>
                           <Col span={12}>
                             <ProFormSwitch
                               name={['openai', 'enable']}
                               label="启用OpenAI"
                               checkedChildren="启用"
                               unCheckedChildren="禁用"
                             />
                           </Col>
                           <Col span={12}>
                             <ProFormText
                               name={['openai', 'model']}
                               label="模型"
                               placeholder="gpt-3.5-turbo"
                             />
                           </Col>
                           <Col span={24}>
                             <ProFormText
                               name={['openai', 'base_url']}
                               label="API Base URL"
                               placeholder="https://api.openai.com/v1"
                             />
                           </Col>
                           <Col span={24}>
                             <ProFormText.Password
                               name={['openai', 'api_key']}
                               label="API Key"
                               placeholder={config?.openai?.has_key ? '••••••••(已设置)' : '输入API Key'}
                             />
                             {config?.openai?.has_key && (
                               <Text type="secondary">当前已配置API Key，留空则保持不变</Text>
                             )}
                           </Col>
                         </Row>
                       </ProCard>

                       {/* Ollama配置 */}
                       <ProCard
                         title={
                           <Space>
                             <span>Ollama配置</span>
                             {getProviderStatusTag('ollama')}
                           </Space>
                         }
                         bordered
                         style={{ marginBottom: 16 }}
                         extra={
                           <Button
                             size="small"
                             onClick={() => handleTest('ollama')}
                             loading={testLoading}
                             disabled={!status?.providers.includes('ollama')}
                             type="primary"
                             icon={<PlayCircleOutlined />}
                           >
                             测试连接
                           </Button>
                         }
                       >
                         <Row gutter={16}>
                           <Col span={12}>
                             <ProFormSwitch
                               name={['ollama', 'enable']}
                               label="启用Ollama"
                               checkedChildren="启用"
                               unCheckedChildren="禁用"
                             />
                           </Col>
                           <Col span={12}>
                             <ProFormText
                               name={['ollama', 'model']}
                               label="模型"
                               placeholder="llama2"
                             />
                           </Col>
                           <Col span={24}>
                             <ProFormText
                               name={['ollama', 'base_url']}
                               label="服务地址"
                               placeholder="http://localhost:11434"
                             />
                           </Col>
                         </Row>
                       </ProCard>

                       {/* Gemini配置 */}
                       <ProCard
                         title={
                           <Space>
                             <span>Gemini配置</span>
                             {getProviderStatusTag('gemini')}
                           </Space>
                         }
                         bordered
                         style={{ marginBottom: 16 }}
                         extra={
                           <Button
                             size="small"
                             onClick={() => handleTest('gemini')}
                             loading={testLoading}
                             disabled={!status?.providers.includes('gemini')}
                             type="primary"
                             icon={<PlayCircleOutlined />}
                           >
                             测试连接
                           </Button>
                         }
                       >
                         <Row gutter={16}>
                           <Col span={12}>
                             <ProFormSwitch
                               name={['gemini', 'enable']}
                               label="启用Gemini"
                               checkedChildren="启用"
                               unCheckedChildren="禁用"
                             />
                           </Col>
                           <Col span={12}>
                             <ProFormText
                               name={['gemini', 'model']}
                               label="模型"
                               placeholder="gemini-pro"
                             />
                           </Col>
                           <Col span={12}>
                             <ProFormText
                               name={['gemini', 'location']}
                               label="位置 (Vertex AI)"
                               placeholder="us-central1"
                             />
                           </Col>
                           <Col span={12}>
                             <ProFormText
                               name={['gemini', 'project']}
                               label="项目ID (Vertex AI)"
                               placeholder="your-project-id"
                             />
                           </Col>
                           <Col span={24}>
                             <ProFormText.Password
                               name={['gemini', 'api_key']}
                               label="API Key"
                               placeholder={config?.gemini?.has_key ? '••••••••(已设置)' : '输入API Key'}
                             />
                             {config?.gemini?.has_key && (
                               <Text type="secondary">当前已配置API Key，留空则保持不变</Text>
                             )}
                           </Col>
                         </Row>
                       </ProCard>
                     </div>
                   ),
                 },
               ]}
            />
          </ProForm>
        </ProCard>
      </Spin>


    </PageContainer>
  );
};

export default LLMConfigPage;
