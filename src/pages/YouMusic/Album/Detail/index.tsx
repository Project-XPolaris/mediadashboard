import {PageContainer} from "@ant-design/pro-components";
import {Button, Card, Col, Descriptions, Row, Typography} from "antd";
import useAlbumDetailModel from "@/pages/YouMusic/Album/Detail/model";
import React, {useEffect} from "react";
import {useSearchParams} from "@@/exports";
import styles from './styles.less'
const { Paragraph } = Typography;

const AlbumDetail = () => {
  const model = useAlbumDetailModel()
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id")
    model.loadData(Number(id))
  }, [])
  return (
    <PageContainer
      header={{
        title: model.album?.name,
      }}
    >
      <Row gutter={8}>
        <Col span={6}>
          <Card
            title={"Cover"}
            extra={<Button size={"small"}>Upload</Button>}
            size={"small"}
          >
            <div className={styles.coverCard}>
              <img src={model.getAlbumCover()} className={styles.cover}/>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card title={"Info"}
                size={"small"}>
            <div className={styles.infoCard}>
              <Descriptions column={2}>
                <Descriptions.Item label="Id">{model.album?.id} </Descriptions.Item>
                <Descriptions.Item label="Name">{model.album?.name}</Descriptions.Item>
                <Descriptions.Item label="Created">{model.album?.createdAt}</Descriptions.Item>
                <Descriptions.Item label="Updated">{model.album?.updatedAt}</Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>

        </Col>
      </Row>
    </PageContainer>
  )
}
export default AlbumDetail
