import {Form} from "antd";
import {ModalForm, ProFormSwitch} from "@ant-design/pro-components";
import React from "react";

export type ScanOptionFormValues = {
  force: boolean
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
      <ProFormSwitch name={"force"} label='Force generate thumbnails'/>
    </ModalForm>
  )
}
export default ScanOptionDialog
