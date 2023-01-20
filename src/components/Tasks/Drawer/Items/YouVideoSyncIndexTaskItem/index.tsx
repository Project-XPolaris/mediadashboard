import {TaskItem} from "@/components/Tasks/Drawer/model";
import {Tag, Typography} from "antd";
import styles from "@/components/Tasks/Drawer/Items/YouVideoScanTaskItem/style.less";

export type YouVideoSyncIndexTaskItemProps = {
  task:TaskItem
  className?: string
}
const YouVideoSyncIndexTaskItem = ({task,className}:YouVideoSyncIndexTaskItemProps) => {
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}> Sync Index </div><Tag color={"red"} className={styles.tag}>YouVideo</Tag>
      </div>
      <div>
        <Typography.Title level={5}>
          {
            task.status
          }
        </Typography.Title>
      </div>
    </div>
  )
}
export default YouVideoSyncIndexTaskItem
