import {useModel, useSearchParams} from "@@/exports";
import {ModalForm, PageContainer, ProColumns, ProFormText, ProFormTextArea, ProTable} from "@ant-design/pro-components";
import {Button, Card, Col, Descriptions, Divider, Row, Space, Tag, Typography, message} from "antd";
import {useEffect, useState} from "react";
import {updateEntity} from "@/services/youvideo/entity";
import {history} from "@umijs/max";

const EntityDetailPage = () => {
  const [searchParams] = useSearchParams();
  const model = useModel("YouVideo.entityDetail")
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const id = Number(searchParams.get("id"))
    if (id) {
      model.loadData({id})
    }
  }, [])

  const entity = model.entity

  const fileColumns: ProColumns<YouVideoAPI.Video>[] = [
    {title: 'ID', dataIndex: 'id', width: 80},
    {
      title: 'Name', dataIndex: 'name', render: (_, record) => (
        <a onClick={() => history.push(`/youvideo/video/detail?id=${record.id}`)}>{record.name}</a>
      )
    },
    {title: 'Type', dataIndex: 'type', width: 100},
    {
      title: 'Files', dataIndex: 'files', width: 120, render: (_, record) => {
        return record.files?.length || 0
      }
    },
  ]

  return (
    <PageContainer title={model.getEntityName()} extra={
      <Button type={"primary"} onClick={() => setEditOpen(true)}>编辑</Button>
    }>
      <ModalForm
        title={"编辑实体"}
        open={editOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setEditOpen(false),
        }}
        initialValues={{
          name: entity?.name,
          summary: entity?.summary,
          coverUrl: undefined,
          template: entity?.template,
        }}
        onFinish={async (values) => {
          if (!entity) return false
          const payload: any = {}
          if (values.name !== undefined && values.name !== entity.name) payload.name = values.name
          if (values.summary !== undefined && values.summary !== entity.summary) payload.summary = values.summary
          if (values.coverUrl) payload.coverUrl = values.coverUrl
          if (values.template !== undefined && values.template !== entity.template) payload.template = values.template
          if (Object.keys(payload).length === 0) {
            message.info("没有修改项")
            return true
          }
          const resp = await updateEntity(entity.id, payload)
          if (!resp.success) {
            message.error(resp.err)
            return false
          }
          message.success("已保存")
          await model.loadData({id: entity.id})
          setEditOpen(false)
          return true
        }}
      >
        <ProFormText name="name" label="名称" placeholder="输入名称"/>
        <ProFormTextArea name="summary" label="简介" placeholder="输入简介"/>
        <ProFormText name="coverUrl" label="封面URL" placeholder="输入图片 URL（可选）"/>
        <ProFormText name="template" label="模板" placeholder="输入模板（可选）"/>
      </ModalForm>
      <Row gutter={8}>
        <Col span={6}>
          <Card title={"封面"} size={"small"}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              {entity?.cover ? (
                <img src={entity.cover} style={{maxWidth: '100%'}}/>
              ) : (
                <Typography.Text type="secondary">暂无封面</Typography.Text>
              )}
            </div>
            {entity?.coverWidth && entity?.coverHeight && (
              <div style={{marginTop: 8}}>
                <Typography.Text type="secondary">{entity.coverWidth} x {entity.coverHeight}</Typography.Text>
              </div>
            )}
          </Card>
        </Col>
        <Col span={18}>
          <Card title={"基础信息"} size={"small"}>
            <Descriptions column={2}>
              <Descriptions.Item label="ID">{entity?.id}</Descriptions.Item>
              <Descriptions.Item label="名称">{entity?.name}</Descriptions.Item>
              <Descriptions.Item label="模板">{entity?.template ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="发布">
                {entity?.release ?? '-'}
              </Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Typography.Paragraph>
              <Typography.Text type="secondary">简介</Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph>{entity?.summary || '-'}</Typography.Paragraph>
            <Divider/>
            <Typography.Paragraph>
              <Typography.Text type="secondary">标签</Typography.Text>
            </Typography.Paragraph>
            <Space wrap>
              {entity?.tags?.map((t) => (
                <Tag key={`${t.name}-${t.value}`}>{t.name}:{t.value}</Tag>
              ))}
              {!entity?.tags?.length && <Typography.Text type="secondary">无</Typography.Text>}
            </Space>
            <Divider/>
            <Typography.Paragraph>
              <Typography.Text type="secondary">信息</Typography.Text>
            </Typography.Paragraph>
            <Space direction={'vertical'} style={{width: '100%'}}>
              {entity?.infos?.map((info) => (
                <Space key={info.id}>
                  <Typography.Text strong>{info.key}</Typography.Text>
                  <Typography.Text type="secondary">{info.value}</Typography.Text>
                </Space>
              ))}
              {!entity?.infos?.length && <Typography.Text type="secondary">无</Typography.Text>}
            </Space>
          </Card>
        </Col>
      </Row>
      <Row style={{marginTop: 8}}>
        <Col span={24}>
          <Card title={"视频列表"} size={"small"}>
            <ProTable<YouVideoAPI.Video>
              search={false}
              toolBarRender={false}
              dataSource={entity?.videos || []}
              rowKey={(it) => it.id}
              columns={fileColumns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
};
export default EntityDetailPage
