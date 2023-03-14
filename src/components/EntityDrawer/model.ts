import {useState} from "react";
import {fetchEntity} from "@/services/youvideo/entity";
import {message} from "antd";

export type EditableVideo = YouVideoAPI.Video & {

}
const UseEntityDrawerModel = () => {
  const [entity, setEntity] = useState<YouVideoAPI.Entity | undefined>();
  const [editableVideoList, setEditableVideoList] = useState<EditableVideo[]>([])
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
    setEditableVideoList(entity.videos.map(video => {
      return {
        ...video,
      }
    }));
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
    getEntityName,
    setEntity,
    setEditableVideoList,
    editableVideoList,
  }
}
export default UseEntityDrawerModel
