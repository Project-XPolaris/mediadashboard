import {useState} from "react";
import {batchTag, fetchTagList, mergeTags, newCleanEmptyTagTask} from "@/services/youcomic/tag";
import {DataPagination} from "@/utils/page";
import {message} from "antd";
export interface TagFilter {
  orders: { orderKey: string; order: 'asc' | 'desc' }[];
  nameSearch?: string;
  type?: string | string[];
}

const TagListModel = () => {
  const [tags, setTags] = useState<YouComicAPI.Tag[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1, pageSize: 20, total: 0
  })
  const [filter, setFilter] = useState<TagFilter>({
    orders: [],
    type: [],
  })
  const [selectTagIds, setSelectTagIds] = useState<number[]>([])
  const loadData = async (
    {
      queryPagination = pagination,
      queryFilter = filter
    }:{
      queryPagination?:DataPagination,
      queryFilter?:TagFilter
    }
  ) => {
    const response = await fetchTagList({
      page:queryPagination.page,
      page_size:queryPagination.pageSize,
      order:
        queryFilter.orders.length > 0
          ? queryFilter.orders
            .map((item: any) => `${item.order === 'asc' ? '' : '-'}${item.orderKey}`)
            .join(',')
          : '-id',
      nameSearch: queryFilter.nameSearch,
      type: queryFilter.type,
    })
    if (response.result) {
      setTags(response.result)
      setPagination({
        page: queryPagination.page,
        pageSize: queryPagination.pageSize,
        total: response.count
      })
    }
  }
  const updateFilter = async (newFilter: TagFilter) => {
    setFilter(newFilter)
    await loadData({queryPagination: pagination,queryFilter:newFilter})
  }
  const clearEmpty = async () => {
    await newCleanEmptyTagTask()
    await loadData({queryPagination: pagination,queryFilter:filter})
  }
  const deleteSelectedTags = async () => {
    await batchTag({deleteIds: selectTagIds})
    await loadData({})
  }
  const mergeSelectTags = async (to:number) => {
    if (selectTagIds.length === 0){
      return
    }
    for (let selectTagId of selectTagIds) {
      if (selectTagId === to) {
        continue
      }
      await mergeTags({from: selectTagId, to})
    }
    message.success('merge success')
  }
  return {
    loadData,
    tags,
    pagination,
    filter,
    updateFilter,
    clearEmpty,
    selectTagIds,
    setSelectTagIds,
    deleteSelectedTags,
    mergeSelectTags
  }
}
export default TagListModel
