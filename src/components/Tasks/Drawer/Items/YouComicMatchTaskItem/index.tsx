import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouComicMatchTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouComicMatchTaskItem = ({task, className}: YouComicMatchTaskItemProps) => {
  const output = task.output as YouComicAPI.MatchTagTaskOutput
  const getPercent = () => {
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Match({output.libraryId})</div>
        <Tag color={"red"} className={styles.tag}>YouComic</Tag></div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
      <div>
        {output.currentDir}
      </div>
    </div>
  )
}
export default YouComicMatchTaskItem
