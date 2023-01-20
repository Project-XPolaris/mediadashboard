import {ChangeEvent, useState} from 'react';
import {Button, Input} from 'antd';
import styles from './style.less';
import SectionContainer from "@/components/YouComic/BookFilterDrawer/sections/SectionContainer";

interface SearchNameFilterSectionPropsType {
  onSetSearchName: (searchName: string) => void;
  title: string
}

export default (
  {
    onSetSearchName,
    title
  }: SearchNameFilterSectionPropsType) => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchString = e.currentTarget.value;
    if (searchString !== undefined && searchString.length !== 0) {
      setSearchText(searchString);
    }
  };
  const onAddClick = () => {
    if (searchText !== undefined) {
      onSetSearchName(searchText);
    }
  };
  return (
    <SectionContainer title={title}>
      <Input
        placeholder={"Search name"}
        size="small"
        className={styles.nameInput}
        onChange={onTextChange}
      />
      <Button
        type="primary"
        htmlType="submit"
        className={styles.addButton}
        onClick={onAddClick}
        disabled={searchText === undefined || searchText.length === 0}
      >
        {"Add"}
      </Button>
    </SectionContainer>
  );
}
