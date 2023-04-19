import {SubTaskRender} from "@/components/TaskViewer/SubTask/task";
import {CreateVideoOutput} from "@/services/youvideo/task";

const CreateVideoSubtaskRender :SubTaskRender<CreateVideoOutput> ={
  type: 'CreateVideo',
  service:"YouVideo",
  title:(rec) => {
    return `Create Video ${rec.output.filename}`
  },
  description:(rec) => {
    return `${rec.output.path}`
  }
}
export default CreateVideoSubtaskRender
