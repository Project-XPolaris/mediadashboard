import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouComicWriteMetaTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouComicWriteMetaTaskItem = ({task, className}: YouComicWriteMetaTaskItemProps) => {
  const output = task.output as YouComicAPI.WriteMetaTaskOutput
  const getPercent = () => {
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Write meta</div>
        <Tag color={"red"} className={styles.tag}>YouComic</Tag></div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
      <div>
        {output.currentBook}
      </div>
    </div>
  )
}
export default YouComicWriteMetaTaskItem
