import { useEffect, useState, useRef, useCallback } from 'react';
import type { ReactElement } from 'react';
import style from './style.less';
import {
  Button,
  Checkbox, Divider,
  Input,
  List,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ModalProps } from 'antd';
import { useDebounce } from 'ahooks';
import AddIcon from '@ant-design/icons/PlusOutlined';
import { generateId } from '@/utils/id';
import {PlusOutlined} from "@ant-design/icons/lib";
import {matchTagWithName, getLLMTagHistory, type LLMTagHistoryItem} from "@/services/youcomic/tag";

const { TabPane } = Tabs;

export interface MatchTagDialogProps {
  onMatchOk: (title: string | undefined, tags: YouComicAPI.MatchTag[]) => void;
  text?: string;
}

const tagColorMapping = {
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
const MatchTagDialog = ({
  onMatchOk,
  text = '',
  ...props
}: MatchTagDialogProps & ModalProps): ReactElement => {
  const [value, setValue] = useState(text);
  const [matchTags, setMatchTags] = useState<YouComicAPI.MatchTag[]>([]);
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [selectText, setSelectText] = useState<string>();
  const [addRegexValue, setAddRegexValue] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialized = useRef<boolean>(false);
  const [historyData, setHistoryData] = useState<LLMTagHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historyTotal, setHistoryTotal] = useState<number>(0);

  const getSavePattern = (): string[] => {
    const rawJson = localStorage.getItem("save_pattern")
    if (!rawJson) {
      return []
    }
    return JSON.parse(rawJson)
  }
  const [regexPatterns,setRegexPatterns] = useState<string[]>(getSavePattern())
  const matchText = useDebounce(value);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isInitialized.current = false;
    };
  }, []);

  // 加载历史记录（只显示与当前文本相关的）
  const loadHistoryData = useCallback(async (search: string, page: number) => {
    if (!value.trim()) {
      setHistoryData([]);
      setHistoryTotal(0);
      return;
    }
    
    setHistoryLoading(true);
    try {
      const response = await getLLMTagHistory({
        page: page,
        pageSize: 5, // 减少每页数量
        search: search // 使用当前输入文本作为搜索条件
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
  }, [value]);

  // 当输入文本变化时，重新加载相关历史记录
  useEffect(() => {
    if (value.trim()) {
      setHistoryPage(1);
      loadHistoryData(value.trim(), 1);
    } else {
      setHistoryData([]);
      setHistoryTotal(0);
    }
  }, [value, loadHistoryData]);

  // 监听text prop变化，更新内部value状态
  useEffect(() => {
    if (text !== undefined && text !== value) {
      setValue(text);
    }
  }, [text, value]);

  const pickUpWithType = (type: string, tags: YouComicAPI.MatchTag[]): YouComicAPI.MatchTag | undefined => {
    // 优先级：llm > ai > database
    let tag = tags.find(it => it.type === type && it.source === 'llm');
    if (tag) {
      return tag;
    }
    tag = tags.find(it => it.type === type && it.source === 'ai');
    if (tag) {
      return tag;
    }
    tag = tags.find(it => it.type === type && it.source === 'database');
    return tag;
  };
  const refreshPickUp = (tags: YouComicAPI.MatchTag[]) => {
    const pickupType: string[] = ['artist', 'name', 'series', 'theme', 'translator', 'type', 'lang', 'magazine', 'societies', 'chapter', 'chapter_number'];
    const pickUpIds: string[] = [];
    for (const typeString of pickupType) {
      const tag = pickUpWithType(typeString, tags);
      if (tag) {
        pickUpIds.push(tag.id);
      }
    }
    setSelectIds(pickUpIds);
  };
  const refreshMatchResult = useCallback(async (inputText: string, forceReprocess: boolean = false) => {
    // 如果文本为空，不进行请求
    if (!inputText || inputText.trim().length === 0) {
      return;
    }

    // 如果有进行中的请求，先取消它（但首次初始化时不取消）
    if (abortControllerRef.current && isInitialized.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isInitialized.current = true;

    setLoading(true);
    try {
      const result = await matchTagWithName(inputText, true, undefined, controller.signal, forceReprocess);
      
      // 检查是否已被取消
      if (controller.signal.aborted) {
        return;
      }
      
      setMatchTags(result);
      refreshPickUp(result);
    } catch (error: any) {
      // 检查是否是用户主动取消
      if (error.name === 'AbortError' || controller.signal.aborted) {
        console.log('用户取消了标签匹配请求');
        return; // 用户取消不显示错误消息
      }
      console.error('匹配标签失败:', error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  // 取消当前请求
  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    message.info('已取消标签匹配请求喵～');
  };
  const onAddCustom = () => {
    setMatchTags([
      ...matchTags,
      {
        id: generateId(7),
        name: '',
        type: '',
        source: 'custom',
      },
    ]);
  };
  useEffect(() => {
    // 只有当 matchText 有值时才进行请求
    const handler = setTimeout(() => {
      if (matchText && matchText.trim().length > 0) {
        refreshMatchResult(matchText);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [matchText, refreshMatchResult]);
  const getSelectTag = () => {
    const selectTags: YouComicAPI.MatchTag[] = [];
    for (const selectId of selectIds) {
      const selectTag = matchTags.find(it => it.id === selectId);
      if (selectTag) {
        selectTags.push(selectTag);
      }
    }
    return selectTags;
  };
  const onModalOk = () => {
    let selectTags: YouComicAPI.MatchTag[] = getSelectTag();
    let title: string | undefined = undefined;
    const titleTag = selectTags.find(it => it.type === 'name');
    if (titleTag) {
      title = titleTag.name;
    }
    selectTags = selectTags.filter(it => it.type !== 'name');
    onMatchOk(title, selectTags);
  };
  const renderDesc = (tag: YouComicAPI.MatchTag) => {
    if (tag.source === 'raw' || tag.source === 'custom') {
      const onSelectChange = (type: string) => {
        setMatchTags(
          matchTags.map(it => {
            if (it.id === tag.id) {
              return {
                ...it,
                type,
              };
            }
            return {
              ...it,
            };
          }),
        );
      };
      return (
        <div>
          <Select
            size="small"
            className={style.selectType}
            onChange={onSelectChange}
            value={tag.type}
          >
            <Select.Option value={'artist'}>artist</Select.Option>
            <Select.Option value={'series'}>series</Select.Option>
            <Select.Option value={'theme'}>theme</Select.Option>
            <Select.Option value={'translator'}>translator</Select.Option>
            <Select.Option value={'name'}>name</Select.Option>
            <Select.Option value={'type'}>type</Select.Option>
            <Select.Option value={'lang'}>lang</Select.Option>
            <Select.Option value={'magazine'}>magazine</Select.Option>
            <Select.Option value={'societies'}>societies</Select.Option>
            <Select.Option value={'chapter'}>chapter</Select.Option>
            <Select.Option value={'chapter_number'}>chapter_number</Select.Option>
          </Select>
          | raw
        </div>
      );
    }
    return (
      <div>
        <Typography.Text strong>{tag.type}</Typography.Text> | {tag.source}
      </div>
    );
  };
  const getCheckboxDisable = (tag: YouComicAPI.MatchTag) => {
    return (tag.source === 'raw' || tag.source === 'custom') && tag.type.length === 0;
  };
  const onCheckChange = (id: string, isChecked: boolean) => {
    let newIds = selectIds;
    if (isChecked) {
      newIds = [...newIds.filter(it => it !== id), id];
    } else {
      newIds = newIds.filter(it => it !== id);
    }
    setSelectIds(newIds);
  };
  const renderSelectedTag = (tag: YouComicAPI.MatchTag) => {
    let color = tagColorMapping[tag.type as keyof typeof tagColorMapping];
    if (!color) {
      color = 'green';
    }
    const onDelete = () => {
      onCheckChange(tag.id, false);
    };
    return (
      <div className={style.tag} key={tag.id}>
        <Tag color={color} onClose={onDelete} closable>{`${tag.type}: ${tag.name}`}</Tag>
      </div>
    );
  };
  const onChangeTagName = (id: string, name: string) => {
    setMatchTags(
      matchTags.map(it => {
        if (it.id === id) {
          return {
            ...it,
            name,
          };
        }
        return {
          ...it,
        };
      }),
    );
  };
  const onQuickAdd = (type: string) => {
    if (!selectText) {
      return;
    }
    const id = generateId(7);
    setMatchTags([
      ...matchTags,
      {
        id,
        name: selectText,
        type,
        source: 'custom',
      },
    ]);
    setSelectIds([...selectIds, id]);
  };
  const onAddRegex  = () => {
    console.log(addRegexValue)
    localStorage.setItem("save_pattern",JSON.stringify([
      addRegexValue,
      ...regexPatterns
    ]))
    setRegexPatterns(getSavePattern())
  }
  const onRegexChange = (regex: string) => {
    if (regex === 'no') {
      // 如果选择"Not use"，重新获取原始匹配结果
      refreshMatchResult(value);
      return;
    }
    
    const regexp = new RegExp(regex)
    const result = regexp.exec(value)
    const newRegexTags: YouComicAPI.MatchTag[] = []
    const selectTags: string[] = [...selectIds]
    
    if (result?.groups) {
      Object.getOwnPropertyNames(result.groups).forEach(it => {
        const id = generateId(7)
        newRegexTags.push({
          id,
          name: result.groups![it],
          type: it,
          source: 'custom',
        },)
        selectTags.push(id)
      })
    }
    
    // 移除之前的正则匹配结果，保留其他来源的标签
    const filteredTags = matchTags.filter(tag => tag.source !== 'custom' || !tag.id.startsWith('regex_'))
    // 给新的正则标签添加特殊前缀以便识别
    const taggedRegexTags = newRegexTags.map(tag => ({
      ...tag,
      id: 'regex_' + tag.id
    }))
    
    setMatchTags([...filteredTags, ...taggedRegexTags])
    setSelectIds(selectTags)
  }

  // 直接添加/移除历史记录中的特定标签
  const toggleHistoryTagSelection = (historyId: number, tagIndex: number, tagItem: {name: string, type: string}) => {
    const tagKey = `${tagItem.type}-${tagItem.name}`;
    
    // 检查标签是否已存在于当前匹配标签中
    const existingTagIndex = matchTags.findIndex(matchTag => 
      `${matchTag.type}-${matchTag.name}` === tagKey
    );
    
    if (existingTagIndex >= 0) {
      // 如果标签已存在，则移除
      const existingTag = matchTags[existingTagIndex];
      setMatchTags(matchTags.filter(t => t.id !== existingTag.id));
      setSelectIds(selectIds.filter(id => id !== existingTag.id));
      message.info(`移除标签: ${tagItem.type}: ${tagItem.name} 喵～`);
    } else {
      // 如果标签不存在，则添加
      const newTag: YouComicAPI.MatchTag = {
        id: generateId(7),
        name: tagItem.name,
        type: tagItem.type,
        source: 'llm'
      };
      
      setMatchTags([...matchTags, newTag]);
      setSelectIds([...selectIds, newTag.id]);
      message.success(`添加标签: ${tagItem.type}: ${tagItem.name} 喵～`);
    }
  };
  
  // 检查某个历史记录标签是否已被添加到当前标签列表
  const isHistoryTagAdded = (ht: {name: string, type: string}) => {
    const tagKey = `${ht.type}-${ht.name}`;
    return matchTags.some(mt => `${mt.type}-${mt.name}` === tagKey);
  };



  // 加载更多历史记录
  const loadMoreHistory = () => {
    if (historyLoading || historyData.length >= historyTotal) {
      return;
    }
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    loadHistoryData(value.trim(), nextPage);
  };
  return (
    <Modal title={'匹配标签'} {...props} className={style.root} onOk={onModalOk} width="80vw" centered>
      <Spin spinning={loading} tip="正在匹配标签...">
        <div className={style.inputContainer}>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            onSelect={e => {
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              if (start && end) {
                setSelectText(e.currentTarget.value.substring(start, end));
              }
            }}
            style={{ flex: 1 }}
          />
          <Button 
            type="default"
            onClick={() => refreshMatchResult(value, true)}
            disabled={loading || !value.trim()}
            size="small"
            className={style.reprocessButton}
          >
            重新识别
          </Button>
          {loading && (
            <Button 
              type="default" 
              danger 
              onClick={cancelRequest}
              size="small"
              className={style.cancelButton}
            >
              取消
            </Button>
          )}
        </div>
      <Select
        style={{width:"100%",marginTop:8,position:'sticky'}}
        defaultActiveFirstOption={true} onSelect={onRegexChange}
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Input
                placeholder="Please enter item"
                onChange={(e) => setAddRegexValue(e.currentTarget.value)}
              />
              <Button type="text" icon={<PlusOutlined />} onClick={onAddRegex}>
                Add item
              </Button>
            </Space>
          </>
        )}
      >
        <Select.Option value={'no'}>Not use</Select.Option>
        {
          regexPatterns.map((it,idx) => {
            return (
              <Select.Option value={it} key={idx}>{it}</Select.Option>
            )
          })
        }
      </Select>

      <div className={style.label}>
        <Typography.Text strong>快速添加</Typography.Text>
      </div>
      <div className={style.quickAction}>
        {selectText}
        {selectText && (
          <div className={style.actions}>
            <Space>
              <Button size="small" onClick={() => onQuickAdd('name')}>
                as Name
              </Button>
              <Button size="small" onClick={() => onQuickAdd('artist')}>
                as Artist
              </Button>
              <Button size="small" onClick={() => onQuickAdd('theme')}>
                as Theme
              </Button>
              <Button size="small" onClick={() => onQuickAdd('series')}>
                as Series
              </Button>
              <Button size="small" onClick={() => onQuickAdd('translator')}>
                as Translator
              </Button>
              <Button size="small" onClick={() => onQuickAdd('type')}>
                as Type
              </Button>
              <Button size="small" onClick={() => onQuickAdd('lang')}>
                as Lang
              </Button>
              <Button size="small" onClick={() => onQuickAdd('chapter')}>
                as Chapter
              </Button>
              <Button size="small" onClick={() => onQuickAdd('chapter_number')}>
                as Chapter Number
              </Button>
              <Button size="small" onClick={() => onQuickAdd('societies')}>
                as Societies
              </Button>
            </Space>
          </div>
        )}
      </div>
      <div className={style.root}>
        <div className={style.left}>
            <Tabs defaultActiveKey="1">
              {/* LLM 标签页 - 仅在有数据时显示 */}
              {matchTags.filter(it => it.source === 'llm').length > 0 && (
                <TabPane tab="LLM 🤖" key="1">
                  <List
                    className={style.list}
                    dataSource={matchTags.filter(
                      it => it.source === 'llm',
                    )}
                    renderItem={item => (
                      <List.Item>
                        <Checkbox
                          disabled={getCheckboxDisable(item)}
                          className={style.checkbox}
                          checked={Boolean(selectIds.find(it => it === item.id))}
                          onChange={e => {
                            onCheckChange(item.id, e.target.checked);
                          }}
                        />
                        <List.Item.Meta title={item.name} description={renderDesc(item)} />
                      </List.Item>
                    )}
                  />
                </TabPane>
              )}
              {/* AI 标签页 - 仅在有数据时显示 */}
              {matchTags.filter(it => it.source === 'ai').length > 0 && (
                <TabPane tab="AI" key="2">
                  <List
                    className={style.list}
                    dataSource={matchTags.filter(
                      it => it.source === 'ai',
                    )}
                    renderItem={item => (
                      <List.Item>
                        <Checkbox
                          disabled={getCheckboxDisable(item)}
                          className={style.checkbox}
                          checked={Boolean(selectIds.find(it => it === item.id))}
                          onChange={e => {
                            onCheckChange(item.id, e.target.checked);
                          }}
                        />
                        <List.Item.Meta title={item.name} description={renderDesc(item)} />
                      </List.Item>
                    )}
                  />
                </TabPane>
              )}
              {/* 匹配标签页 - 仅在有数据时显示 */}
              {matchTags.filter(it => it.source === 'pattern' || it.source === 'database').length > 0 && (
                <TabPane tab="匹配" key="3">
                  <List
                    className={style.list}
                    dataSource={matchTags.filter(
                      it => it.source === 'pattern' || it.source === 'database',
                    )}
                    renderItem={item => (
                      <List.Item>
                        <Checkbox
                          disabled={getCheckboxDisable(item)}
                          className={style.checkbox}
                          checked={Boolean(selectIds.find(it => it === item.id))}
                          onChange={e => {
                            onCheckChange(item.id, e.target.checked);
                          }}
                        />
                        <List.Item.Meta title={item.name} description={renderDesc(item)} />
                      </List.Item>
                    )}
                  />
                </TabPane>
              )}
              {/* 潜在标签页 - 仅在有数据时显示 */}
              {matchTags.filter(it => it.source === 'raw').length > 0 && (
                <TabPane tab="潜在" key="4">
                  <List
                    className={style.list}
                    dataSource={matchTags.filter(it => it.source === 'raw')}
                    renderItem={item => (
                      <List.Item>
                        <Checkbox
                          disabled={getCheckboxDisable(item)}
                          className={style.checkbox}
                          checked={Boolean(selectIds.find(it => it === item.id))}
                          onChange={e => {
                            onCheckChange(item.id, e.target.checked);
                          }}
                        />
                        <List.Item.Meta title={item.name} description={renderDesc(item)} />
                      </List.Item>
                    )}
                  />
                </TabPane>
              )}
              {/* 自定义标签页 - 始终显示，因为有添加功能 */}
              <TabPane tab="自定义" key="5">
                <List
                  className={style.list}
                  dataSource={matchTags.filter(it => it.source === 'custom')}
                  renderItem={item => (
                    <List.Item>
                      <Checkbox
                        disabled={getCheckboxDisable(item)}
                        className={style.checkbox}
                        checked={Boolean(selectIds.find(it => it === item.id))}
                        onChange={e => {
                          onCheckChange(item.id, e.target.checked);
                        }}
                      />
                      <List.Item.Meta
                        title={
                          <Input
                            placeholder={'输入标签'}
                            onChange={e => onChangeTagName(item.id, e.target.value)}
                            value={item.name}
                          />
                        }
                        description={renderDesc(item)}
                      />
                    </List.Item>
                  )}
                />
                <Button icon={<AddIcon />} onClick={onAddCustom}>
                  添加
                </Button>
              </TabPane>
              {/* 文本替换标签页 - 仅在有数据时显示（与潜在使用相同数据源） */}
              {matchTags.filter(it => it.source === 'raw').length > 0 && (
                <TabPane tab="文本替换" key="6">
                  <List
                    className={style.list}
                    dataSource={matchTags.filter(it => it.source === 'raw')}
                    renderItem={item => (
                      <List.Item>
                        <Checkbox
                          disabled={getCheckboxDisable(item)}
                          className={style.checkbox}
                          checked={Boolean(selectIds.find(it => it === item.id))}
                          onChange={e => {
                            onCheckChange(item.id, e.target.checked);
                          }}
                        />
                        <List.Item.Meta title={item.name} description={renderDesc(item)} />
                      </List.Item>
                    )}
                  />
                </TabPane>
              )}
              {/* LLM历史记录标签页 */}
              <TabPane tab={`相关历史 (${historyTotal})`} key="7">
                <div className={style.historyContainer}>
                  {historyTotal > 0 ? (
                    <>
                      <div className={style.historyHeader}>
                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                          找到 {historyTotal} 条相关历史记录，点击标签直接添加到当前标签列表
                        </Typography.Text>
                      </div>
                      <div className={style.historyList} style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {historyData.map(history => (
                          <div key={history.id} className={style.historyItem}>
                            <div className={style.historyMeta}>
                              <div className={style.historyInfo}>
                                <Typography.Text strong style={{ fontSize: '13px' }}>
                                  {history.originalText}
                                </Typography.Text>
                                <Typography.Text type="secondary" style={{ fontSize: '11px', marginLeft: '8px' }}>
                                  {history.modelName} · {history.processingTimeMs}ms · 用了{history.usageCount}次
                                </Typography.Text>
                              </div>
                            </div>
                            <div className={style.historyTags} style={{ marginTop: '6px' }}>
                              {history.results.map((result, idx) => {
                                const isAdded = isHistoryTagAdded(result);
                                return (
                                  <Tag 
                                    key={`${history.id}-${result.type}-${result.name}-${idx}`}
                                    color={isAdded ? 'green' : (tagColorMapping[result.type as keyof typeof tagColorMapping] || 'default')}
                                    style={{ 
                                      cursor: 'pointer',
                                      marginBottom: '4px',
                                      border: isAdded ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                      fontWeight: isAdded ? 'bold' : 'normal',
                                      opacity: isAdded ? 0.8 : 1
                                    }}
                                    onClick={() => toggleHistoryTagSelection(history.id, idx, result)}
                                  >
                                    {result.type}: {result.name}
                                    {isAdded && ' ✓'}
                                  </Tag>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      {historyData.length < historyTotal && (
                        <div className={style.loadMoreContainer}>
                          <Button 
                            onClick={loadMoreHistory}
                            loading={historyLoading}
                            size="small"
                            type="dashed"
                            block
                          >
                            加载更多 ({historyData.length}/{historyTotal})
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                      <Typography.Text type="secondary">
                        {value.trim() ? '没有找到相关的历史记录喵～' : '请输入文本以查看相关历史记录'}
                      </Typography.Text>
                    </div>
                  )}
                </div>
              </TabPane>
          </Tabs>
        </div>
        <div className={style.right}>
          <div className={style.label}>
            <Typography.Text strong>原始名称</Typography.Text>
          </div>
          <Typography.Text>{text}</Typography.Text>
          <div className={style.label}>
            <Typography.Text strong>使用的标签</Typography.Text>
          </div>
          <div>
            {getSelectTag().map(it => {
              return renderSelectedTag(it);
            })}
          </div>
        </div>
      </div>
      </Spin>
    </Modal>
  );
};
export default MatchTagDialog;
