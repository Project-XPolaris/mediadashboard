import {Drawer} from "antd";
import {ProTable} from "@ant-design/pro-components";

export type BatchEditDrawerProps = {
  open?: boolean
}
const BatchEditDrawer = ({open}: BatchEditDrawerProps) => {
  return (
    <Drawer open={open} title={"Batch edit"}>
      <ProTable>

      </ProTable>
    </Drawer>
  )
}
export default BatchEditDrawer
