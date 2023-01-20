import {Modal, Progress} from "antd";

export type UpdateProcessDialogProps = {
  open?: boolean
  success: number
  current: number
  name: string
  total: number
}
const UpdateProcessDialog = ({open, total, current, name, success}: UpdateProcessDialogProps) => {
  return (
    <Modal open={open} footer={null} closable={false} maskClosable={false} title={"Updating"}>
      <Progress
        percent={(current / total) * 100}
        success={{percent: (success / total) * 100}}
      />
      <div>
        {name}
      </div>
    </Modal>
  )
}
export default UpdateProcessDialog
