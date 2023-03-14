import {Card, Col, Drawer, Image, Row, Spin} from "antd";
import {useEffect, useState} from "react";
import {fetchNearImageList} from "@/services/youphoto/image";
import {getYouPhotoConfig} from "@/utils/config";
import {DownloadOutlined} from "@ant-design/icons";
import styles from "@/pages/YouPhoto/Photo/List/style.less";

export type ImageDrawerProps = {
  open?: boolean
  sourceId?: number
  onClose?: () => void
}
export type ImageItem = {
  thumbnailUrl: string
  rawUrl: string
} & YouPhotoAPI.NearImage
const NearImageDrawer = ({open = false, sourceId, onClose}: ImageDrawerProps) => {
  const [images, setImages] = useState<(YouPhotoAPI.NearImage & ImageItem)[]>([])
  const [loading, setLoading] = useState(false)
  const refresh = async () => {
    if (!sourceId) {
      return
    }
    const youPhotoConfig = await getYouPhotoConfig()
    if (!youPhotoConfig) {
      return
    }
    setImages([])
    setLoading(true)
    const res = await fetchNearImageList({id: sourceId, maxDistance: 6})
    if (res.data) {
      setImages(res.data.map(photo => {
        return {
          ...photo,
          thumbnailUrl: youPhotoConfig.baseUrl + `/image/${photo.image.id}/thumbnail?token=${youPhotoConfig.token}`,
          rawUrl: youPhotoConfig.baseUrl + `/image/${photo.image.id}/raw?token=${youPhotoConfig.token}`
        }
      }).sort((a, b) => {
        return a.avgDistance > b.avgDistance ? 1 : -1
      }))
      setLoading(false)
    }


  }
  useEffect(() => {
    refresh()
  }, [sourceId])
  const onDownload = (photo: ImageItem) => {
    const fileName = photo.image.name;
    const el = document.createElement("a");
    el.setAttribute("href", photo.rawUrl);
    el.setAttribute("download", fileName);
    document.body.appendChild(el);
    el.click();
    el.remove();
  };
  return (
    <Drawer open={open} onClose={onClose} width={720}>
      <Spin spinning={loading}>
        <Image.PreviewGroup>
          <Row gutter={[16, 16]}>
            {
              images.map(it => {
                return (
                  <Col xs={6}>
                    <Card
                      actions={[
                        <DownloadOutlined
                          key="download"
                          onClick={() => onDownload(it)}
                        />,
                      ]}
                    >
                      <div className={styles.imageItem}>
                        <Image
                          className={styles.image}
                          src={it.thumbnailUrl} alt=""
                          preview={{
                            src: it.rawUrl
                          }}
                          style={{width: 120, height: 180}}
                        />
                      </div>
                    </Card>
                  </Col>
                );
              })
            }
          </Row>
        </Image.PreviewGroup>
      </Spin>
    </Drawer>
  )
}
export default NearImageDrawer
