import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from "@/components/Tasks/Drawer/Items/YouPhotoDeleteTaskItem/style.less";
import {Progress, Tag} from "antd";

export type YouPhotoDeleteTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouPhotoDeleteTaskItem = ({task, className}: YouPhotoDeleteTaskItemProps) => {
  const output = task.output as YouPhotoAPI.DeleteLibraryTaskOutput
  const getPercent = () => {
    if (output.total === 0 && output.current === 0) {
      return 100
    }
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Delete({output.name})</div>
        <Tag color={"green"} className={styles.tag}>YouPhoto</Tag></div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
    </div>
  )
}
export default YouPhotoDeleteTaskItem
