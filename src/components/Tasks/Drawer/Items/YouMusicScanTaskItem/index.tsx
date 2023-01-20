import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouMusicScanTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouMusicScanTaskItem = ({task, className}: YouMusicScanTaskItemProps) => {
  const output = task.output as YouMusicAPI.ScanLibraryTaskOutput
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
        <div className={styles.title}>Scan</div>
        <Tag color={"pink"} className={styles.tag}>YouMusic</Tag></div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
    </div>
  )
}
export default YouMusicScanTaskItem
