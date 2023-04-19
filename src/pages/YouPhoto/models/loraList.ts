import {useState} from "react";
import {deleteLoraConfig, fetchLoraConfigList, saveLoraConfig} from "@/services/youphoto/lora";
import {message} from "antd";
import {LoraTrainConfig, TrainConfigValues} from "@/components/YouPhoto/LoraConfigDrawer";

const loraListModel = () => {
  const [configList, setConfigList] = useState<YouPhotoAPI.LoraConfig[]>([])
  const refreshList = async () => {
    try {
      const response = await fetchLoraConfigList()
      if (response?.success && response.data) {
        setConfigList(response.data)
      } else {
        message.error("Failed to fetch lora config list")
      }
    } catch (e) {
      message.error("Failed to fetch lora config list")
    }

  }
  const saveConfig = async (name:string,config: LoraTrainConfig) => {
    try {
      const saveResponse = await saveLoraConfig({
        name:name,
        config: JSON.stringify(config)
      })
      if (saveResponse?.success) {
        message.success("Lora config saved")
        await refreshList()
      }
    }catch (e) {
      message.error("Failed to save lora config")
    }
  }
  const deleteConfig = async(id:number) => {
    try {
      const deleteResponse = await deleteLoraConfig({id})
      if (deleteResponse?.success) {
        message.success("Lora config deleted")
        await refreshList()
      }
    }catch (e) {
      message.error("Failed to delete lora config")
    }
  }
  return {
    refreshList,configList,saveConfig,deleteConfig
  }
}
export default loraListModel
