import {Form} from "antd";
import {ModalForm, ProFormGroup, ProFormSwitch} from "@ant-design/pro-components";
import React from "react";

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
}
export type ScanOptionDialogProps = {
  trigger: React.ReactElement
  onOk: (values: ScanOptionFormValues) => void
}
const ScanOptionDialog = ({trigger, onOk}: ScanOptionDialogProps) => {
  const [form] = Form.useForm<ScanOptionFormValues>();
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
        enableDomainColor: true,
        forceRefreshDomainColor: false,
        enableImageClassification: true,
        forceImageClassification: false,
        enableNsfwCheck: true,
        forceNsfwCheck: false,
        enableDeepdanbooruCheck: true,
        forceDeepdanbooruCheck: false,
        enableTagger: true,
        forceTagger: false,
      }}
    >
      <ProFormGroup title={"Color pattern"}>
        <ProFormSwitch name={"enableDomainColor"} label='Enable' colSize={1}/>
        <ProFormSwitch name={"forceRefreshDomainColor"} label='Force'/>
      </ProFormGroup>
      <ProFormGroup title={"Image Classification"}>
        <ProFormSwitch name={"enableImageClassification"} label='Enable'/>
        <ProFormSwitch name={"forceImageClassification"} label='Force'/>
      </ProFormGroup>
      <ProFormGroup title={"NSFW"}>
        <ProFormSwitch name={"enableNsfwCheck"} label='Enable'/>

        <ProFormSwitch name={"forceNsfwCheck"} label='Force'/>
      </ProFormGroup>
      <ProFormGroup title={"Deepdanbooru"}>
        <ProFormSwitch name={"enableDeepdanbooruCheck"} label='Enable'/>
        <ProFormSwitch name={"forceDeepdanbooruCheck"} label='Force'/>
      </ProFormGroup>
      <ProFormGroup title={"Tagger"}>
        <ProFormSwitch name={"enableTagger"} label='Enable'/>
        <ProFormSwitch name={"forceTagger"} label='Force'/>
      </ProFormGroup>
    </ModalForm>
  )
}
export default ScanOptionDialog
