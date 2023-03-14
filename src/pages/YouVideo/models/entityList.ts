import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {applyEntityInfoFromSource, batchEntity, fetchEntityList, updateEntity} from "@/services/youvideo/entity";
import {YouVideoConfig} from "@/models/appsModel";
import {getYouVideoConfig} from "@/utils/config";
import {fetchLibraryList, Library} from "@/services/youvideo/library";
import {getOrderQueryParam} from "@/utils/param";
import {message} from "antd";
export type EntityItem = {
  edit?: {
    name?: string,
  }
} & YouVideoAPI.Entity
export type EntityFilter = {
  library?: number,
  name?:string
}
const entityListModel = () => {
  const [entityList, setEntityList] = useState<EntityItem[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0
  })
  const [libraryList, setLibraryList] = useState<Library[]>([])
  const [selectedEntity, setSelectedEntity] = useState<EntityItem[]>([])
  const [filter, setFilter] = useState<EntityFilter>({})
  const [order, setOrder] = useState<string>("iddesc")
  const loadData = async (
    {
      page = pagination,
      paramFilter = filter,
      queryOrder = order
    }: {
      page?: DataPagination,
      paramFilter?: EntityFilter,
      queryOrder?:string
    }) => {
    const response = await fetchEntityList({
      page: page.page,
      pageSize: page.pageSize,
      order: getOrderQueryParam(queryOrder),
      search:paramFilter.name,
      library:paramFilter.library,
    })
    const dataList  = response.data
    if (!dataList){
      return
    }
    if (dataList.result) {
      const config: YouVideoConfig | null = getYouVideoConfig()
      if (config === null) {
        return
      }
      const newList = dataList.result
      newList.forEach((entity) => {
        if (entity.cover) {
          entity.cover = config.baseUrl + entity.cover
        }
      })
      setEntityList(dataList.result)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: dataList.count
      })
    }
  }
  const loadLibrary = async () => {
    const response = await fetchLibraryList()
    if (!response.success) {
      message.error(response.err)
    }
    if (response.data) {
        setLibraryList(response.data.result)
    }
  }
  const applyFromSource = async (entityId: number, source: string, sourceId: string) => {
    await applyEntityInfoFromSource(entityId, source, sourceId)
    await loadData({})
  }
  const deleteSelected = async () => {
    if (!selectedEntity){
      return
    }
    const ids = selectedEntity.map((entity) => entity.id)
    await batchEntity({
      deleteIds: ids
    })
    await loadData({})
  }
  const updateFilter = async (newFilter: EntityFilter) => {
    setFilter(newFilter)
    await loadData({paramFilter: newFilter})
  }
  const uploadOrder = async (newOrder: string) => {
    setOrder(newOrder)
    await loadData({queryOrder: newOrder})
  }
  const setEditFieldValue = (id:number, field: string, value: any) => {
    const newList = entityList.map((entity) => {
      if (entity.id === id){
        entity.edit = entity.edit || {}
        entity.edit[field] = value
      }
      return entity
    })
    setEntityList(newList)

  }
  const saveChanges = async () => {
    const changedEntities = entityList.filter((entity) => entity.edit)
    for (let changedEntity of changedEntities) {
      await updateEntity(
        changedEntity.id,
        {
          name: changedEntity.edit?.name
        }
      )
    }
    await loadData({})
  }
  const hasChangeItem = () => entityList.some((entity) => entity.edit)
  const clearChanges = () => {
    const newList = entityList.map((entity) => {
      entity.edit = undefined
      return entity
    })
    setEntityList(newList)
  }
  return {
    entityList,
    loadData,
    pagination,
    applyFromSource,
    setSelectedEntity,
    selectedEntity,
    deleteSelected,
    loadLibrary,
    libraryList,
    updateFilter,
    order,
    uploadOrder,
    setEditFieldValue,
    saveChanges,
    hasChangeItem,
    clearChanges
  }
}
export default entityListModel
