import {Form} from "antd";
import {ModalForm, ProFormGroup, ProFormSelect, ProFormSwitch} from "@ant-design/pro-components";
import React from "react";

export type ScanOptionFormValues = {
  directoryMode: boolean
  excludeDir: string[]
}
export type ScanOptionDialogProps = {
  trigger: React.ReactElement
  onOk:(values:ScanOptionFormValues) => void
}
const ScanOptionDialog = ({trigger,onOk}: ScanOptionDialogProps) => {
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
    >
      <ProFormGroup title={"Auto create entity"}>
        <ProFormSwitch name={"directoryMode"} label='Directory mode'/>
      </ProFormGroup>
      <ProFormGroup title={"Scanner"}>
        <ProFormSelect mode='tags' name={'excludeDir'} label={'Exclude directory name'} width={"xl"}/>
      </ProFormGroup>
      <ProFormGroup title={"NSFW check"}>
        <ProFormSwitch name={["videoOption","enableNSFWCheck"]} label='Enable'/>
        <ProFormSwitch name={["videoOption","forceNSFWCheck"]} label='Force'/>
      </ProFormGroup>
    </ModalForm>
  )
}
export default ScanOptionDialog
