import {fetchTaskList} from "@/services/youvideo/task";
import moment, {Moment} from "moment";
import {fetchYouPhotoTaskList} from "@/services/youphoto/task";
import {fetchYouMusicTaskList} from "@/services/youmusic/task";
import {fetchYouComicTaskList} from "@/services/youcomic/task";
import {useState} from "react";

export type TaskType =
  "YouVideo/ScanTask" |
  'YouVideo/SyncIndexTask' |
  'YouVideo/DeleteTask' |
  'YouVideo/MetaTask' |
  'YouPhoto/DeleteTask' |
  'YouPhoto/ScanTask' |
  'YouMusic/ScanTask' |
  'YouComic/ScanTask' |
  'YouComic/MatchTagTask' |
  'YouComic/DeleteTask' |
  'YouComic/GenerateThumbnailTask' |
  'YouComic/MoveBookTask' |
  'YouComic/WriteBookMetaTask' |
  'YouComic/RemoveEmptyTagTask'
export type TaskItem = {
  id: string;
  type: TaskType;
  source: string;
  status: string;
  output: any
  time: Moment
}
export type TaskList = {
  YouComic: TaskItem[]
  YouVideo: TaskItem[]
  YouPhoto: TaskItem[]
  YouMusic: TaskItem[]
}
export const YouVideoTaskTypeMapping = {
  'ScanLibrary': 'YouVideo/ScanTask',
  'SyncIndex': 'YouVideo/SyncIndexTask',
  'RemoveLibrary': 'YouVideo/DeleteTask',
  'Meta': 'YouVideo/MetaTask'
}
export const YouPhotoTaskTypeMapping = {
  'RemoveLibrary': 'YouPhoto/DeleteTask',
  'ScanLibrary': 'YouPhoto/ScanTask',
}
export const YouMusicTaskTypeMapping = {
  'ScanLibrary': 'YouMusic/ScanTask',
}
export const YouComicTaskTypeMapping = {
  'ScanLibrary': 'YouComic/ScanTask',
  'MatchTag': 'YouComic/MatchTagTask',
  'RemoveLibrary': 'YouComic/DeleteTask',
  'GenerateThumbnail': 'YouComic/GenerateThumbnailTask',
  'MoveBookTask': 'YouComic/MoveBookTask',
  'WriteBookMeta': 'YouComic/WriteBookMetaTask',
  'RemoveEmptyTag': 'YouComic/RemoveEmptyTagTask',
}
const useTaskModel = () => {
  const [tasks, setTasks] = useState<TaskList>({
    YouComic: [],
    YouVideo: [],
    YouPhoto: [],
    YouMusic: [],
  })
  const fetchYouComicTasks = async () => {
    let list: TaskItem[] = []
    const youcomicTask = await fetchYouComicTaskList()
    youcomicTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouComic',
        type: YouComicTaskTypeMapping[item.type],
        status: item.status,
        output: item.output,
        time: moment(item.created)
      })
    })
    setTasks({
      ...tasks,
      YouComic: list
    })
  }
  const fetchYouVideoTasks = async () => {
    let list: TaskItem[] = []
    const youvideoTask = await fetchTaskList()
    youvideoTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouVideo',
        type: YouVideoTaskTypeMapping[item.type],
        status: item.status,
        output: item.output,
        time: moment(item.created)
      })
    })
    setTasks({
      ...tasks,
      YouVideo: list
    })
  }
  const fetchYouPhotoTasks = async () => {
    let list: TaskItem[] = []
    const youphotoTask = await fetchYouPhotoTaskList()
    youphotoTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouPhoto',
        type: YouPhotoTaskTypeMapping[item.type],
        status: item.status,
        output: item.output,
        time: moment(item.created)
      })
    })
    setTasks({
      ...tasks,
      YouPhoto: list
    })
  }
  const fetchYouMusicTasks = async () => {
    let list: TaskItem[] = []
    const youmusicTask = await fetchYouMusicTaskList()
    youmusicTask.tasks.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouMusic',
        type: YouMusicTaskTypeMapping[item.type],
        status: item.status,
        output: item.output,
        time: moment(item.created)
      })
    })
    setTasks({
      ...tasks,
      YouMusic: list
    })
  }
  const taskList = (): TaskItem[] => {
    let list: TaskItem[] = [
      ...tasks.YouComic,
      ...tasks.YouVideo,
      ...tasks.YouPhoto,
      ...tasks.YouMusic
    ]

    // sort by create
    list = list.sort((a, b) => {
      return b.time.valueOf() - a.time.valueOf()
    })
    return list
  }
  return {
    taskList, fetchYouComicTasks, fetchYouVideoTasks, fetchYouMusicTasks, fetchYouPhotoTasks
  }
}
export default useTaskModel
