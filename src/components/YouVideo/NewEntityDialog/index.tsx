import {ModalForm, ProFormText} from "@ant-design/pro-components";
import {ReactElement} from "react";
import {Form} from "antd";

export type NewEntityDialogProps = {
  trigger: ReactElement
  onOk: (values: NewEntityDialogValues) => void
}
export type NewEntityDialogValues = {
  name: string
}
const NewEntityDialog = ({trigger, onOk}: NewEntityDialogProps): ReactElement => {
  const [form] = Form.useForm<NewEntityDialogValues>();
  return (
    <ModalForm<NewEntityDialogValues>
      title="Scan option"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onFinish={async (values) => {
        onOk(values)
        return true;
      }}
    >
      <ProFormText name={"name"} label='Name'/>
    </ModalForm>
  )
}
export default NewEntityDialog
