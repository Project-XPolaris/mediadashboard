import {fetchTaskList} from "@/services/youvideo/task";
import moment, {Moment} from "moment";
import {fetchYouPhotoTaskList} from "@/services/youphoto/task";
import {fetchYouMusicTaskList} from "@/services/youmusic/task";
import {fetchYouComicTaskList} from "@/services/youcomic/task";
import {useState} from "react";
import {getYouComicConfig, getYouMusicConfig, getYouPhotoConfig, getYouVideoConfig} from "@/utils/config";

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
  'YouComic/RemoveEmptyTagTask' | string
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
    if (!getYouComicConfig()) {
      return
    }
    let list: TaskItem[] = []
    const youcomicTask = await fetchYouComicTaskList()
    if (!youcomicTask.data) {
      return
    }
    youcomicTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouComic',
        type: YouComicTaskTypeMapping[item.type] ?? 'YouComic/' + item.type,
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
    if (!getYouVideoConfig()) {
      return
    }
    let list: TaskItem[] = []
    const youvideoTask = await fetchTaskList()
    if (!youvideoTask.data) {
      return
    }
    youvideoTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouVideo',
        type: YouVideoTaskTypeMapping[item.type] ?? 'YouVideo/' + item.type,
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
    if (!getYouPhotoConfig()) {
      return
    }
    let list: TaskItem[] = []
    const youphotoTask = await fetchYouPhotoTaskList()
    if (!youphotoTask.data) {
      return
    }
    youphotoTask.data.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouPhoto',
        type: YouPhotoTaskTypeMapping[item.type] ?? 'YouPhoto/' + item.type,
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
    if (!getYouMusicConfig()) {
      return
    }
    let list: TaskItem[] = []
    const youmusicTask = await fetchYouMusicTaskList()
    youmusicTask.tasks.forEach(item => {
      list.push({
        id: item.id,
        source: 'YouMusic',
        type: YouMusicTaskTypeMapping[item.type] ?? 'YouMusic/' + item.type,
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
