import {Button, Col, Drawer, Dropdown, Row} from "antd";
import {PhotoItem} from "@/pages/YouPhoto/Photo/List/model";
import styles from './styles.less'
import Title from "antd/es/typography/Title";
import {isDarkColor} from "@/utils/color";
import TextDisplayDialog from "@/components/TextDisplayDialog";
import {useState} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useModel} from "@umijs/max";

export type ImageDetailDrawerProps = {
  open?: boolean
  image: PhotoItem
  onClose?: () => void
  onRunDeepdanbooru: (id: number) => void
}
const ImageDetailDrawer = (
  {
    open,
    image,
    onClose,
    onRunDeepdanbooru
  }: ImageDetailDrawerProps) => {
  const sdwModel = useModel('sdwModel')
  const [textDisplayDialogOpen, setTextDisplayDialogOpen] = useState(false)
  const [textDisplayText, setTextDisplayText] = useState<string>('')

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={image.name}
      extra={
        <Dropdown menu={{
          items: [
            {
              "label": "Deepdanbooru Analyze",
              key: "deepdanbooru",
            }
          ],
          onClick: (menu) => {
            switch (menu.key) {
              case 'deepdanbooru':
                onRunDeepdanbooru(image.id)
                break;
            }
          }
        }}

        >
          <Button icon={<MenuOutlined/>}/>
        </Dropdown>
      }
    >
      <TextDisplayDialog text={textDisplayText} open={textDisplayDialogOpen}
                         onClose={() => setTextDisplayDialogOpen(false)}/>
      <Row gutter={[16, 16]}>

        <Col xs={24} className={styles.imageContainer}>
          <img src={image.rawUrl} className={styles.image}/>
        </Col>
        <Col xs={24}>
          <Title level={5}>
            Base info
          </Title>
        </Col>
        <Col xs={24}>
          <div
            style={{
              backgroundColor: 'rgb(0,0,0,.05)',
            }}
            className={styles.colorItem}
          >
            <div className={styles.colorText}>
              {`${image.name}`}
            </div>
            <div>
              Filename
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <div
            style={{
              backgroundColor: 'rgb(0,0,0,.05)',
            }}
            className={styles.colorItem}
          >
            <div className={styles.colorText}>
              {`${image.width} px`}
            </div>
            <div>
              Width
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <div
            style={{
              backgroundColor: 'rgb(0,0,0,.05)',
            }}
            className={styles.colorItem}
          >
            <div className={styles.colorText}>
              {`${image.height} px`}
            </div>
            <div>
              Height
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <Title level={5}>
            Color pattern
          </Title>
          {
            image.imageColors && image.imageColors.length != 0 &&
            <Row gutter={[16, 16]}>
              {
                image.imageColors.map(imageColor => {
                  return (
                    <Col
                      key={imageColor.value}
                      xs={8}
                    >
                      <div
                        style={{
                          backgroundColor: imageColor.value,
                          color: isDarkColor(imageColor.value) ? 'white' : 'black'
                        }}
                        className={styles.colorItem}
                      >
                        <div className={styles.colorText}>
                          {
                            imageColor.value
                          }
                        </div>

                        <div>
                          {(imageColor.percent * 100).toFixed(2)}%
                        </div>
                      </div>
                    </Col>
                  )
                })
              }

            </Row>
          }
          {
            image.classify && image.classify.length != 0 &&
            <Col xs={24}>
              <Title level={5}>
                Image Classification
              </Title>
              <Row gutter={[16, 16]}>
                {
                  image.classify.map(label => {
                    return (
                      <Col
                        key={label.label}
                        xs={24}
                      >
                        <div
                          style={{
                            backgroundColor: 'rgb(0,0,0,.05)',
                          }}
                          className={styles.colorItem}
                        >
                          <div className={styles.colorText}>
                            {
                              label.label
                            }
                          </div>

                          <div>
                            {(label.prob * 100).toFixed(2)}%
                          </div>
                        </div>
                      </Col>
                    )
                  })
                }

              </Row>
            </Col>
          }
          {
            image.deepdanbooruResult && image.deepdanbooruResult.length != 0 &&
            <Col xs={24}>
              <Dropdown
                menu={{
                  items: [
                    {
                      label: "Copy as prompt",
                      key: "1"
                    },
                    {
                      label: "Send to stable diffusion",
                      key: "2"
                    }
                  ],
                  onClick: (menu) => {
                    switch (menu.key) {
                      case "1":
                        const tags = image.deepdanbooruResult
                        if (!tags) {
                          return
                        }
                        setTextDisplayText(tags.map(result => result.tag).join(','))
                        setTextDisplayDialogOpen(true)
                        break
                      case "2":
                        const tags2 = image.deepdanbooruResult
                        if (!tags2) {
                          return
                        }
                        sdwModel.applyPrompt(tags2.map(result => result.tag).join(','))
                        sdwModel.setOpen(true)
                    }
                  }
                }}
              >
                <Title level={5} style={{flex: 1, marginTop: 16, marginBottom: 16}}>
                  DeepDanbooru
                </Title>
              </Dropdown>

              <Row gutter={[16, 16]}>
                {
                  image.deepdanbooruResult.map(result => {
                    return (
                      <Col
                        key={result.tag}
                        xs={24}
                      >
                        <div
                          style={{
                            backgroundColor: 'rgb(0,0,0,.05)',
                          }}
                          className={styles.colorItem}
                        >
                          <div className={styles.colorText}>
                            {
                              result.tag
                            }
                          </div>

                          <div>
                            {(result.prob * 100).toFixed(2)}%
                          </div>
                        </div>
                      </Col>
                    )
                  })
                }

              </Row>
            </Col>
          }

        </Col>
      </Row>


    </Drawer>
  )
}
export default ImageDetailDrawer
