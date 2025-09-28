import {Divider, Drawer} from "antd";
import OrderFilterSection from "@/components/FilterSection/OrderFilterSection";
import SearchNameFilterSection from "@/components/FilterSection/SearchNameFilterSection";
import ActiveFilterSection from "@/components/YouComic/BookFilterDrawer/sections/ActiveFilterSection";
import TagFilterSection from "@/components/YouComic/BookFilterDrawer/sections/TagFilterSection";
import LibraryFilterSection from "@/components/YouComic/BookFilterDrawer/sections/LibraryFilterSection";
import TimeRangeFilterSection from "@/components/YouComic/BookFilterDrawer/sections/TimeRangeFilterSection";
import TagSearchSection from "@/components/YouComic/BookFilterDrawer/sections/TagSearchSection";
import NoTagsFilterSection from "@/components/YouComic/BookFilterDrawer/sections/NoTagsFilterSection";


interface BookFilterDrawerPropsType {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filter: BookFilter) => void
  filter: BookFilter
  isTagFetching?: boolean
  onTagSearch: (key: string, type?: string) => void
  searchTags?: YouComicAPI.Tag[]
}

export interface BookFilter {
  order: { orderKey: string, order: "asc" | "desc" }[]
  nameSearch?: string
  startTime?: string
  endTime?: string
  tags: { id: number, name: string }[]
  tagIds: number[]
  library: YouComicAPI.Library[]
  libraryIds: number[]
  pathSearch?: string
  tagSearch?: string
  tagSearchType?: string
  noTags?: string
}

const orderItems = [
  {
    key: "id",
    title: "ID"
  },
  {
    key: "name",
    title: "名称"
  },
  {
    key: "created_at",
    title: "创建时间"
  },
  {
    key: "updated_at",
    title: "修改时间"
  },
];
export default function BookFilterDrawer(
  {
    isOpen = false,
    onClose,
    onFilterChange,
    filter,
    isTagFetching,
    onTagSearch,
    searchTags
  }: BookFilterDrawerPropsType) {
  const onAddFilter = (orderKey: string, order: "asc" | "desc") => {
    const orderFilter = filter.order.filter(item => item.orderKey !== orderKey);
    onFilterChange({
      ...filter,
      order: [
        ...orderFilter,
        {orderKey, order}
      ]
    })
  };
  const onActiveFilterChange = (newFilter: any) => {
    onFilterChange(newFilter)
  };
  const onAddNameSearch = (searchText: string) => {
    onFilterChange({
      ...filter,
      nameSearch: searchText
    })
  };
  const onAddPathSearch = (searchText: string) => {
    onFilterChange({
      ...filter,
      pathSearch: searchText
    })
  };
  const onAddTimeRange = (startTime: string, endTime: string) => {
    onFilterChange({
      ...filter,
      startTime,
      endTime
    })
  };
  const onAddTagsFilter = (tags: { value: number, label: string, key: number }[]) => {
    onFilterChange({
      ...filter,
      tags: tags.map(item => ({id: item.value, name: item.label}))
    })
  };
  const onAddLibrary = (library: YouComicAPI.Library) => {
    const newLibraryList = [...filter.library.filter(it => it.id !== library.id), library]
    onFilterChange({
      ...filter,
      library: newLibraryList
    })
  }
  const onAddTagSearchFilter = (text: string, type?: string) => {
    onFilterChange({
      ...filter,
      tagSearch: text,
      tagSearchType: type
    })
  };
  const onNoTagsFilterChange = (mode: string) => {
    onFilterChange({
      ...filter,
      noTags: mode
    })
  };
  return (
    <Drawer
      title="过滤器"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={isOpen}
      width={320}
    >
      <ActiveFilterSection
        orderItems={orderItems}
        filter={filter}
        onFilterChange={onActiveFilterChange}
      />
      <Divider/>
      <OrderFilterSection
        orderItems={orderItems}
        onAddFilter={onAddFilter}
        defaultOrderKey="id"
      />
      <Divider/>
      <SearchNameFilterSection
        onSetSearchName={onAddNameSearch}
        title={"Name Search"}
      />
      <Divider/>
      <TimeRangeFilterSection
        onAddRangeChange={onAddTimeRange}
      />
      <Divider/>
      <TagSearchSection
        onAdd={onAddTagSearchFilter}
      />
      <Divider/>
      <TagFilterSection
        isFetching={isTagFetching}
        onSearch={onTagSearch}
        tags={searchTags}
        onAddTag={onAddTagsFilter}
      />
      <Divider/>
      <LibraryFilterSection
        onAddLibrary={onAddLibrary}
      />
      <Divider/>
      <SearchNameFilterSection
        onSetSearchName={onAddPathSearch}
        title={"路径搜索"}
      />
      <Divider/>
      <NoTagsFilterSection
        value={filter.noTags}
        onChange={onNoTagsFilterChange}
      />
    </Drawer>
  );
}
