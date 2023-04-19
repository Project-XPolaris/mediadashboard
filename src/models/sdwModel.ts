import {useState} from "react";
import {fetchProgress} from "@/services/youphoto/sdw";
import {Form} from "antd";

const sdwModel = () => {
  const [form] = Form.useForm();
  const [progress, setProgress] = useState<YouPhotoAPI.SDWProgress | undefined>()
  const [open, setOpen] = useState<boolean>(false)
  const refreshProgress = async () => {
    const progressResponse = await fetchProgress()
    if (progressResponse) {
      if (progressResponse.success && progressResponse.data) {
        setProgress(progressResponse.data)
      }
    }
  }
  const applyPrompt = async (prompt: string) => {
    if (form) {
      form.setFieldValue('prompt', prompt)
    }
  }
  return {
    form, refreshProgress,progress, open, setOpen,applyPrompt
  }
}
export default sdwModel
