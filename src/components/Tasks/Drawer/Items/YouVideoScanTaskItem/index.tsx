import {TaskItem} from "@/components/Tasks/Drawer/model";
import {ScanLibraryTaskOutput} from "@/services/youvideo/task";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouVideoScanTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouVideoScanTaskItem = ({task, className}: YouVideoScanTaskItemProps) => {
  const output = task.output as ScanLibraryTaskOutput
  const getPercent = () => {
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Scan({output.id})</div>
        <Tag color={"red"} className={styles.tag}>YouVideo</Tag></div>
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
export default YouVideoScanTaskItem
