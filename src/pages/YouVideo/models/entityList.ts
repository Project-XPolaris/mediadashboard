import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {applyEntityInfoFromSource, batchEntity, fetchEntityList} from "@/services/youvideo/entity";
import {YouVideoConfig} from "@/models/appsModel";
import {getYouVideoConfig} from "@/utils/config";
import {fetchLibraryList, Library} from "@/services/youvideo/library";
import {getOrderQueryParam} from "@/utils/param";
export type EntityItem = {} & YouVideoAPI.Entity
export type EntityFilter = {
  library?: number,
  name?:string
}
const entityListModel = () => {
  const [entityList, setEntityList] = useState<YouVideoAPI.Entity[]>([]);
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
    if (response?.result) {
      const config: YouVideoConfig | null = getYouVideoConfig()
      if (config === null) {
        return
      }
      const newList = response.result
      newList.forEach((entity) => {
        if (entity.cover) {
          entity.cover = config.baseUrl + entity.cover
        }
      })
      setEntityList(response.result)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: response.count
      })
    }
  }
  const loadLibrary = async () => {
    const response = await fetchLibraryList()
    if (response?.result) {
      setLibraryList(response.result)
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
    uploadOrder
  }
}
export default entityListModel
