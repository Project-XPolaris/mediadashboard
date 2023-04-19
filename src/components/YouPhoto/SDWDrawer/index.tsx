import {
  Button,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Image,
  message,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tabs
} from "antd";
import React, {useEffect, useState} from "react";
import {
  changeSDWModel,
  deleteSDWConfig,
  fetchModelList,
  fetchSamplerList,
  fetchSDWConfigList,
  fetchSDWOptions,
  fetchUpscalerList, interruptSDW,
  saveSDWConfig,
  text2Image
} from "@/services/youphoto/sdw";
import {
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormInstance,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormTextArea,
  ProTable
} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {useRequest} from "ahooks";
import Search from "antd/es/input/Search";
import Base64UploadDialog, {UploadItem} from "@/components/YouPhoto/Base64UploadDialog";

export type SDWDrawerProps = {
  open?: boolean
  onClose?: () => void
}
export type Text2ImageValues = {
  prompt: string
  negative_prompt: string
  width: number
  height: number
  steps: number
  sampler_name: string
  cfg_scale: number
  enable_hr: boolean
  hr_upscaler: string
  hr_scale: number
  hr_resize_x: number
  hr_resize_y: number
  hr_second_pass_steps: number
  denoising_strength: number
  n_iter: number
  batch_size: number
}
const SDWDrawer = (
  {
    open,
    onClose
  }: SDWDrawerProps) => {
  const sdwModel = useModel('sdwModel')
  const formRef = React.useRef<ProFormInstance>()
  const [model, setModel] = useState<YouPhotoAPI.SDWModel[]>([])
  const [selectModelName, setSelectModelName] = useState<string>()
  const [samplers, setSamplers] = useState<YouPhotoAPI.Sampler[]>([])
  const [upscaler, setUpscaler] = useState<YouPhotoAPI.Upscaler[]>([])
  const [configList, setConfigList] = useState<YouPhotoAPI.SDWConfig[]>([])
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [selectImageIndex, setSelectImageIndex] = useState<number[]>([])
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false)
  const refreshController = useRequest(sdwModel.refreshProgress, {
    manual: true,
    pollingInterval: 1000,
    retryCount: 3,
    pollingWhenHidden: false,
  })
  const [modelLoading, setModelLoading] = useState<boolean>(false)
  const switchModel = async (modelName: string) => {
    setModelLoading(true)
    const response = await changeSDWModel({model: modelName})
    setModelLoading(false)
    if (!response) {
      return
    }
    if (response.success) {
      message.success("Switch model success")
    } else {
      message.error(response.err)
    }
  }

  const refreshModels = async () => {
    const response = await fetchModelList()
    if (response.success) {
      if (response.data) {
        setModel(response.data)
        return response.data
      }
    } else {
      message.error(response.err)
    }
    return undefined
  }

  const refresh = async () => {
    const model = await refreshModels()
    if (!model) {
      return
    }
    const fetchSamplerResponse = await fetchSamplerList()
    if (fetchSamplerResponse.success) {
      if (fetchSamplerResponse.data) {
        setSamplers(fetchSamplerResponse.data)
        if (sdwModel.form && fetchSamplerResponse.data.length > 0) {
          sdwModel.form.setFieldValue("sampler_name", fetchSamplerResponse.data[0].name)
        }
      }
    }
    const fetchUpscalerResponse = await fetchUpscalerList()
    if (fetchUpscalerResponse.success) {
      if (fetchUpscalerResponse.data) {
        setUpscaler(fetchUpscalerResponse.data)
        if (sdwModel.form && fetchUpscalerResponse.data.length > 0) {
          sdwModel.form.setFieldValue("hr_upscaler", fetchUpscalerResponse.data[0].name)
        }
      }
    }
    const fetchConfigResponse = await fetchSDWConfigList()
    if (fetchConfigResponse.success) {
      if (fetchConfigResponse.data) {
        setConfigList(fetchConfigResponse.data)
      }
    }


    const response = await fetchSDWOptions()
    if (response.success) {
      if (response.data) {
        const modelName = response.data.sd_model_checkpoint
        setSelectModelName(modelName)
      }
    } else {
      message.error(response.err)
    }

  }
  useEffect(() => {
    if (open) {
      refresh()
      refreshController.run()
    } else {
      refreshController.cancel()
    }
  }, [open])
  const onSubmit = async (values: Text2ImageValues) => {
    setCurrentImageIndex(0)
    setImages([])
    const response = await text2Image(values)
    if (!response) {
      return
    }
    if (!response.success) {
      message.error(response.err)
      return
    }
    if (response.data) {
      if (response.data.images.length > 0) {
        setImages(response.data.images)
        setCurrentImageIndex(0)
      }
    }
  }
  const getImageBase64 = () => {
    if (sdwModel.progress?.current_image) {
      return `data:image/jpeg;base64,${sdwModel.progress?.current_image}`
    }
    if (images && images.length > 0 && currentImageIndex < images.length) {
      return `data:image/jpeg;base64,${images[currentImageIndex]}`
    }
    return undefined
  }
  const onSaveAsNew = async (name: string) => {
    if (!formRef.current) {
      return
    }
    const config = formRef.current.getFieldsValue()
    const response = await saveSDWConfig({name, config: JSON.stringify(config)})
    if (response) {
      if (response.success) {
        message.success("Save as new config success")
        await refresh()
      } else {
        message.error(response.err)
      }
    }
  }
  const onDeleteConfig = async (id: number) => {
    const response = await deleteSDWConfig({id})
    if (response) {
      if (response.success) {
        message.success("Delete config success")
        await refresh()
      } else {
        message.error(response.err)
      }
    }
  }
  const onSelectImage = (index: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectImageIndex([...selectImageIndex, index])
    } else {
      setSelectImageIndex(selectImageIndex.filter(i => i !== index))
    }
  }
  const onUpload = async () => {
    // random 8 character
    setUploadItems(
      images.filter((_, index) => selectImageIndex.includes(index))
        .map(image => {
          const random = Math.random().toString(36).substring(2, 10)
          return {
            name: `${random}.jpg`,
            base64: image,
          }
        }))
    setUploadDialogOpen(true)
  }

  return (
    <Drawer
      width={"90vw"}
      open={open}
      title={"Stable diffusion webui"}
      onClose={onClose}
    >
      <Base64UploadDialog
        uploadItems={uploadItems}
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      />
      <Row gutter={[16, 16]}>

        <Col xs={9}>
          <Spin spinning={modelLoading}>
            <ProForm<Text2ImageValues>
              initialValues={{
                prompt: "",
                negative_prompt: "",
                width: 512,
                height: 512,
                steps: 10,
                seed: -1,
                cfg_scale: 7,
                hr_scale: 2,
                hr_second_pass_steps: 0,
                denoising_strength: 0.7,
                n_iter: 1,
                batch_size: 1
              }}
              form={sdwModel.form}
              onFinish={onSubmit}
              formRef={formRef}
            >
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: `Model`,
                    children: (
                      <div>
                        <Select
                          style={{
                            width: "100%"
                          }}
                          value={selectModelName}
                          onChange={(value) => {
                            setSelectModelName(value)
                            switchModel(value)
                          }}
                          options={model.map(it => {
                            return {value: it.title, label: it.title}
                          })}/>
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: `Prompt`,
                    children: (
                      <div>
                        <ProFormTextArea name={"prompt"} placeholder={"Enter prompt"} style={{height: '30vh'}}/>
                        <ProFormTextArea name={"negative_prompt"} placeholder={"Enter negative prompt"}
                                         style={{height: '30vh'}}/>
                      </div>
                    ),
                  },
                  {
                    key: '3',
                    label: `Predict`,
                    children: (
                      <div>
                        <ProFormSelect
                          label={"Sampler"}
                          name={"sampler_name"}
                          options={samplers.map(it => {
                            return {value: it.name, label: it.name}
                          })}/>
                        <ProFormGroup>
                          <ProFormDigit name={"width"} label={"width"} width="xs"/>
                          <ProFormDigit name={"height"} label={"height"} width="xs"/>
                          <ProFormDigit name={"steps"} label={"steps"} width="xs"/>
                          <ProFormDigit name={"cfg_scale"} label={"CFG Scale"} width="xs"/>
                        </ProFormGroup>
                        <ProFormDigit name={"seed"} label={"seed"} min={-1}/>
                        <ProFormGroup>
                          <ProFormDigit name={"batch_size"} label={"Batch size"} width="xs" min={1}/>
                          <ProFormDigit name={"n_iter"} label={"Batch count"} width="xs" min={1}/>
                        </ProFormGroup>
                      </div>
                    ),
                  },
                  {
                    key: '4',
                    label: `Hires fix`,
                    children: (
                      <div>
                        <ProFormGroup>
                          <ProFormSwitch name={"enable_hr"} label={"Use hires"}/>
                          <ProFormSelect
                            label={"Upscaler"}
                            name={"hr_upscaler"}
                            width={"xl"}
                            options={upscaler.map(it => {
                              return {value: it.name, label: it.name}
                            })}/>
                          <div>
                            <ProFormSlider
                              label={"Scale by"}
                              name={"hr_scale"}
                              min={1}
                              max={4}
                              step={0.05}
                            />
                            <ProFormDigit name={"hr_scale"} width="xs" fieldProps={{size: 'small'}}/>
                          </div>

                          <div>
                            <ProFormSlider
                              label={"Steps"}
                              name={"hr_second_pass_steps"}
                              min={1}
                              max={150}
                              step={1}
                            />
                            <ProFormDigit name={"hr_second_pass_steps"} width="xs" fieldProps={{size: 'small'}}/>
                          </div>
                          <div>
                            <ProFormSlider
                              label={"Denoising strength"}
                              name={"denoising_strength"}
                              min={0}
                              max={1}
                              step={0.01}
                            />
                            <ProFormDigit name={"denoising_strength"} width="xs" fieldProps={{size: 'small'}}/>
                          </div>
                          <div>
                            <ProFormSlider
                              label={"Resize width to"}
                              name={"hr_resize_x"}
                              min={1}
                              max={2048}
                              step={1}
                            />
                            <ProFormDigit name={"hr_resize_x"} width="xs" fieldProps={{size: 'small'}}/>

                          </div>
                          <div>
                            <ProFormSlider
                              label={"Resize height to"}
                              name={"hr_resize_y"}
                              min={1}
                              max={2048}
                              step={1}
                            />
                            <ProFormDigit name={"hr_resize_y"} width="xs" fieldProps={{size: 'small'}}/>
                          </div>

                        </ProFormGroup>
                      </div>
                    ),
                  },
                  {
                    key: '5',
                    label: `Profile`,
                    children: (
                      <div>
                        <Search
                          placeholder="profile name"
                          enterButton="Save current as name"
                          style={{marginBottom: 16}}
                          onSearch={onSaveAsNew}

                        />
                        <ProTable<YouPhotoAPI.SDWConfig>
                          search={false}
                          toolBarRender={false}
                          dataSource={configList} columns={[
                          {
                            key: "name",
                            title: "Name",
                            dataIndex: "name"
                          },
                          {
                            key: "id",
                            title: "Action",
                            render: (_, record) => {
                              return (
                                <Space>
                                  <Popconfirm
                                    title="Delete the profile"
                                    description="Are you sure to delete this profile?"
                                    onConfirm={() => {
                                      onDeleteConfig(record.id)
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <a href="#">Delete</a>
                                  </Popconfirm>
                                  <Divider type={"vertical"}/>
                                  <Popconfirm
                                    title="update the profile"
                                    description="Are you sure to update this profile?"
                                    onConfirm={() => {
                                      onSaveAsNew(record.name)
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <a href="#">Update with current</a>
                                  </Popconfirm>
                                  <Divider type={"vertical"}/>
                                  <Popconfirm
                                    title="Apply the profile"
                                    description="Are you sure to apply this profile?"
                                    onConfirm={() => {
                                      formRef.current?.setFieldsValue(JSON.parse(record.config))
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <a href="#">Apply</a>
                                  </Popconfirm>
                                </Space>
                              )
                            }
                          }
                        ]}/>

                      </div>
                    )
                  }
                ]}
              />
            </ProForm>
          </Spin>
        </Col>
        <Col xs={15}>
          <Row>
            <Col xs={16}>
              <Progress percent={(((sdwModel.progress?.progress) ?? 0) * 100)}/>
            </Col>
            <Col xs={6} style={{textAlign: 'right'}}>
              <Button onClick={() => interruptSDW()} size={"small"}>Interrupt</Button>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            style={{marginTop: 16}}
          >
            <Col xs={3} style={{height: "70vh", overflowY: 'scroll'}}>
              {
                images.map((it, index) => {
                  return (
                    <div
                      style={{
                        backgroundColor: 'rgba(0,0,0,.05)',
                        marginBottom: 8,
                        borderRadius: 4,
                        padding: 4,
                        width: "100%",
                        textAlign: 'center'
                      }}
                      key={index}
                    >
                      <Checkbox
                        style={{
                          marginRight: 8
                        }}
                        checked={selectImageIndex.includes(index)}
                        onChange={(e) => {
                          onSelectImage(index, e.target.checked)
                        }}
                      />
                      <img
                        src={`data:image/jpeg;base64,${it}`}
                        style={{width: "100%", position: 'relative', cursor: 'pointer'}}
                        onClick={() => {
                          setCurrentImageIndex(index)
                        }}
                      />
                    </div>

                  )
                })
              }
            </Col>
            <Col xs={21}>
              {getImageBase64() && <Image
                src={getImageBase64()}
                width={"100%"}
                height={"70vh"}
                style={{
                  objectFit: 'contain'
                }}
              />}

            </Col>
            <Col xs={24}>
              <Space style={{marginTop: 8}}>
                {
                  selectImageIndex.length > 0 && (
                    <Button onClick={() => onUpload()}>Upload select image</Button>
                  )
                }
              </Space>
            </Col>
          </Row>

        </Col>
      </Row>
    </Drawer>
  )
}

export default SDWDrawer
