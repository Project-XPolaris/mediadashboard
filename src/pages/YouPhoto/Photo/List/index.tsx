import {useEffect, useRef, useState} from "react";
import styles from "./style.less";
import {Button, Card, Col, Divider, Dropdown, Image, Pagination, Popover, Row, Space, Spin} from "antd";
import {
  CompressOutlined,
  DownloadOutlined,
  ExpandOutlined,
  FilterFilled,
  ForkOutlined,
  PictureOutlined,
  SortAscendingOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import {PhotoItem} from "@/pages/YouPhoto/Photo/List/model";
import {
  DrawerForm,
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormSlider,
  ProFormText
} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import ColorPickerDialog from "@/components/YouPhoto/ColorPickerDialog";
import {isDarkColor} from "@/utils/color";

type RankColor = {
  colorRank1?: string
  colorRank2?: string
  colorRank3?: string
}
const ImageListPage = () => {
  const model = useModel('YouPhoto.Photo.List.model');
  const [pickupColorDialogOpen, setPickupColorDialogOpen] = useState(false)
  const [pickupColorTarget, setPickupColorTarget] = useState<any>()
  const formRef = useRef<ProFormInstance>()
  const [rankColor, setRankColor] = useState<RankColor>({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  useEffect(() => {
    model.refresh({});
    model.initModel();
  }, []);
  const onDownload = (photo: PhotoItem) => {
    const fileName = photo.name;
    const el = document.createElement("a");
    el.setAttribute("href", photo.rawUrl);
    el.setAttribute("download", fileName);
    document.body.appendChild(el);
    el.click();
    el.remove();
  };
  const getViewSeleKeys = () => {
    const keys: string[] = [model.imageFit, `infoMode.${model.infoMode}`]
    if (model.imageSpan) {
      keys.push(`col.${24 / model.imageSpan}`)
    } else {
      keys.push('free')
    }
    return keys
  }
  const getContentColor = (color?: string) => {
    if (!color) {
      return undefined
    }
    return isDarkColor(color) ? 'white' : 'black'
  }
  const getContentWithColor = (dark: string, light: string, color?: string,) => {
    if (!color) {
      return undefined
    }
    return isDarkColor(color) ? light : dark
  }
  return (
    <PageContainer
      extra={[
        <Space>
          <Dropdown menu={{
            selectable: true,
            selectedKeys: getViewSeleKeys(),
            items: [
              ...Array.from(Array(6).keys()).filter((x) => 24 % (x + 1) === 0).map((i) => {
                return {
                  key: `col.${i + 1}`,
                  label: `${i + 1} per col`,
                }
              }),
              {
                key: 'free',
                label: "Free",
                icon: <UnlockOutlined/>,
              },
              {
                type: 'divider',
              },
              {
                key: 'contain',
                label: "Contain",
                icon: <CompressOutlined/>,
              },
              {
                key: 'cover',
                label: "Cover",
                icon: <ExpandOutlined/>
              },
              {
                type: 'divider',
              },
              {
                key: 'infoMode.none',
                label: "None",
              },
              {
                key: 'infoMode.simple',
                label: "Simple",
              },
              {
                key: 'infoMode.full',
                label: "Full",
              }
            ],
            onClick: ({key}) => {
              switch (key) {
                case 'contain':
                  model.setImageFit('contain')
                  break;
                case 'cover':
                  model.setImageFit('cover')
                  break;
              }
              if (key.startsWith('col.')) {
                const col = Number(key.split('.')[1])
                model.setImageSpan(24 / col)
              }
              if (key === 'free') {
                model.setImageSpan(undefined)
              }
              if (key.startsWith('infoMode.')) {
                const mode = key.split('.')[1]
                model.setInfoMode(mode as any)
              }
            }
          }}>
            <Button icon={<PictureOutlined/>}>View</Button>
          </Dropdown>
          <Divider type={"vertical"}/>
          <Dropdown menu={{
            selectable: true,
            selectedKeys: [model.order],
            items: [
              {
                key: 'id asc',
                label: "ID ASC",
              },
              {
                key: 'id desc',
                label: "ID DESC",
              },
            ],
            onClick: ({key}) => {
              model.updateOrder(key)
            }
          }}>
            <Button icon={<SortAscendingOutlined/>}>Order</Button>
          </Dropdown>
          <DrawerForm
            title="Filter"
            open={filterDrawerOpen}
            onFinish={async (values) => {
              await model.updateFilter(values)
              setFilterDrawerOpen(false)
            }}
            drawerProps={{
              onClose: () => setFilterDrawerOpen(false)
            }}
            width={500}
            trigger={
              <Button type={"primary"} icon={<FilterFilled/>} onClick={() => setFilterDrawerOpen(true)}>
                Filter
              </Button>
            }
            formRef={formRef}
            initialValues={{
              maxDistance: 100
            }}
          >
            <ColorPickerDialog
              open={pickupColorDialogOpen}
              onClose={() => setPickupColorDialogOpen(false)}
              onOk={({color}) => {
                formRef.current?.setFieldValue(pickupColorTarget, color)
                setPickupColorDialogOpen(false)
                if (pickupColorTarget) {
                  setRankColor({
                    ...rankColor,
                    [pickupColorTarget]: color
                  })
                }
              }}
            />
            <ProForm.Group>
              <ProFormSelect
                allowClear={false}
                name="libraryId"
                placeholder="Select Library"
                label="Library"
                width={200}
                options={[
                  {
                    label: 'All',
                    value: undefined
                  },
                  ...model.libraryList.map(lib => {
                    return {
                      label: `${lib.name}(${lib.id})`,
                      value: lib.id
                    }
                  })]}/>
            </ProForm.Group>
            <ProForm.Group title={"Color Match"}>
              <ProFormText
                width={140}
                name="colorRank1"
                label="ColorRank1"
                fieldProps={{
                  prefix: (
                    <div style={{width: 8, height: 8, background: rankColor.colorRank1}}/>
                  ),
                }}
                extra={
                  <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
                    setPickupColorDialogOpen(true)
                    setPickupColorTarget('colorRank1')
                  }}
                  >Pickup</Button>
                }
              />
              <ProFormText
                name="colorRank2"
                label="ColorRank2"
                width={120}
                fieldProps={{
                  prefix: (
                    <div style={{width: 8, height: 8, background: rankColor.colorRank2}}/>
                  ),
                }}
                extra={
                  <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
                    setPickupColorDialogOpen(true)
                    setPickupColorTarget('colorRank2')
                  }}
                  >Pickup</Button>
                }
              />
              <ProFormText
                width={120}
                name="colorRank3"
                label="ColorRank3"
                fieldProps={{
                  prefix: (
                    <div style={{width: 8, height: 8, background: rankColor.colorRank3}}/>
                  ),
                }}
                extra={
                  <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
                    setPickupColorDialogOpen(true)
                    setPickupColorTarget('colorRank3')
                  }}
                  >Pickup</Button>
                }
              />
              <ProFormSlider
                width={120}
                name="maxDistance"
                label="MaxDistance"
                max={300}
                min={0}
              />
            </ProForm.Group>
            {
              model.filter.nearImageId && (
                <ProForm.Group title={"Near image"} extra={
                  <Button
                    type={"text"}
                    onClick={() => model.setFilter({
                      ...model.filter,
                      nearImageId: undefined
                    })}>Clear</Button>
                }>
                  <img src={model.getCurrentNearImage()?.thumbnailUrl} width={120}/>
                  <ProFormSlider name="nearImageDistance"
                                 label="Near Image Distance"
                                 max={50}
                                 min={0}/>
                </ProForm.Group>
              )
            }
            <ProForm.Group title={"Size"}>

            </ProForm.Group>
          </DrawerForm>
        </Space>

      ]}
    >
      <Spin spinning={model.loading}>
        <Image.PreviewGroup>
          <Row gutter={[16, 16]} justify="space-around" align="middle">
            {
              model.photos.map(it => {
                return (
                  <Col xs={model.imageSpan} key={it.id}>
                    <Dropdown
                      trigger={['contextMenu']}
                      menu={{
                        items: [
                          {
                            key: "download",
                            label: "Download",
                            icon: <DownloadOutlined/>,
                          },
                          {
                            key: "nearimage",
                            label: "Near Image",
                            icon: <ForkOutlined/>,
                          }
                        ],
                        onClick: ({key}) => {
                          switch (key) {
                            case "download":
                              onDownload(it)
                              break;
                            case "nearimage":
                              model.setFilter({...model.filter, nearImageId: it.id})
                              setFilterDrawerOpen(true)
                              break;
                          }
                        }
                      }}>
                      <Card
                        bordered={false}
                        style={{backgroundColor: it.domain}}
                        bodyStyle={{padding: 0}}
                      >
                        <div className={styles.imageItem}>

                          <Image
                            src={it.thumbnailUrl} alt=""
                            preview={{
                              src: it.rawUrl,
                              maskClassName: model.infoMode === 'none' ? styles.previewMaskInNone : styles.previewMask,
                            }}

                            style={{
                              objectFit: model.imageFit,
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                              borderBottomLeftRadius: model.infoMode == 'none' ? 8 : 0,
                              borderBottomRightRadius: model.infoMode == 'none' ? 8 : 0,
                            }}
                            width={"100%"}
                            height={"100%"}
                          />
                        </div>
                        {
                          model.infoMode != 'none' && (
                            <div className={styles.cardInfo}
                                 style={{color: getContentColor(it.domain)}}>
                              <Space direction="vertical" style={{width: "100%"}}>
                                <div style={{
                                  maxLines: 2,
                                  overflow: "hidden",
                                  lineBreak: "anywhere",
                                }}>
                                  {it.name}
                                </div>
                                {
                                  model.infoMode === "full" && (
                                    <>
                                      <div className={styles.sizeInfo}>
                                        Size: {it.width} * {it.height}
                                      </div>
                                      <div style={{width: "100%"}}>
                                        <div style={{width: "100%", display: 'flex'}}>
                                          {(it.imageColors ?? []).map(color => {
                                            return (
                                              <Popover
                                                content={(color.percent * 100).toFixed(2) + "%"}
                                                title={color.value}
                                                style={{
                                                  backgroundColor: color.value,
                                                }}
                                              >
                                                <div style={{
                                                  width: `${color.percent * 100}%`,
                                                  height: 12,
                                                  backgroundColor: color.value,
                                                  border: "1px solid",
                                                  borderColor: getContentWithColor("rgba(0,0,0,0.3)", "rgba(255,255,255,0.3)", it.domain),
                                                  borderRadius: 8,
                                                  marginRight: 4,
                                                }}/>
                                              </Popover>
                                            )
                                          })}
                                        </div>

                                      </div>
                                      {
                                        it.mostClassify && (
                                          <div style={{width: "100%"}}>
                                            {
                                              it.mostClassify.map((classify, index) => {
                                                return (
                                                  <span key={index}>
                                                    {
                                                      classify
                                                    }
                                                  </span>
                                                )
                                              })
                                            }

                                          </div>
                                        )
                                      }

                                    </>
                                  )
                                }
                              </Space>
                            </div>
                          )
                        }

                      </Card>
                    </Dropdown>
                  </Col>
                );
              })
            }
          </Row>
        </Image.PreviewGroup>
      </Spin>
      <div className={styles.pagination}>
        <Row>
          <Col xs={24}>
            <Card>
              <Pagination
                pageSize={model.pagination.pageSize}
                current={model.pagination.page}
                pageSizeOptions={[24, 24 * 2, 24 * 3, 24 * 4, 24 * 5, 24 * 6, 24 * 7]}
                showQuickJumper
                showTotal={total => `Total ${total} items`}
                onChange={(page, pageSize) => {
                  model.refresh({
                    queryPage: page,
                    queryPageSize: pageSize,
                  })
                }}
                total={model.pagination.total}
              />
            </Card>

          </Col>
        </Row>
      </div>


    </PageContainer>

  );
};
export default ImageListPage;
