import SearchNameFilterSection from "@/components/FilterSection/SearchNameFilterSection";
import {TagFilter} from "@/pages/YouComic/models/tagList";

interface TagNameSearchFilterPropsType {
  filter:TagFilter
  onUpdate:(newFilter:TagFilter) => void
}


export default function TagNameSearchFilter({onUpdate,filter}: TagNameSearchFilterPropsType) {
    const onSetSearchName = (nameSearch:string) => {
      onUpdate({
        ...filter,
        nameSearch
      })
    };
    return (
        <SearchNameFilterSection onSetSearchName={onSetSearchName} title={"name search"}/>
    );
}
