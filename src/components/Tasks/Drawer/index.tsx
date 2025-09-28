import {Divider, Drawer, Switch, Space, Typography} from "antd";
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
import TaskViewer from "@/components/TaskViewer";
import {useState, Fragment, useEffect} from "react";
import YouPhotoLoraTrainTaskItem from "@/components/Tasks/Drawer/Items/YouPhotoLoraTrainTaskItem";

const { Text } = Typography;

export type  TaskDrawerProps = {
  open?: boolean
  onClose?: () => void

}
const TaskDrawer = ({open, onClose}: TaskDrawerProps) => {
  const model = useTaskModel()
  const [currentTask, setCurrentTask] = useState<TaskItem | undefined>()
  const [autoRefresh, setAutoRefresh] = useState<boolean>(() => {
    // 从本地存储读取用户偏好，默认开启
    const saved = localStorage.getItem('task-auto-refresh')
    return saved !== null ? JSON.parse(saved) : true
  })

  // 保存用户偏好到本地存储
  useEffect(() => {
    localStorage.setItem('task-auto-refresh', JSON.stringify(autoRefresh))
  }, [autoRefresh])

  useRequest(model.fetchYouComicTasks, {
    pollingInterval: autoRefresh ? 1000 : undefined,
    retryCount: 3
  });
  useRequest(model.fetchYouVideoTasks, {
    pollingInterval: autoRefresh ? 1000 : undefined,
    retryCount: 3
  })
  useRequest(model.fetchYouPhotoTasks, {
    pollingInterval: autoRefresh ? 1000 : undefined,
    retryCount: 3
  })
  useRequest(model.fetchYouMusicTasks, {
    pollingInterval: autoRefresh ? 1000 : undefined,
    retryCount: 3
  })
  const onTaskClick = (task: TaskItem) => {
    setCurrentTask(task)
  }
  const renderItem = (item: TaskItem) => {
    switch (item.type) {
      case 'YouVideo/ScanTask':
        return <><div onClick={() => onTaskClick(item)}><YouVideoScanTaskItem task={item} className={styles.item} key={item.id}/></div> <Divider/></>
      case 'YouVideo/SyncIndexTask':
        return <><YouVideoSyncIndexTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case 'YouVideo/DeleteTask':
        return <><YouVideoDeleteTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case 'YouVideo/MetaTask':
        return <><YouVideoGenerateMetaTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouPhoto/DeleteTask":
        return <><YouPhotoDeleteTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouPhoto/ScanTask":
        return <><div onClick={() => onTaskClick(item)}><YouPhotoScanTaskItem task={item} className={styles.item} key={item.id}/></div><Divider/></>
      case "YouPhoto/LoraTrain":
        return <><YouPhotoLoraTrainTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouMusic/ScanTask":
        return <><YouMusicScanTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/ScanTask":
        return <><YouComicScanTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/MatchTagTask":
        return <><YouComicMatchTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/DeleteTask":
        return <><YouComicDeleteTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/GenerateThumbnailTask":
        return <><YouComicGenerateThumbnailTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/MoveBookTask":
        return <><YouComicMoveBookItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case "YouComic/WriteBookMetaTask":
        return <><YouComicWriteMetaTaskItem task={item} className={styles.item} key={item.id}/><Divider/></>
      case 'YouComic/RemoveEmptyTagTask':
        return <><YouComicRemoveEmptyTaskItem task={item} className={styles.item} key={item.id}/></>
    }
    return <><div>{item.type}</div><Divider/></>
  }
  return (
    <Drawer
      title={
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>任务列表</Text>
          <Space>
            <Text>自动刷新</Text>
            <Switch 
              checked={autoRefresh} 
              onChange={setAutoRefresh}
              size="small"
            />
          </Space>
        </Space>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      visible={open}
      width={400}
    >
      {
        currentTask && <TaskViewer
          taskId={currentTask?.id}
          open={Boolean(currentTask)}
          onClose={() => setCurrentTask(undefined)}
          service={currentTask?.type.split('/')[0]}
        />
      }
      {
        model.taskList()?.map(it => {
          return <Fragment key={it.id}>{renderItem(it)}</Fragment>
        })
      }
    </Drawer>
  );
}
export default TaskDrawer
