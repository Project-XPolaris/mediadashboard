import { Tag } from 'antd';
// @ts-ignore
import SectionContainer from "@/components/YouComic/BookFilterDrawer/sections/SectionContainer";

interface FilterTagCollectionPropsType {
  tags: FilterTag[];
}

export interface FilterTag {
  key: any;
  text: string;
  data: any;
  onRemove?: (data: any) => void;
}

export default function FilterTagCollection({ tags }: FilterTagCollectionPropsType) {
  return (
    <SectionContainer title={"Active filters"}>
      {tags.map(tag => (
        <Tag
          color="geekblue"
          closable={Boolean(tag.onRemove)}
          onClose={() => {
            if (tag.onRemove) {
              tag.onRemove(tag.data);
            }
          }}
          key={tag.key}
          visible
        >
          {tag.text}
        </Tag>
      ))}
    </SectionContainer>
  );
}
