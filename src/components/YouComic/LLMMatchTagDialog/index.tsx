import React, { ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  List,
  Modal,
  ModalProps,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { generateId } from '@/utils/id';

const { TabPane } = Tabs;

export interface LLMMatchTagDialogProps {
  onMatchOk: (title: string | undefined, tags: YouComicAPI.MatchTag[]) => void;
  text?: string;
  llmTags?: YouComicAPI.MatchTag[]; // LLM分析的标签
}

const tagColorMapping = {
  name: 'red',
  artist: 'orange',
  series: 'lime',
  theme: 'blue',
  translator: 'purple',
};

const LLMMatchTagDialog = ({
  onMatchOk,
  text = '',
  llmTags = [],
  ...props
}: LLMMatchTagDialogProps & ModalProps): ReactElement => {
  const [matchTags, setMatchTags] = useState<YouComicAPI.MatchTag[]>(llmTags);
  const [selectIds, setSelectIds] = useState<string[]>([]);

  // 当LLM标签更新时，更新匹配标签
  useEffect(() => {
    if (llmTags.length > 0) {
      setMatchTags(llmTags);
      // 自动选择LLM分析的标签
      const llmTagIds = llmTags.map(tag => tag.id);
      setSelectIds(llmTagIds);
    }
  }, [llmTags]);

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

  const getSelectTag = () => {
    let selectTags: YouComicAPI.MatchTag[] = [];
    for (let selectId of selectIds) {
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
            onChange={onSelectChange}
            value={tag.type}
            style={{ minWidth: 100 }}
          >
            <Select.Option value={'artist'}>artist</Select.Option>
            <Select.Option value={'series'}>series</Select.Option>
            <Select.Option value={'theme'}>theme</Select.Option>
            <Select.Option value={'translator'}>translator</Select.Option>
            <Select.Option value={'name'}>name</Select.Option>
          </Select>
          | {tag.source}
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
      <div key={tag.id} style={{ marginBottom: 8 }}>
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

  return (
    <Modal 
      title={'LLM智能分析 - 匹配标签'} 
      {...props} 
      onOk={onModalOk} 
      width={720}
      okText="确认更新"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <Typography.Text strong>文件夹名：</Typography.Text>
        <Typography.Text code>{text}</Typography.Text>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="LLM分析" key="1">
              <List
                dataSource={matchTags.filter(it => it.source === 'ai')}
                renderItem={item => (
                  <List.Item>
                    <Checkbox
                      disabled={getCheckboxDisable(item)}
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
            <TabPane tab="自定义" key="2">
              <List
                dataSource={matchTags.filter(it => it.source === 'custom')}
                renderItem={item => (
                  <List.Item>
                    <Checkbox
                      disabled={getCheckboxDisable(item)}
                      checked={Boolean(selectIds.find(it => it === item.id))}
                      onChange={e => {
                        onCheckChange(item.id, e.target.checked);
                      }}
                    />
                    <List.Item.Meta
                      title={
                        <input
                          placeholder={'输入标签'}
                          onChange={e => onChangeTagName(item.id, e.target.value)}
                          value={item.name}
                          style={{ border: '1px solid #d9d9d9', padding: '4px 8px', borderRadius: 4 }}
                        />
                      }
                      description={renderDesc(item)}
                    />
                  </List.Item>
                )}
              />
              <Button onClick={onAddCustom}>
                添加自定义标签
              </Button>
            </TabPane>
          </Tabs>
        </div>
        
        <div style={{ width: 300 }}>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong>原始名称</Typography.Text>
          </div>
          <Typography.Text>{text}</Typography.Text>
          
          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <Typography.Text strong>选择的标签</Typography.Text>
          </div>
          <div>
            {getSelectTag().map(it => {
              return renderSelectedTag(it);
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LLMMatchTagDialog;
