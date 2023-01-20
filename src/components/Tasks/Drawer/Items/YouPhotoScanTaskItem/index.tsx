import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouPhotoScanTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouPhotoScanTaskItem = ({task, className}: YouPhotoScanTaskItemProps) => {
  const output = task.output as YouPhotoAPI.ScanLibraryTaskOutput
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
        <div className={styles.title}>Scan({output.name})</div>
        <Tag color={"green"} className={styles.tag}>YouPhoto</Tag></div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
      <div>
        {output.currentName}
      </div>
    </div>
  )
}
export default YouPhotoScanTaskItem
