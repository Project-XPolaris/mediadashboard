import {SubTaskRender} from "@/components/TaskViewer/SubTask/task";
import {CreateImageOutput} from "@/services/youphoto/task";

const CreateImageSubtaskRender :SubTaskRender<CreateImageOutput> ={
  type: 'CreateImage',
  service:"YouPhoto",
  title:(rec) => {
    return `Image Video ${rec.output.filename}`
  },
  description:(rec) => {
    return `${rec.output.filePath}`
  }
}
export default CreateImageSubtaskRender
