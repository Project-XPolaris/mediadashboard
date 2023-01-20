import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";
import {GenerateVideoMetaTaskOutput} from "@/services/youvideo/task";

export type YouVideoGenerateMetaTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouVideoGenerateMetaTaskItem = ({task, className}: YouVideoGenerateMetaTaskItemProps) => {
  const output = task.output as GenerateVideoMetaTaskOutput
  const getPercent = () => {
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>GenerateMeta({output.id})</div>
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
export default YouVideoGenerateMetaTaskItem
