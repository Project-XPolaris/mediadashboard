import {fetchBookList, queryPages, analyzeBookFolder, AnalyzeBookFolderResponse, MatchTagResult} from "@/services/youcomic/book";
import {useState} from "react";
import {message} from "antd";

const bookDetailModel = () => {
  const [bookDetail, setBookDetail] = useState<YouComicAPI.Book | undefined>(undefined);
  const [activeKey, setActiveKey] = useState<string>("base")
  const [bookPagePageSize, setBookPagePageSize] = useState<number>(10)
  const [bookPageCurrent, setBookPageCurrent] = useState<number>(1)
  const [bookPageTotal, setBookPageTotal] = useState<number>(0)
  const [bookPageList, setBookPageList] = useState<YouComicAPI.Page[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBookFolderResponse | undefined>(undefined);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [llmMatchTags, setLlmMatchTags] = useState<YouComicAPI.MatchTag[]>([]);
  const initBookPageData = async (
    id: string, {page = bookPageCurrent, pageSize = bookPagePageSize}: {
      page: number,
      pageSize: number
    }
  ) => {
    const resp = await queryPages({
      book: id,
      pageSize: pageSize,
      page: bookPageCurrent
    })
    if (resp.result) {
      setBookPageList(resp.result)
      setBookPageTotal(resp.count)
      setBookPageCurrent(pageSize)
      setBookPageCurrent(page)
    }
  }

  const pageUpdate = async (id: string, {page = bookPageCurrent, pageSize = bookPagePageSize}: {
    page: number,
    pageSize: number
  }) => {
    await initBookPageData(id, {page, pageSize})
  }


  const initData = async (id: string) => {
    if (bookDetail !== undefined && bookDetail.id.toString() === id) {
      return
    }
    const resp = await fetchBookList({
      id: id,
      page_size: 1
    })
    if (resp.result) {
      setBookDetail(resp.result[0])
    }
    await initBookPageData(id, {page: 1, pageSize: 20})

  }

  // 转换MatchTagResult为YouComicAPI.MatchTag格式
  const convertToMatchTags = (matchTags: MatchTagResult[]): YouComicAPI.MatchTag[] => {
    return matchTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      type: tag.type,
      source: tag.source as any
    }));
  };

  const analyzeFolderName = async (updateFields?: string[]) => {
    if (!bookDetail) {
      message.error('书籍信息不存在');
      return undefined;
    }
    
    setAnalysisLoading(true);
    try {
      const result = await analyzeBookFolder(bookDetail.id, { updateFields });
      setAnalysisResult(result);
      
      if (result.success) {
        // 转换并设置LLM匹配标签
        const convertedTags = convertToMatchTags(result.matchTags);
        setLlmMatchTags(convertedTags);
        
        message.success(result.message);
        // 如果有更新字段，重新加载书籍信息
        if (updateFields && updateFields.length > 0) {
          await initData(bookDetail.id.toString());
        }
      } else {
        message.error(result.message);
        setLlmMatchTags([]);
      }
      
      return result;
    } catch (error: any) {
      console.error('LLM分析失败:', error);
      message.error('LLM分析失败: ' + (error.message || '未知错误'));
      setLlmMatchTags([]);
      return undefined;
    } finally {
      setAnalysisLoading(false);
    }
  }
  return {
    initData,
    bookDetail,
    activeKey,
    setActiveKey,
    bookPagePageSize,
    setBookPagePageSize,
    bookPageCurrent,
    setBookPageCurrent,
    bookPageTotal,
    setBookPageTotal,
    bookPageList,
    setBookPageList,
    pageUpdate,
    analyzeFolderName,
    analysisResult,
    analysisLoading,
    setAnalysisResult,
    llmMatchTags,
    setLlmMatchTags
  }
}

export default bookDetailModel
