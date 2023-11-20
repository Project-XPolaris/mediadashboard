import {Form} from "antd";
import {ModalForm, ProFormGroup, ProFormSelect, ProFormSwitch} from "@ant-design/pro-components";
import React, {useEffect} from "react";
import {fetchTaggerModelList} from "@/services/youphoto/image";
import {fetchServiceState} from "@/services/youphoto/server";

export type ScanOptionFormValues = {
  enableDomainColor: boolean
  forceRefreshDomainColor: boolean
  enableImageClassification: boolean
  forceImageClassification: boolean
  enableNsfwCheck: boolean
  forceNsfwCheck: boolean
  enableDeepdanbooruCheck: boolean
  forceDeepdanbooruCheck: boolean
  enableTagger: boolean
  forceTagger: boolean
  taggerModel?: string
}
export type ScanOptionDialogProps = {
  trigger: React.ReactElement
  onOk: (values: ScanOptionFormValues) => void
}
const ScanOptionDialog = ({trigger, onOk}: ScanOptionDialogProps) => {
  const [form] = Form.useForm<ScanOptionFormValues>();
  const [taggerModelList, setTaggerModelList] = React.useState<string[]>([])
  const [serviceState, setServiceState] = React.useState<YouPhotoAPI.ServiceState | undefined>()
  const loadTaggerOption = async () => {
    const resp = await fetchTaggerModelList()
    if (resp.data) {
      setTaggerModelList(resp.data)
      if (resp.data.length > 0) {
        form.setFieldsValue({taggerModel: resp.data[0]})
      }
    }
  }
  const loadServiceState = async () => {
    const resp = await fetchServiceState()
    if (resp.data) {
      setServiceState(resp.data)
    }
  }
  useEffect(() => {
    loadTaggerOption()
    loadServiceState()
  }, [])
  return (
    <ModalForm<ScanOptionFormValues>
      title="Scan option"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onFinish={async (values) => {
        onOk(values)
        return true;
      }}
      initialValues={{
        enableDomainColor: false,
        forceRefreshDomainColor: false,
        enableImageClassification: false,
        forceImageClassification: false,
        enableNsfwCheck: false,
        forceNsfwCheck: false,
        enableDeepdanbooruCheck: false,
        forceDeepdanbooruCheck: false,
        enableTagger: false,
        forceTagger: false,
      }}
    >
      <ProFormGroup title={"Color pattern"}>
        <ProFormSwitch name={"enableDomainColor"} label='Enable' colSize={1}/>
        <ProFormSwitch name={"forceRefreshDomainColor"} label='Force'/>
      </ProFormGroup>
      {
        serviceState?.imageClassificationEnable && (
          <ProFormGroup title={"Image Classification"}>
            <ProFormSwitch name={"enableImageClassification"} label='Enable'/>
            <ProFormSwitch name={"forceImageClassification"} label='Force'/>
          </ProFormGroup>
        )
      }

      {
        serviceState?.nsfwEnable && (
          <ProFormGroup title={"NSFW"}>
            <ProFormSwitch name={"enableNsfwCheck"} label='Enable'/>

            <ProFormSwitch name={"forceNsfwCheck"} label='Force'/>
          </ProFormGroup>
        )
      }
      {
        serviceState?.deepdanbooruEnable && (
          <ProFormGroup title={"Deepdanbooru"}>
            <ProFormSwitch name={"enableDeepdanbooruCheck"} label='Enable'/>
            <ProFormSwitch name={"forceDeepdanbooruCheck"} label='Force'/>
          </ProFormGroup>
        )
      }
      {
        serviceState?.imageTaggerEnable && (
          <ProFormGroup title={"Tagger"}>
            <ProFormSwitch name={"enableTagger"} label='Enable'/>
            <ProFormSwitch name={"forceTagger"} label='Force'/>
            <ProFormSelect
              width={"md"}
              name={"taggerModel"}
              label={"Model"}
              options={taggerModelList.map((model) => {
                return {label: model, value: model}
              })}
            />
          </ProFormGroup>
        )
      }

    </ModalForm>
  )
}
export default ScanOptionDialog
