import {useModel, useSearchParams} from "@@/exports";
import {ModalForm, PageContainer, ProColumns, ProFormDigit, ProFormText, ProFormTextArea, ProTable} from "@ant-design/pro-components";
import {Button, Card, Col, Descriptions, Divider, Row, Space, Typography, message} from "antd";
import {useEffect, useState} from "react";
import {updateVideo} from "@/services/youvideo/video";

const VideoDetailPage = () => {
  const [searchParams] = useSearchParams();
  const model = useModel("YouVideo.videoDetail")
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const id = Number(searchParams.get("id"))
    if (id) {
      model.loadData({id})
    }
  }, [])

  const video = model.video

  const fileColumns: ProColumns<YouVideoAPI.File>[] = [
    {title: 'ID', dataIndex: 'id', width: 80},
    {title: 'Name', dataIndex: 'name'},
    {title: 'Duration', dataIndex: 'duration', width: 100},
    {title: 'Size', dataIndex: 'size', width: 120},
  ]

  return (
    <PageContainer title={video?.name} extra={
      <Button type={"primary"} onClick={() => setEditOpen(true)}>编辑</Button>
    }>
      <ModalForm
        title={"编辑视频"}
        open={editOpen}
        modalProps={{ destroyOnClose: true, onCancel: () => setEditOpen(false) }}
        initialValues={{
          name: video?.name,
          episode: video?.ep,
          order: video?.order,
          release: video?.release,
        }}
        onFinish={async (values) => {
          if (!video) return false
          const payload: any = {}
          if (values.name !== undefined && values.name !== video.name) payload.name = values.name
          if (values.episode !== undefined && values.episode !== video.ep) payload.episode = values.episode
          if (values.order !== undefined && values.order !== video.order) payload.order = values.order
          if (values.release !== undefined && values.release !== video.release) payload.release = values.release
          if (Object.keys(payload).length === 0) {
            message.info("没有修改项")
            return true
          }
          const resp = await updateVideo(video.id, payload)
          if (!resp.success) {
            message.error(resp.err)
            return false
          }
          message.success("已保存")
          await model.loadData({id: video.id})
          setEditOpen(false)
          return true
        }}
      >
        <ProFormText name="name" label="名称" placeholder="输入名称"/>
        <ProFormText name="episode" label="集数" placeholder="输入集数（可选）"/>
        <ProFormDigit name="order" label="排序" placeholder="输入排序（可选）"/>
        <ProFormText name="release" label="发布日期" placeholder="YYYY-MM-DD（可选）"/>
        <ProFormTextArea name="desc" label="备注" placeholder="仅本地备注，不提交（暂不保存）" disabled/>
      </ModalForm>
      <Row gutter={8}>
        <Col span={8}>
          <Card title={"封面"} size={"small"}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              {model.getCover() ? (
                <img src={model.getCover()} style={{maxWidth: '100%'}}/>
              ) : (
                <Typography.Text type="secondary">暂无封面</Typography.Text>
              )}
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card title={"基础信息"} size={"small"}>
            <Descriptions column={2}>
              <Descriptions.Item label="ID">{video?.id}</Descriptions.Item>
              <Descriptions.Item label="名称">{video?.name}</Descriptions.Item>
              <Descriptions.Item label="集数">{video?.ep ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="排序">{video?.order ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="发布日期">{video?.release ?? '-'}</Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Typography.Paragraph>
              <Typography.Text type="secondary">信息</Typography.Text>
            </Typography.Paragraph>
            <Space direction={'vertical'} style={{width: '100%'}}>
              {video?.infos?.map((info) => (
                <Space key={info.id}>
                  <Typography.Text strong>{info.key}</Typography.Text>
                  <Typography.Text type="secondary">{info.value}</Typography.Text>
                </Space>
              ))}
              {!video?.infos?.length && <Typography.Text type="secondary">无</Typography.Text>}
            </Space>
          </Card>
        </Col>
      </Row>
      <Row style={{marginTop: 8}}>
        <Col span={24}>
          <Card title={"文件列表"} size={"small"}>
            <ProTable<YouVideoAPI.File>
              search={false}
              toolBarRender={false}
              dataSource={video?.files || []}
              rowKey={(it) => it.id}
              columns={fileColumns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}
export default VideoDetailPage


