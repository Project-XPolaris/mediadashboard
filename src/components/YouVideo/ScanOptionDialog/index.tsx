import {Form} from "antd";
import {ModalForm, ProFormSelect, ProFormSwitch} from "@ant-design/pro-components";
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
      <ProFormSwitch name={"directoryMode"} label='Directory mode'/>
      <ProFormSelect mode='tags' name={'excludeDir'} label={'Exclude directory name'}/>
    </ModalForm>
  )
}
export default ScanOptionDialog
