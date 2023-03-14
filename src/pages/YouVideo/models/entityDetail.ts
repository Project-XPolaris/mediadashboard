import {fetchEntity} from "@/services/youvideo/entity";
import {message} from "antd";
import {useState} from "react";

const entityDetailModel = () => {
  const [entity, setEntity] = useState<YouVideoAPI.Entity | undefined>();
  const loadData = async ({id}: { id: number }) => {
    const response = await fetchEntity(
      id
    )
    if (!response.success) {
      message.error(response.err)
      return
    }
    const entity = response.data
    if (!entity) {
      message.error("entity is null")
      return
    }
    setEntity(entity)
  }
  const getEntityName = () => {
    if (!entity) {
      return ""
    }
    return entity.name
  }

  return {
    entity,
    loadData,
    getEntityName
  }
}
export default entityDetailModel
