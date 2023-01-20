import {Button, Checkbox, Divider, Drawer, Input, List, Select, Space, Tag} from "antd";
import  {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {generateId} from "@/utils/id";
import useReplaceManager, {ReplaceRule} from "@/hooks/replace";
import styles from './style.less'
import classNames from "classnames";
import ReplaceRuleSelect from "@/components/YouComic/ReplaceRuleSelect";

export type BatchMatchTagDrawerProps = {
  onClose: () => void
  isOpen: boolean
  books: YouComicAPI.Book[]
  onOk: (values: Array<UpdateValue>) => void
}
export type MatchItems = {
  value: string
  book: YouComicAPI.Book
  tags: YouComicAPI.MatchTag[]
  selected: boolean
}
export type UpdateValue = {
  id: number
  title: string
  tags: Array<{ name: string, type: string }>
}
const tagColorMapping = {
  name: 'red',
  artist: 'orange',
  series: 'lime',
  theme: 'blue',
  translator: 'purple',
};
const BatchMatchTagDrawer = ({onClose, isOpen, books, onOk}: BatchMatchTagDrawerProps) => {
  const [addRegexValue, setAddRegexValue] = useState<string>();
  const [items, setItems] = useState<MatchItems[]>([])
  const [useRegex, setUseRegex] = useState<string | undefined>(undefined);
  const replaceManager = useReplaceManager()
  useEffect(() => {
    setItems(books.map(it => {
      let name = it.name
      replaceManager.patterns.forEach((pattern:any) => {
        if (!pattern.enable) {
          return
        }
        name = name.replace(pattern.old, pattern.to)
      })
      return {
        value: name,
        book: it,
        tags: [],
        selected: false
      }
    }))
  }, [books])

  const getSavePattern = (): [] => {
    const rawJson = localStorage.getItem("save_pattern")
    if (!rawJson) {
      return []
    }
    return JSON.parse(rawJson)
  }
  const [regexPatterns, setRegexPatterns] = useState<[]>(getSavePattern())
  const onAddRegex = () => {
    localStorage.setItem("save_pattern", JSON.stringify([
      addRegexValue,
      ...regexPatterns
    ]))
    setRegexPatterns(getSavePattern())
  }
  const onRegexChange = (regex: string) => {
    setUseRegex(regex)
    const regexp = new RegExp(regex)
    const newItems = items.map(item => {
      const result = regexp.exec(item.value)
      const matchTags: Array<YouComicAPI.MatchTag> = []
      if (result?.groups) {
        let perfect = true
        Object.getOwnPropertyNames(result.groups).forEach(it => {
          const name = result.groups![it]
          const id = generateId(7)
          matchTags.push({
            id,
            name: name,
            type: it,
            source: 'custom',
          },)
        })

        return {
          ...item,
          tags: matchTags,
          selected:perfect
        }
      }
      return {
        ...item,
        tags: []
      }
    })
    setItems([...newItems])
  }
  const onSubmit = () => {
    const updateItem = items.filter(it => it.selected).filter(it => it.tags.find(i2 => i2.type === 'name') != null)
    onOk(updateItem.map(it => {
      return {
        id: it.book.id,
        title: it.tags.find(i2 => i2.type === 'name')?.name ?? it.book.name,
        tags: it.tags.filter(it => it.type !== 'name')
      }
    }))
  }
  const onValueChangeHandler = (value: string, id: number) => {
    const newItems = items.map(it => {
      if (it.book.id === id) {
        const regexp = new RegExp(useRegex!)
        const result = regexp.exec(value)

        const matchTags: Array<YouComicAPI.MatchTag> = []
        if (result?.groups) {
          Object.getOwnPropertyNames(result.groups).forEach(it => {

            const id = generateId(7)
            matchTags.push({
              id,
              name: result.groups![it],
              type: it,
              source: 'custom',
            },)
          })
          return {
            ...it,
            value: value,
            tags: matchTags,
          }
        }
        return {
          ...it,
          value:value
        }
      }
      return it
    })
    setItems([...newItems])
  }
  const onReplaceChange = (activeRule: ReplaceRule[]) => {
    const newItems = items.map(it => {
      let name = it.book.name
      // activeRule.forEach(pattern => {
      //   if (!pattern.enable) {
      //     return
      //   }
      //   name = name.replace(pattern.old, pattern.to)
      // })
      return {
        ...it,
        value: name
      }
    })
    setItems([...newItems])
    if (useRegex) {
      onRegexChange(useRegex)
    }
  }

  return (
    <Drawer
      title="批量编辑"
      placement="right"
      onClose={onClose}
      visible={isOpen}
      width={"90%"}
      extra={
        <div className={styles.headerContainer}>
          <Select
            className={classNames(styles.headerItem,styles.patternSelect)}
            defaultActiveFirstOption={true}
            onSelect={onRegexChange}
            dropdownRender={menu => (
              <>
                {menu}
                <Divider style={{margin: '8px 0'}}/>
                <Space style={{padding: '0 8px 4px'}}>
                  <Input
                    placeholder="Please enter item"
                    onChange={(e) => setAddRegexValue(e.currentTarget.value)}
                  />
                  <Button type="text" icon={<PlusOutlined/>} onClick={onAddRegex}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
          >
            <Select.Option value={'no'} key={'np'}>Not use</Select.Option>
            {
              regexPatterns.map((it, idx) => {
                return (
                  <Select.Option value={it} key={idx}>{it}</Select.Option>
                )
              })
            }
          </Select>
          <span className={styles.headerItem}>
            <ReplaceRuleSelect style={{width: 240}} onChange={onReplaceChange}/>
          </span>
          <Button onClick={onSubmit} type="primary" className={styles.headerItem}>
            Apply
          </Button>
        </div>

      }
    >

      <List
        size="small"

        dataSource={items}
        renderItem={item => <List.Item>
          <div style={{flex: 1}}>
            <div style={{flex: 1,display: 'flex'}}>
              <Space>
                <Checkbox checked={item.selected} onChange={e => {
                  const newItems = [...items.map(existItem => {
                    if (existItem.book.id === item.book.id) {
                      return {
                        ...existItem,
                        selected: e.target.checked
                      }
                    }
                    // for (let tag of item.tags) {
                    //   if (tag.type === 'artist') {
                    //     continue
                    //   }
                    //   if (existItem.tags.find(it => it.type === tag.type && it.name === tag.name )) {
                    //     return {
                    //       ...existItem,
                    //       selected: e.target.checked
                    //     }
                    //   }
                    // }
                    return existItem
                  })]
                  setItems(newItems)
                }}/>
              </Space>
              {/*{item.value}*/}
              <Input
                size={"small"}
                onChange={e => onValueChangeHandler(e.target.value,item.book.id)}
                value={item.value}
                style={{marginLeft:16,border:'none'}}
              />
            </div>
            <div>
              {
                item.tags.map(tag => {
                  return (
                    <Space key={tag.id}>
                      <Tag color={tagColorMapping[tag.type]}>{tag.name}</Tag>
                    </Space>
                  )
                })
              }
            </div>
          </div>

        </List.Item>}
      />
    </Drawer>
  )
}
export default BatchMatchTagDrawer
