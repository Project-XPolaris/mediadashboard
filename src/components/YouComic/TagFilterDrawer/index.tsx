import FilterDrawer from "@/components/YouComic/FilterDrawer";
import {TagFilter} from "@/pages/YouComic/models/tagList";
import TagOrderFilter from "@/components/YouComic/TagFilterDrawer/order";
import ActiveFilterSection from "@/components/YouComic/TagFilterDrawer/active";
import TagNameSearchFilter from "@/components/YouComic/TagFilterDrawer/name";
import TagTypeFilter from "@/components/YouComic/TagFilterDrawer/type";


interface TagFilterDrawerPropsType {
  onClose: () => void
  isOpen?: boolean
  filter:TagFilter
  onFilterUpdate:(newFilter:TagFilter) => void
}


export default function TagFilterDrawer({onClose, isOpen = false,filter,onFilterUpdate}: TagFilterDrawerPropsType) {
  const sections = [
    <ActiveFilterSection key={0} filter={filter} onUpdateTag={onFilterUpdate}/>,
    <TagOrderFilter key={1} filter={filter} onFilterUpdate={onFilterUpdate}/>,
    <TagNameSearchFilter key={2} filter={filter} onUpdate={onFilterUpdate}/>,
    <TagTypeFilter key={3} filter={filter} onUpdate={onFilterUpdate}/>
  ];
  return (
    <FilterDrawer
      onClose={onClose}
      isOpen={isOpen}
      filterSections={sections}
    />
  );
}
