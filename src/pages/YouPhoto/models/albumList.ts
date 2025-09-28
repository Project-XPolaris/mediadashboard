import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { 
  Album, 
  fetchAlbumList, 
  createAlbum, 
  deleteAlbum, 
  updateAlbumName,
  addTagsToAlbum 
} from '@/services/youphoto/album';

const albumListModel = () => {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const refresh = useCallback(async (currentPage?: number, currentPageSize?: number, nameSearch?: string) => {
    setLoading(true);
    try {
      const targetPage = currentPage ?? page;
      const targetPageSize = currentPageSize ?? pageSize;
      const response = await fetchAlbumList({
        page: targetPage,
        pageSize: targetPageSize,
        nameSearch
      });
      // console.log('Album List Response:', response);
      
      if (response.success) {
        // 响应结构: { success: true, result: Album[], count: number, page: number, pageSize: number }
        setAlbumList(response.result || []);
        setTotal(response.count || 0);
        setPage(targetPage);
        setPageSize(targetPageSize);
      }
    } catch (error) {
      console.error('Album List Error:', error);
      message.error('获取相册列表失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const create = useCallback(async (name: string) => {
    try {
      const response = await createAlbum({ name });
      if (response.success) {
        message.success('创建相册成功');
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      message.error('创建相册失败');
      return false;
    }
  }, [refresh]);

  const remove = useCallback(async (id: number, deleteImage: boolean = false) => {
    try {
      const response = await deleteAlbum({ id, deleteImage });
      if (response.success) {
        message.success('删除相册成功');
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      message.error('删除相册失败');
      return false;
    }
  }, [refresh]);

  const updateName = useCallback(async (id: number, name: string) => {
    try {
      const response = await updateAlbumName({ id, name });
      if (response.success) {
        message.success('更新相册名称成功');
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      message.error('更新相册名称失败');
      return false;
    }
  }, [refresh]);

  const addTags = useCallback(async (albumId: number, tagNames: string[]) => {
    try {
      const response = await addTagsToAlbum({ albumId, tagNames });
      if (response.success) {
        message.success('添加标签成功');
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      message.error('添加标签失败');
      return false;
    }
  }, [refresh]);

  // 自动加载数据
  useEffect(() => {
    refresh();
  }, []);

  return {
    albumList,
    loading,
    total,
    page,
    pageSize,
    refresh,
    create,
    remove,
    updateName,
    addTags,
  };
};

export default albumListModel;
