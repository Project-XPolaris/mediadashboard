import { ReactElement, useEffect, useState } from 'react';
import style from './style.less';
import {
  Button,
  Checkbox, Divider,
  Input,
  List,
  Modal,
  ModalProps,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useDebounce } from 'ahooks';
import AddIcon from '@ant-design/icons/PlusOutlined';
import { generateId } from '@/utils/id';
import {PlusOutlined} from "@ant-design/icons/lib";
import {matchTagWithName} from "@/services/youcomic/tag";

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
  const getSavePattern = ():[] => {
    const rawJson = localStorage.getItem("save_pattern")
    if (!rawJson) {
      return []
    }
    return JSON.parse(rawJson)
  }
  const [regexPatterns,setRegexPatterns] = useState<[]>(getSavePattern())
  const matchText = useDebounce(value);

  const pickUpWithType = (type: string, tags: YouComicAPI.MatchTag[]): YouComicAPI.MatchTag | undefined => {
    let tag = tags.find(it => it.type === type && it.source === 'pattern');
    if (tag) {
      return tag;
    }
    tag = tags.find(it => it.type === type && it.source === 'database');
    return tag;
  };
  const refreshPickUp = (tags: YouComicAPI.MatchTag[]) => {
    const pickupType: string[] = ['artist', 'name', 'series', 'theme', 'translator'];
    const pickUpIds: string[] = [];
    for (let typeString of pickupType) {
      const tag = pickUpWithType(typeString, tags);
      if (tag) {
        pickUpIds.push(tag.id);
      }
    }
    setSelectIds(pickUpIds);
  };
  const refreshMatchResult = async (text: string) => {
    const result = await matchTagWithName(text);
    setMatchTags(result);
    refreshPickUp(result);
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
    refreshMatchResult(matchText);
  }, [matchText]);
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
            className={style.selectType}
            onChange={onSelectChange}
            value={tag.type}
          >
            <Select.Option value={'artist'}>artist</Select.Option>
            <Select.Option value={'series'}>series</Select.Option>
            <Select.Option value={'theme'}>theme</Select.Option>
            <Select.Option value={'translator'}>translator</Select.Option>
            <Select.Option value={'name'}>name</Select.Option>
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
    let color = tagColorMapping[tag.type];
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
    setMatchTags([])
    const regexp = new RegExp(regex)
    const result = regexp.exec(value)
    const matchTags:Array<YouComicAPI.MatchTag> = []
    const selectTags:Array<string> = [...selectIds]
    if (result?.groups) {
      Object.getOwnPropertyNames(result.groups).forEach(it => {
        const id = generateId(7)
        matchTags.push({
          id,
          name: result.groups![it],
          type: it,
          source: 'custom',
        },)
        selectTags.push(id)
      })
    }
    setMatchTags(matchTags)
    setSelectIds(selectTags)
  }
  return (
    <Modal title={'匹配标签'} {...props} className={style.root} onOk={onModalOk} width={720}>
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
      />
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
            </Space>
          </div>
        )}
      </div>
      <div className={style.root}>
        <div className={style.left}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="匹配" key="1">
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
            <TabPane tab="潜在" key="2">
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
            <TabPane tab="自定义" key="3">
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
            <TabPane tab="文本替换" key="4">
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
    </Modal>
  );
};
export default MatchTagDialog;
