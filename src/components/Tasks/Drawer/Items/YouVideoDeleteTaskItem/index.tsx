import {TaskItem} from "@/components/Tasks/Drawer/model";
import {DeleteLibraryTaskOutput} from "@/services/youvideo/task";
import styles from "./styles.less";
import {Tag, Typography} from "antd";

export type YouVideoDeleteTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouVideoDeleteTaskItem = ({task, className}: YouVideoDeleteTaskItemProps) => {
  const output = task.output as DeleteLibraryTaskOutput
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Delete Library({output.id})</div>
        <Tag color={"red"} className={styles.tag}>YouVideo</Tag></div>
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
export default YouVideoDeleteTaskItem
