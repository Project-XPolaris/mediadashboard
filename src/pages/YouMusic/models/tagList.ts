import { useState } from 'react';
import { fetchTagList } from '@/services/youmusic/tag';
import { DataPagination } from '@/utils/page';

export type TagItem = YouMusicAPI.Tag;

const tagListModel = () => {
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);

  const loadData = async ({
    page = pagination,
    search,
  }: {
    page?: DataPagination;
    search?: string;
  } = {}) => {
    setLoading(true);
    try {
      const response = await fetchTagList({
        page: page.page,
        pageSize: page.pageSize,
        search,
        withMusicCount: true, // 请求时包含音乐数量
      });

      if (response?.data) {
        setTagList(response.data);
        setPagination({
          page: page.page,
          pageSize: page.pageSize,
          total: response.count,
        });
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData({ page: pagination });
  };

  const handleSearch = (searchText: string) => {
    loadData({
      page: { ...pagination, page: 1 },
      search: searchText,
    });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      page,
      pageSize: pageSize || pagination.pageSize,
    };
    loadData({ page: newPagination });
  };

  const selectTag = (tag: TagItem) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const selectAllTags = () => {
    if (selectedTags.length === tagList.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags([...tagList]);
    }
  };

  const clearSelection = () => {
    setSelectedTags([]);
  };

  return {
    tagList,
    pagination,
    loading,
    selectedTags,
    loadData,
    refreshData,
    handleSearch,
    handlePageChange,
    selectTag,
    selectAllTags,
    clearSelection,
  };
};

export default tagListModel;
