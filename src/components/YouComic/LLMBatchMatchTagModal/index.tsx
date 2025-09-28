import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Modal,
  Button,
  Input,
  Space,
  Tag,
  Checkbox,
  Typography,
  Spin,
  message,
  Card,
  Avatar,
  Empty,
  Radio
} from 'antd';
import {BookOutlined, RobotOutlined, CheckOutlined, HistoryOutlined} from '@ant-design/icons';
import {batchMatchTagWithName, getLLMTagHistory, type LLMTagHistoryItem, matchTagWithName} from '@/services/youcomic/tag';
import { useDebounce } from 'ahooks';
import styles from './style.less';

const {TextArea} = Input;
const {Title, Text} = Typography;

export interface LLMBatchMatchTagModalProps {
  visible: boolean;
  onClose: () => void;
  books: YouComicAPI.Book[];
  onOk: (results: {id: number, title: string, tags: YouComicAPI.MatchTag[]}[]) => void;
}

interface BookMatchResult {
  book: YouComicAPI.Book;
  tags: (YouComicAPI.MatchTag & { selected: boolean })[];
  processing: boolean;
}

const tagColorMapping: Record<string, string> = {
  name: 'red',
  artist: 'orange',
  series: 'lime',
  theme: 'blue',
  translator: 'purple',
  type: 'cyan',
  lang: 'magenta',
  magazine: 'yellow',
  societies: 'volcano',
  chapter: 'geekblue',
  chapter_number: 'gold',
};

const LLMBatchMatchTagModal: React.FC<LLMBatchMatchTagModalProps> = ({
  visible,
  onClose,
  books,
  onOk
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [results, setResults] = useState<BookMatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'setup' | 'history' | 'processing' | 'results'>('setup');
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    processed: number;
  }>({ current: 0, total: 0, processed: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<'batch' | 'sequential'>('batch');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const pauseResolverRef = useRef<(() => void) | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const [forceReprocess, setForceReprocess] = useState<boolean>(false);
  // 历史记录相关状态
  const [historyData, setHistoryData] = useState<LLMTagHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historySearchText, setHistorySearchText] = useState<string>('');
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historyTotal, setHistoryTotal] = useState<number>(0);
  const [selectedHistories, setSelectedHistories] = useState<Record<number, number[]>>({});
  const debouncedHistorySearch = useDebounce(historySearchText, { wait: 300 });

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 同步状态到ref，供循环内读取最新值
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);

  // 加载历史记录
  const loadHistoryData = useCallback(async (search: string, page: number) => {
    setHistoryLoading(true);
    try {
      const response = await getLLMTagHistory({
        page: page,
        pageSize: 10,
        search: search
      });
      
      if (page === 1) {
        setHistoryData(response.data);
      } else {
        setHistoryData(prev => [...prev, ...response.data]);
      }
      setHistoryTotal(response.count);
    } catch (error) {
      console.error('加载历史记录失败:', error);
      message.error('加载历史记录失败喵～');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // 首次加载历史记录
  useEffect(() => {
    loadHistoryData('', 1);
  }, [loadHistoryData]);

  // 搜索历史记录
  useEffect(() => {
    setHistoryPage(1);
    loadHistoryData(debouncedHistorySearch, 1);
  }, [debouncedHistorySearch, loadHistoryData]);

  // 重置状态
  const resetState = () => {
    // 如果有正在进行的请求，先取消它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setResults([]);
    setIsProcessing(false);
    setCurrentStep('setup');
    setCustomPrompt('');
    setBatchProgress({ current: 0, total: 0, processed: 0 });
    setSelectedHistories({});
    setHistorySearchText('');
    setHistoryPage(1);
    setMode('batch');
    setIsPaused(false);
    setCurrentIndex(0);
    pauseResolverRef.current = null;
    setForceReprocess(false);
  };

  // 加载更多历史记录
  const loadMoreHistory = () => {
    if (historyLoading || historyData.length >= historyTotal) {
      return;
    }
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    loadHistoryData(historySearchText, nextPage);
  };

  // 选择历史记录应用到书籍
  const toggleHistoryForBook = (bookId: number, historyId: number) => {
    setSelectedHistories(prev => {
      const bookSelections = prev[bookId] || [];
      const newSelections = bookSelections.includes(historyId)
        ? bookSelections.filter(id => id !== historyId)
        : [...bookSelections, historyId];
      
      return {
        ...prev,
        [bookId]: newSelections
      };
    });
  };

  // 应用选中的历史记录到对应书籍
  const applyHistorySelections = () => {
    const hasSelections = Object.values(selectedHistories).some(selections => selections.length > 0);
    if (!hasSelections) {
      message.warning('请先选择要应用的历史记录喵～');
      return;
    }

    // 初始化结果，包含历史记录应用的结果
    const initialResults: BookMatchResult[] = books.map(book => {
      const bookHistoryIds = selectedHistories[book.id] || [];
      const bookHistories = historyData.filter(h => bookHistoryIds.includes(h.id));
      
      // 合并历史记录的标签
      const mergedTags: (YouComicAPI.MatchTag & { selected: boolean })[] = [];
      const existingTagKeys = new Set<string>();

      bookHistories.forEach(history => {
        history.results.forEach(result => {
          const tagKey = `${result.type}-${result.name}`;
          if (!existingTagKeys.has(tagKey)) {
            existingTagKeys.add(tagKey);
            mergedTags.push({
              id: `history-${history.id}-${result.type}-${result.name}`,
              name: result.name,
              type: result.type,
              source: 'llm',
              selected: true
            });
          }
        });
      });

      return {
        book,
        tags: mergedTags,
        processing: false
      };
    });

    setResults(initialResults);
    setCurrentStep('results');
    
    const totalHistoryTags = initialResults.reduce((sum, result) => sum + result.tags.length, 0);
    message.success(`成功从历史记录中为 ${books.length} 本书应用了 ${totalHistoryTags} 个标签喵～`);
  };

  // 取消当前请求
  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setCurrentStep('setup');
    setBatchProgress({ current: 0, total: 0, processed: 0 });
    message.info('已取消LLM识别请求喵～');
  };

  // 开始LLM识别
  const startLLMRecognition = async () => {
    if (books.length === 0) {
      message.error('没有可处理的书籍喵～');
      return;
    }
    if (mode === 'batch') {
      // 批量模式
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsProcessing(true);
      setCurrentStep('processing');

      const BATCH_SIZE = 20;
      const totalBatches = Math.ceil(books.length / BATCH_SIZE);
      setBatchProgress({ current: 0, total: totalBatches, processed: 0 });

      const initialResults: BookMatchResult[] = books.map(book => ({
        book,
        tags: [],
        processing: true
      }));
      setResults(initialResults);

      try {
        const texts = books.map(book => book.dirName || book.name || `Book ${book.id}`);
        setBatchProgress(prev => ({ ...prev, current: 1 }));
        const batchResults = await batchMatchTagWithName(texts, true, customPrompt, controller.signal, forceReprocess);
        if (controller.signal.aborted) {
          return;
        }
        const updatedResults: BookMatchResult[] = initialResults.map((result, index) => ({
          ...result,
          tags: (batchResults[index]?.result || []).map(tag => ({
            ...tag,
            selected: true
          })),
          processing: false
        }));
        setResults(updatedResults);
        setBatchProgress({ current: totalBatches, total: totalBatches, processed: books.length });
        setCurrentStep('results');
        const batchText = totalBatches > 1 ? `分${totalBatches}批处理` : '批量处理';
        message.success(`成功通过LLM ${batchText}识别了 ${books.length} 个项目的标签，高效又准确喵～`);
      } catch (error: any) {
        if (error.name === 'AbortError' || controller.signal.aborted) {
          return;
        }
        console.error('LLM批量识别失败:', error);
        message.error('LLM识别失败，请检查网络连接喵～');
        setResults(prev => prev.map(result => ({ ...result, processing: false })));
      } finally {
        setIsProcessing(false);
        abortControllerRef.current = null;
      }
    } else {
      // 逐个模式
      await startSequentialRecognition();
    }
  };

  // 逐个识别流程
  async function startSequentialRecognition() {
    setIsProcessing(true);
    isProcessingRef.current = true;
    // 逐个模式直接进入结果页，边处理边填充结果
    setCurrentStep('results');
    setIsPaused(false);
    setBatchProgress({ current: 0, total: 1, processed: currentIndex });

    // 初始化结果（若首次开始）
    if (results.length === 0) {
      const initialResults: BookMatchResult[] = books.map(book => ({
        book,
        tags: [],
        processing: true
      }));
      setResults(initialResults);
    } else {
      // 标记未处理项为 processing
      setResults(prev => prev.map((r, idx) => idx < currentIndex ? r : { ...r, processing: true }));
    }

    for (let i = currentIndex; i < books.length; i++) {
      // 如果暂停，等待恢复
      if (isPausedRef.current) {
        await new Promise<void>((resolve) => {
          pauseResolverRef.current = resolve;
        });
      }

      // 检查是否被停止
      if (!isProcessingRef.current) {
        break;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const book = books[i];
      const text = book.dirName || book.name || `Book ${book.id}`;
      try {
        const singleResult = await matchTagWithName(text, true, customPrompt, controller.signal, forceReprocess);
        if (controller.signal.aborted) {
          break;
        }
        // 写入结果
        const llmOnly = (singleResult || []).filter((t: any) => t && (t.source === 'llm' || t.source === 'ai'));
        setResults(prev => prev.map((r, idx) => idx === i ? ({
          ...r,
          tags: llmOnly.map((tag: any) => ({ ...tag, selected: true })),
          processing: false
        }) : r));
      } catch (error: any) {
        if (error.name === 'AbortError' || controller.signal.aborted) {
          break;
        }
        console.error('LLM单项识别失败:', error);
        message.error(`识别失败：${text}`);
        setResults(prev => prev.map((r, idx) => idx === i ? ({ ...r, processing: false }) : r));
      } finally {
        abortControllerRef.current = null;
        setBatchProgress(prev => ({ ...prev, processed: i + 1 }));
        setCurrentIndex(i + 1);
      }
    }

    setIsProcessing(false);
    isProcessingRef.current = false;
    setCurrentStep('results');
  };

  // 暂停/继续
  const togglePause = () => {
    if (!isProcessing) return;
    if (isPaused) {
      setIsPaused(false);
      if (pauseResolverRef.current) {
        pauseResolverRef.current();
        pauseResolverRef.current = null;
      }
      message.info('已继续识别喵～');
    } else {
      setIsPaused(true);
      message.info('已暂停识别喵～');
    }
  };

  // 停止（结束当前、保留已完成结果并进入结果页）
  const stopSequential = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPaused(false);
    setIsProcessing(false);
    isProcessingRef.current = false;
    setCurrentStep('results');
    message.info('已停止识别并显示阶段性结果喵～');
  };

  // 切换单个标签的选择状态
  const toggleTagSelection = (bookId: number, tagId: string) => {
    setResults(prev => prev.map(result => 
      result.book.id === bookId 
        ? {
            ...result,
            tags: result.tags.map(tag => 
              tag.id === tagId 
                ? {...tag, selected: !tag.selected}
                : tag
            )
          }
        : result
    ));
  };

  // 切换整本书的所有标签选择状态
  const toggleBookAllTags = (bookId: number) => {
    setResults(prev => prev.map(result => {
      if (result.book.id === bookId) {
        const hasUnselected = result.tags.some(tag => !tag.selected);
        return {
          ...result,
          tags: result.tags.map(tag => ({...tag, selected: hasUnselected}))
        };
      }
      return result;
    }));
  };

  // 全选/取消全选所有标签
  const toggleSelectAll = () => {
    const hasAnyUnselected = results.some(result => 
      result.tags.some(tag => !tag.selected)
    );
    
    setResults(prev => prev.map(result => ({
      ...result,
      tags: result.tags.map(tag => ({...tag, selected: hasAnyUnselected}))
    })));
  };

  // 处理确认应用
  const handleConfirmApply = () => {
    const selectedResults = results
      .filter(result => result.tags.some(tag => tag.selected)) // 有选中的标签
      .map(result => {
        const selectedTags = result.tags.filter(tag => tag.selected);
        // 提取标题标签
        const titleTag = selectedTags.find(tag => tag.type === 'name');
        const otherTags = selectedTags.filter(tag => tag.type !== 'name');
        
        return {
          id: result.book.id,
          title: titleTag?.name || result.book.name,
          tags: otherTags.map(tag => ({
            id: tag.id,
            name: tag.name,
            type: tag.type,
            source: tag.source
          }))
        };
      });

    if (selectedResults.length === 0) {
      message.warning('请选择要应用的标签喵～');
      return;
    }

    onOk(selectedResults);
    onClose();
    resetState();
  };

  // 处理取消
  const handleCancel = () => {
    onClose();
    resetState();
  };

  // 渲染设置步骤
  const renderSetupStep = () => (
    <div className={styles.setupContainer}>
      <Title level={4}>
        <RobotOutlined /> LLM智能标签识别配置
      </Title>
      
      <div className={styles.promptSection}>
        <Text strong>自定义提示词（可选）</Text>
        <TextArea
          placeholder="输入自定义提示词，留空将使用默认提示词..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={4}
          className={styles.promptTextArea}
        />
        <Text type="secondary">
          提示：可以使用 {`{{content}}`} 作为文件名的占位符。系统会智能分批处理（每批最多20个），确保高效且稳定的识别效果！
        </Text>
      </div>

      <div style={{ marginTop: 12 }}>
        <Checkbox checked={forceReprocess} onChange={(e) => setForceReprocess(e.target.checked)}>
          不使用缓存结果（强制新识别）
        </Checkbox>
      </div>

      <div style={{ marginTop: 16 }}>
        <Text strong>识别模式</Text>
        <div style={{ marginTop: 8 }}>
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio.Button value="batch">批量（一次性）</Radio.Button>
            <Radio.Button value="sequential">逐个（可暂停/继续）</Radio.Button>
          </Radio.Group>
        </div>
        <Text type="secondary">
          {mode === 'batch' ? '推荐在网络稳定时使用，速度更快。' : '逐个请求接口，可随时暂停和继续，稳定性更好。'}
        </Text>
      </div>

      <div className={styles.bookListSection}>
        <Text strong>待处理的书籍 ({books.length} 项)</Text>
        <div className={styles.bookList}>
          {books.slice(0, 5).map(book => (
            <Card key={book.id} size="small" className={styles.bookPreview}>
              <Card.Meta
                avatar={<Avatar icon={<BookOutlined />} />}
                title={book.dirName || book.name || `书籍 ${book.id}`}
                description={`原始名称 | ID: ${book.id}`}
              />
            </Card>
          ))}
          {books.length > 5 && (
            <Text type="secondary">还有 {books.length - 5} 个项目...</Text>
          )}
        </div>
      </div>

      <div className={styles.actionHint}>
        <Text type="secondary">
          您可以选择直接开始LLM识别，或者先从历史记录中选择已有的识别结果 ♥
        </Text>
      </div>
    </div>
  );

  // 渲染历史记录选择步骤
  const renderHistoryStep = () => (
    <div className={styles.historyContainer}>
      <Title level={4}>
        <HistoryOutlined /> 选择历史识别记录
      </Title>
      
      <div className={styles.historyHeader}>
        <Input.Search
          placeholder="搜索历史记录..."
          value={historySearchText}
          onChange={e => setHistorySearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
        <div className={styles.historyStats}>
          <Text type="secondary">
            共找到 {historyTotal} 条历史记录，已选择 {Object.values(selectedHistories).reduce((sum, selections) => sum + selections.length, 0)} 项
          </Text>
        </div>
      </div>

      <div className={styles.historyList}>
        {historyData.map(history => (
          <Card key={history.id} size="small" className={styles.historyItem}>
            <div className={styles.historyMeta}>
              <div className={styles.historyInfo}>
                <Text strong>{history.originalText}</Text>
                <div className={styles.historyDetails}>
                  <Text type="secondary">
                    模型: {history.modelName} | 用时: {history.processingTimeMs}ms | 使用: {history.usageCount}次
                  </Text>
                </div>
              </div>
              
              <div className={styles.historyTags}>
                {history.results.map((result, idx) => (
                  <Tag 
                    key={`${history.id}-${result.type}-${result.name}-${idx}`}
                    color={tagColorMapping[result.type] || 'default'}
                  >
                    {result.type}: {result.name}
                  </Tag>
                ))}
              </div>
            </div>
            
            <div className={styles.bookSelections}>
              <Text strong>应用到书籍：</Text>
              <div className={styles.bookCheckboxes}>
                {books.map(book => (
                  <Checkbox
                    key={book.id}
                    checked={selectedHistories[book.id]?.includes(history.id) || false}
                    onChange={() => toggleHistoryForBook(book.id, history.id)}
                  >
                    {book.dirName || book.name || `书籍 ${book.id}`}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {historyData.length < historyTotal && (
        <div className={styles.loadMoreContainer}>
          <Button 
            onClick={loadMoreHistory}
            loading={historyLoading}
            type="dashed"
            block
          >
            加载更多 ({historyData.length}/{historyTotal})
          </Button>
        </div>
      )}
    </div>
  );

  // 渲染处理中步骤
  const renderProcessingStep = () => {
    const progressPercentage = batchProgress.total > 0 ? 
      Math.round((batchProgress.current / batchProgress.total) * 100) : 0;
    
    return (
      <div className={styles.processingContainer}>
        <Spin size="large" />
        <Title level={4}>正在使用LLM智能识别标签...</Title>

        {mode === 'batch' ? (
          batchProgress.total > 1 ? (
            <div>
              <Text type="secondary">
                正在分批处理 {books.length} 个项目（每批最多20个）喵～
              </Text>
              <div style={{ margin: '16px 0' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>批次进度：</Text>
                    <Text>{batchProgress.current}/{batchProgress.total} 批</Text>
                  </div>
                  <div style={{ 
                    background: '#f0f0f0', 
                    borderRadius: '4px', 
                    height: '8px', 
                    overflow: 'hidden' 
                  }}>
                    <div 
                      style={{ 
                        background: '#1890ff', 
                        height: '100%', 
                        width: `${progressPercentage}%`,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                  <Text type="secondary">已处理：{progressPercentage}%</Text>
                </Space>
              </div>
            </div>
          ) : (
            <Text type="secondary">正在处理 {books.length} 个项目喵～</Text>
          )
        ) : null}
        
        <div className={styles.processingList}>
          {results.map((result) => (
            <div key={result.book.id} className={styles.processingItem}>
              <Space>
                {result.processing ? (
                  <Spin size="small" />
                ) : (
                  <CheckOutlined style={{color: '#52c41a'}} />
                )}
                <Text>{result.book.dirName || result.book.name || `书籍 ${result.book.id}`}</Text>
                {!result.processing && (
                  <Text type="secondary">({result.tags.length} 个标签)</Text>
                )}
              </Space>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染结果步骤
  const renderResultsStep = () => {
    const totalSelectedTags = results.reduce((count, result) => 
      count + result.tags.filter(tag => tag.selected).length, 0
    );
    const totalTags = results.reduce((count, result) => count + result.tags.length, 0);
    const totalWithTags = results.filter(r => r.tags.length > 0).length;

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <Space>
            <Title level={4}>识别结果 ({totalWithTags} 项有标签)</Title>
            <Button 
              size="small" 
              onClick={toggleSelectAll}
            >
              {results.some(result => result.tags.some(tag => !tag.selected)) ? '全选标签' : '取消全选'}
            </Button>
            <Text type="secondary">已选择标签: {totalSelectedTags}/{totalTags}</Text>
            {mode === 'sequential' && isProcessing && (
              <>
                <Text type="secondary">进度：{currentIndex}/{books.length}</Text>
                <Button size="small" onClick={togglePause}>
                  {isPaused ? '继续' : '暂停'}
                </Button>
                <Button size="small" danger onClick={stopSequential}>
                  停止
                </Button>
              </>
            )}
          </Space>
        </div>

        <div className={styles.resultsList}>
          {results.map((result) => {
            const selectedTagsCount = result.tags.filter(tag => tag.selected).length;
            const hasSelectedTags = selectedTagsCount > 0;
            
            return (
              <Card 
                key={result.book.id} 
                size="small" 
                className={`${styles.resultItem} ${hasSelectedTags ? styles.selected : ''}`}
                title={
                  <Space>
                    <Checkbox
                      indeterminate={selectedTagsCount > 0 && selectedTagsCount < result.tags.length}
                      checked={selectedTagsCount === result.tags.length && result.tags.length > 0}
                      disabled={result.tags.length === 0}
                      onChange={() => toggleBookAllTags(result.book.id)}
                    />
                    <Text strong>{result.book.dirName || result.book.name || `书籍 ${result.book.id}`}</Text>
                    <Text type="secondary">({selectedTagsCount}/{result.tags.length} 个标签)</Text>
                  </Space>
                }
              >
                {result.tags.length > 0 ? (
                  <div className={styles.tagsContainer}>
                    {result.tags.map((tag, index) => (
                      <div key={tag.id || `${result.book.id}-${tag.type}-${tag.name}-${index}`} className={styles.tagItem}>
                        <Checkbox
                          checked={tag.selected}
                          onChange={() => toggleTagSelection(result.book.id, tag.id)}
                        />
                        <Tag 
                          color={tagColorMapping[tag.type] || 'default'}
                          className={styles.selectableTag}
                        >
                          {tag.type}: {tag.name}
                        </Tag>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="未识别到标签" 
                    className={styles.emptyTags}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染底部按钮
  const renderFooter = () => {
    if (currentStep === 'setup') {
      return [
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="history" 
          onClick={() => setCurrentStep('history')}
          disabled={books.length === 0}
          icon={<HistoryOutlined />}
        >
          选择历史记录
        </Button>,
        <Button 
          key="start" 
          type="primary" 
          onClick={startLLMRecognition}
          disabled={books.length === 0}
          icon={<RobotOutlined />}
        >
          开始LLM识别
        </Button>
      ];
    }

    if (currentStep === 'history') {
      const totalSelections = Object.values(selectedHistories).reduce((sum, selections) => sum + selections.length, 0);
      return [
        <Button key="back" onClick={() => setCurrentStep('setup')}>
          返回配置
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          onClick={applyHistorySelections}
          disabled={totalSelections === 0}
          icon={<CheckOutlined />}
        >
          应用历史记录 ({totalSelections} 项)
        </Button>
      ];
    }

    if (currentStep === 'processing') {
      if (mode === 'batch') {
        return [
          <Button key="cancel" onClick={handleCancel} disabled={isProcessing}>
            关闭
          </Button>,
          <Button 
            key="abort" 
            type="primary" 
            danger 
            onClick={cancelRequest}
            disabled={!isProcessing || !abortControllerRef.current}
          >
            取消识别
          </Button>
        ];
      }
      // sequential footer
      return [
        <Button key="close" onClick={handleCancel} disabled={isProcessing}>
          关闭
        </Button>,
        <Button key="pause" onClick={togglePause} disabled={!isProcessing}>
          {isPaused ? '继续' : '暂停'}
        </Button>,
        <Button key="stop" type="primary" danger onClick={stopSequential} disabled={!isProcessing}>
          停止并查看结果
        </Button>
      ];
    }

    if (currentStep === 'results') {
      const selectedTagsCount = results.reduce((count, result) => 
        count + result.tags.filter(tag => tag.selected).length, 0
      );
      const selectedBooksCount = results.filter(result => 
        result.tags.some(tag => tag.selected)
      ).length;
      
      return [
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          onClick={handleConfirmApply}
          disabled={selectedTagsCount === 0}
        >
          应用选中结果 ({selectedBooksCount} 本书, {selectedTagsCount} 个标签)
        </Button>
      ];
    }

    return [];
  };

  return (
    <Modal
      title="LLM智能批量标签识别"
      visible={visible}
      onCancel={handleCancel}
      footer={renderFooter()}
      width={800}
      centered
      maskClosable={false}
      className={styles.modal}
    >
      {currentStep === 'setup' && renderSetupStep()}
      {currentStep === 'history' && renderHistoryStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'results' && renderResultsStep()}
    </Modal>
  );
};

export default LLMBatchMatchTagModal;
