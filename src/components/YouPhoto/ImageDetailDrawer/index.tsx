import {Button, Col, Drawer, Dropdown, Row} from "antd";
import {PhotoItem} from "@/pages/YouPhoto/Photo/List/model";
import styles from './styles.less'
import Title from "antd/es/typography/Title";
import {isDarkColor} from "@/utils/color";
import TextDisplayDialog from "@/components/TextDisplayDialog";
import {useEffect, useState, useCallback} from "react";
import {MenuOutlined, ReloadOutlined} from "@ant-design/icons";
import {useModel} from "@umijs/max";
import {getImage} from "@/services/youphoto/image";
import {message} from "antd";

interface InfoItemProps {
  label: string;
  value: string;
  style?: React.CSSProperties;
}

// 提取公共样式组件
const InfoItem = ({ label, value, style = {} }: InfoItemProps) => (
  <div
    style={{
      backgroundColor: 'rgb(0,0,0,.05)',
      ...style
    }}
    className={styles.colorItem}
  >
    <div className={styles.colorText}>{value}</div>
    <div>{label}</div>
  </div>
);

interface TagItemProps {
  tag: string;
  rank?: number;
}

// 提取标签组件
const TagItem = ({ tag, rank }: TagItemProps) => (
  <div
    style={{
      backgroundColor: 'rgb(0,0,0,.05)',
      padding: '4px 12px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0
    }}
  >
    <div style={{ fontWeight: 'bold' }}>{tag}</div>
    {rank && (
      <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>
        {(rank * 100).toFixed(2)}%
      </div>
    )}
  </div>
);

export type ImageDetailDrawerProps = {
  open?: boolean
  imageId: number
  onClose?: () => void
  onRunDeepdanbooru: (id: number) => void
  onRunImageTagger: (id: number) => void
}

const ImageDetailDrawer = ({
  open,
  imageId,
  onClose,
  onRunDeepdanbooru,
  onRunImageTagger,
}: ImageDetailDrawerProps) => {
  const sdwModel = useModel('sdwModel')
  const [textDisplayDialogOpen, setTextDisplayDialogOpen] = useState(false)
  const [textDisplayText, setTextDisplayText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<PhotoItem | null>(null)

  const fetchImageDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getImage({id: imageId})
      if (response.data) {
        const token = localStorage.getItem("token")
        if (!token) {
          return
        }
        const updatedImage: PhotoItem = {
          ...response.data,
          thumbnailUrl: `/api/photo/image/${response.data.id}/thumbnail?token=${token}`,
          rawUrl: `/api/photo/image/${response.data.id}/raw?token=${token}`,
          mostClassify: response.data.classify && response.data.classify.length > 0 
            ? response.data.classify.sort((a, b) => b.prob - a.prob)[0].label.split(",")
            : undefined
        }
        setImage(updatedImage)
      }
    } catch (error) {
      message.error('获取图片详情失败')
    } finally {
      setLoading(false)
    }
  }, [imageId])

  useEffect(() => {
    if (open) {
      fetchImageDetail()
    }
  }, [open, imageId, fetchImageDetail])

  const handleTagAction = useCallback((action: 'copy' | 'send') => {
    if (!image?.tag) return;
    
    const tags = image.tag.map(result => result.tag).join(',');
    if (action === 'copy') {
      setTextDisplayText(tags);
      setTextDisplayDialogOpen(true);
    } else {
      sdwModel.applyPrompt(tags);
      sdwModel.setOpen(true);
    }
  }, [image, sdwModel]);

  if (!image) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={"60vw"}
      title={image.name}
      extra={
        <div style={{display: 'flex', gap: '8px'}}>
          <Button 
            icon={<ReloadOutlined/>} 
            onClick={fetchImageDetail}
            loading={loading}
          />
          <Dropdown menu={{
            items: [
              { label: "Deepdanbooru Analyze", key: "deepdanbooru" },
              { label: "Image Tagger", key: "imagetagger" }
            ],
            onClick: (menu) => {
              switch (menu.key) {
                case 'deepdanbooru':
                  onRunDeepdanbooru(image.id)
                  break;
                case 'imagetagger':
                  onRunImageTagger(image.id)
                  break;
              }
            }
          }}>
            <Button icon={<MenuOutlined/>}/>
          </Dropdown>
        </div>
      }
    >
      <TextDisplayDialog 
        text={textDisplayText} 
        open={textDisplayDialogOpen}
        onClose={() => setTextDisplayDialogOpen(false)}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} className={styles.imageContainer}>
          <img src={image.rawUrl} className={styles.image} alt={image.name}/>
        </Col>

        <Col xs={24}>
          <Title level={5}>Base info</Title>
        </Col>
        
        <Col xs={24}>
          <InfoItem label="Filename" value={image.name} />
        </Col>
        
        <Col xs={12}>
          <InfoItem label="Width" value={`${image.width} px`} />
        </Col>
        
        <Col xs={12}>
          <InfoItem label="Height" value={`${image.height} px`} />
        </Col>

        {image.imageColors && image.imageColors.length > 0 && (
          <>
            <Col xs={24}>
              <Title level={5}>Color pattern</Title>
            </Col>
            <Row gutter={[16, 16]}>
              {image.imageColors.map(imageColor => (
                <Col key={imageColor.value} xs={8}>
                  <InfoItem
                    label={`${(imageColor.percent * 100).toFixed(2)}%`}
                    value={imageColor.value}
                    style={{
                      backgroundColor: imageColor.value,
                      color: isDarkColor(imageColor.value) ? 'white' : 'black'
                    }}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}

        {image.classify && image.classify.length > 0 && (
          <Col xs={24}>
            <Title level={5}>Image Classification</Title>
            <Row gutter={[16, 16]}>
              {image.classify.map(label => (
                <Col key={label.label} xs={24}>
                  <InfoItem
                    label={`${(label.prob * 100).toFixed(2)}%`}
                    value={label.label}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        )}

        {image.tag?.length > 0 && (
          <Col xs={24}>
            <Dropdown
              menu={{
                items: [
                  { label: "Copy as prompt", key: "copy" },
                  { label: "Send to stable diffusion", key: "send" }
                ],
                onClick: (menu) => handleTagAction(menu.key as 'copy' | 'send')
              }}
            >
              <Title level={5} style={{flex: 1, marginTop: 16, marginBottom: 16}}>
                Tags
              </Title>
            </Dropdown>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%'
            }}>
              {image.tag.map(result => (
                <TagItem key={result.tag} tag={result.tag} rank={result.rank} />
              ))}
            </div>
          </Col>
        )}
      </Row>
    </Drawer>
  )
}

export default ImageDetailDrawer
