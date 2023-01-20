import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Progress, Tag} from "antd";

export type YouComicRemoveEmptyTagTaskTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouComicRemoveEmptyTagTaskTaskItem = ({task, className}: YouComicRemoveEmptyTagTaskTaskItemProps) => {
  const output = task.output as YouComicAPI.RemoveEmptyTaskOutput
  const getPercent = () => {
    if (output.total === 0) {
      return 0
    }
    return Math.floor(output.current / output.total * 100)
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>Remove empty tags</div>
        <div>
          <Tag color={"red"} className={styles.tag}>YouComic</Tag>
        </div>
      </div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.current}/{output.total}
        </div>
      </div>
    </div>
  )
}
export default YouComicRemoveEmptyTagTaskTaskItem
