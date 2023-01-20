import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from "@/components/Tasks/Drawer/Items/YouPhotoDeleteTaskItem/style.less";
import {Tag, Typography} from "antd";

export type YouPhotoDeleteTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouPhotoDeleteTaskItem = ({task, className}: YouPhotoDeleteTaskItemProps) => {
  const output = task.output as YouComicAPI.RemoveLibraryTaskOutput
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Delete Library({output.libraryId})</div>
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
export default YouPhotoDeleteTaskItem
