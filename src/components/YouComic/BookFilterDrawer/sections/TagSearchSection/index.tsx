import {useState} from "react";
import {Button, Input} from "antd";
import styles from './style.less'
import SectionContainer from "@/components/YouComic/BookFilterDrawer/sections/SectionContainer";
export type TagSearchSectionPropsType = {
  onAdd:(text:string,type?:string) => void
}
const TagSearchSection = ({onAdd}:TagSearchSectionPropsType) => {
  const [text, setText] = useState<string>();
  const [tagType, setTagType] = useState<string>();
  const onOk = () => {
    if (!text) {
      return
    }
    onAdd(text,tagType)
  }
  return (
    <SectionContainer title="包含标签搜索">
      <Input
        size="small"
        placeholder={"name"}
        className={styles.nameInput}
        onChange={(e) => setText(e.target.value)}
      />
      <Input
        size="small"
        placeholder={"type"}
        className={styles.nameInput}
        onChange={(e) => setTagType(e.target.value)}
      />
      <Button
        type="primary"
        htmlType="submit"
        className={styles.addButton}
        onClick={onOk}
        disabled={text === undefined}
      >
        Add
      </Button>
    </SectionContainer>
  )
}

export default TagSearchSection
