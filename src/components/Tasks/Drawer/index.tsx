import {Divider, Drawer} from "antd";
import useTaskModel, {TaskItem} from "@/components/Tasks/Drawer/model";
import YouVideoScanTaskItem from "@/components/Tasks/Drawer/Items/YouVideoScanTaskItem";
import styles from './styles.less'
import YouVideoSyncIndexTaskItem from "@/components/Tasks/Drawer/Items/YouVideoSyncIndexTaskItem";
import YouVideoDeleteTaskItem from "@/components/Tasks/Drawer/Items/YouVideoDeleteTaskItem";
import YouVideoGenerateMetaTaskItem from "@/components/Tasks/Drawer/Items/YouVideoGenerateMetaTaskItem";
import YouPhotoDeleteTaskItem from "@/components/Tasks/Drawer/Items/YouPhotoDeleteTaskItem";
import YouPhotoScanTaskItem from "@/components/Tasks/Drawer/Items/YouPhotoScanTaskItem";
import {useRequest} from "ahooks";
import YouMusicScanTaskItem from "@/components/Tasks/Drawer/Items/YouMusicScanTaskItem";
import YouComicScanTaskItem from "@/components/Tasks/Drawer/Items/YouComicGenerateThumbnailTaskItem";
import YouComicMatchTaskItem from "@/components/Tasks/Drawer/Items/YouComicMatchTaskItem";
import YouComicDeleteTaskItem from "@/components/Tasks/Drawer/Items/YouComicDeleteTaskItem";
import YouComicGenerateThumbnailTaskItem from "@/components/Tasks/Drawer/Items/YouComicScanTaskItem";
import YouComicMoveBookItem from "@/components/Tasks/Drawer/Items/YouComicMoveBookTaskItem";
import YouComicWriteMetaTaskItem from "@/components/Tasks/Drawer/Items/YouComicWriteMetaTaskItem";
import YouComicRemoveEmptyTaskItem from "@/components/Tasks/Drawer/Items/YouComicRemoveEmptyTaskItem";

export type  TaskDrawerProps = {
  open?: boolean
  onClose?: () => void

}
const TaskDrawer = ({open, onClose}: TaskDrawerProps) => {
  const model = useTaskModel()
  useRequest(model.fetchYouComicTasks, {
    pollingInterval: 1000,
    retryCount:3
  });
  useRequest(model.fetchYouVideoTasks, {
    pollingInterval: 1000,
    retryCount:3
  })
  useRequest(model.fetchYouPhotoTasks, {
    pollingInterval: 1000,
    retryCount:3
  })
  useRequest(model.fetchYouMusicTasks, {
    pollingInterval: 1000,
    retryCount:3
  })
  const renderItem = (item: TaskItem) => {
    switch (item.type) {
      case 'YouVideo/ScanTask':
        return <><YouVideoScanTaskItem task={item} className={styles.item}/> <Divider/></>
      case 'YouVideo/SyncIndexTask':
        return <><YouVideoSyncIndexTaskItem task={item} className={styles.item}/><Divider/></>
      case 'YouVideo/DeleteTask':
        return <><YouVideoDeleteTaskItem task={item} className={styles.item}/><Divider/></>
      case 'YouVideo/MetaTask':
        return <><YouVideoGenerateMetaTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouPhoto/DeleteTask":
        return <><YouPhotoDeleteTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouPhoto/ScanTask":
        return <><YouPhotoScanTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouMusic/ScanTask":
        return <><YouMusicScanTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/ScanTask":
        return <><YouComicScanTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/MatchTagTask":
        return <><YouComicMatchTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/DeleteTask":
        return <><YouComicDeleteTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/GenerateThumbnailTask":
        return <><YouComicGenerateThumbnailTaskItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/MoveBookTask":
        return <><YouComicMoveBookItem task={item} className={styles.item}/><Divider/></>
      case "YouComic/WriteBookMetaTask":
        return <><YouComicWriteMetaTaskItem task={item} className={styles.item}/><Divider/></>
      case 'YouComic/RemoveEmptyTagTask':
        return <><YouComicRemoveEmptyTaskItem task={item} className={styles.item}/><Divider/></>
    }
    return <div>未知任务</div>
  }
  return (
    <Drawer
      title="Task"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={open}
      width={400}
    >
      {
        model.taskList()?.map(it => {
          return renderItem(it)
        })
      }
    </Drawer>
  );
}
export default TaskDrawer
