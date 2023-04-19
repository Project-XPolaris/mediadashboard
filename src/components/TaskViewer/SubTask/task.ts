import {Task} from "@/services/types";
import CreateVideoSubtaskRender from "@/components/TaskViewer/SubTask/CreateVideo";
import CreateImageSubtaskRender from "@/components/TaskViewer/SubTask/CreateImage";

export type SubTaskRender<T> = {
  service: string
  type: string
  title: (task: Task<T>) => string
  description?: (task: Task<T>) => string
}
const defaultRender: SubTaskRender<any> = {
  service: "",
  type: "",
  title: (task: Task<any>) => {
    return task.type
  },
  description: undefined

}
const RenderMapping = {
  "YouVideo/CreateVideo": CreateVideoSubtaskRender,
  "YouPhoto/CreateImage": CreateImageSubtaskRender
}

const GetRender = (service: string, type: string): SubTaskRender<any> => {
  const renderPath = `${service}/${type}`
  const render = RenderMapping[renderPath]
  if (render) {
    return render
  }
  return defaultRender

}
export default GetRender
