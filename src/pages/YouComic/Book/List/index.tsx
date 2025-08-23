import {PageContainer} from "@ant-design/pro-components";
import BooksCollection from "@/components/YouComic/BookCollection";
import {useModel} from "@umijs/max";
import {Button, Divider, Dropdown, MenuProps, Pagination} from "antd";
import styles from './style.less'
import {useEffect, useState} from "react";
import BookFilterDrawer, {BookFilter} from "@/components/YouComic/BookFilterDrawer";
import BatchMatchTagDrawer, {UpdateValue} from "@/components/YouComic/BatchMatchTagDrawer";
import MatchTagDialog from "@/components/YouComic/MatchTagDialog";
import {LibraryPickUpDialog} from "@/components/YouComic/LibraryPickUpDialog";
import {MenuClickEventHandler} from "rc-menu/es/interface";
import { history } from '@umijs/max';

const BookListPage = () => {
  const model = useModel('YouComic.bookList')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [batchMatchTagDrawerOpen, setBatchMatchTagDrawerOpen] = useState(false)
  const [matchTagDialogOpen, setMatchTagDialogOpen] = useState(false)
  const [moveBookDialogOpen, setMoveBookDialogOpen] = useState(false)
  useEffect(() => {
    model.loadData({})
  }, [])
  const onBookSelect = (book: YouComicAPI.Book) => {
    const isSelected = Boolean(model.selectedBooks.find(selectedBook => selectedBook.id === book.id));
    if (isSelected) {
      model.setSelectedBooks(model.selectedBooks.filter(selectedBook => selectedBook.id !== book.id))
    } else {
      model.setSelectedBooks([...model.selectedBooks, book])
    }
  };
  const onBookClick = (book: YouComicAPI.Book) => {
    if (model.selectedBooks.length > 0) {
      onBookSelect(book);
    } else {
      history.push(`/youcomic/book/${book.id}/base`)
    }
  };
  const onTagSearch = async (key: string, type?: string) => {
    await model.searchBookTags({searchKey: key, type})
  };
  const onSetFilter = (newFilter: BookFilter) => {
    model.updateFilter({
      ...model.filter,
      startTime: newFilter.startTime,
      endTime: newFilter.endTime,
      nameSearch: newFilter.nameSearch,
      pathSearch: newFilter.pathSearch,
      order: newFilter.order,
      tags: newFilter.tags,
      library: newFilter.library,
      libraryIds: newFilter.libraryIds,
      tagSearch: newFilter.tagSearch,
      tagSearchType: newFilter.tagSearchType
    })
  };
  const onMatchNameDialogOk = async (title: string | undefined, tags: YouComicAPI.MatchTag[]) => {
    setMatchTagDialogOpen(false)
    if (!model.contextBook) {
      return;
    }
    if (title) {
      await model.updateList({books: [{id: model.contextBook.id, title, tags}]})
    }
  };
  const onBatchMatchOkHandler = (books: UpdateValue[]) => {
    model.updateList({books})
  }
  const onSelectAllBooks = () => {
    model.setSelectedBooks(model.books)
  };
  const onInverseSelectBooks = () => {
    model.setSelectedBooks(model.books?.filter(
      (book: YouComicAPI.Book) =>
        model.selectedBooks.find(selectedBook => selectedBook.id === book.id) === undefined,
    ))
  };
  const onUnSelectBooks = () => {
    model.setSelectedBooks([])
  }
  const SelectedItems: MenuProps['items'] = [
    {
      key: 'selectAll',
      label: "Select all"
    },
    {
      key: 'selectNone',
      label: "Select none"
    },
    {
      key: 'reverseSelect',
      label: "Reverse select"
    },
    {
      type: 'divider',
    },
    {
      key: 'matchSelect',
      label: "Match select book"
    },
    {
      type: 'divider',
    },
    {
      key: 'moveToOtherLibrary',
      label: 'Move to other library',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
    },
    {
      key: 'deletePermanently',
      label: 'Delete permanently',
    },
  ];
  const onSelectedMenuClick: MenuClickEventHandler = (info) => {
    switch (info.key) {
      case 'selectAll':
        onSelectAllBooks();
        break;
      case 'selectNone':
        onUnSelectBooks();
        break;
      case 'reverseSelect':
        onInverseSelectBooks();
        break;
      case 'moveToOtherLibrary':
        setMoveBookDialogOpen(true);
        break;
      case 'delete':
        model.deleteSelectedBooks({permanently: false});
        break;
      case 'deletePermanently':
        model.deleteSelectedBooks({permanently: true});
        break;
      case 'matchSelect':
        model.matchSelectBook();
        break;

    }
  }
  return (
    <PageContainer
      extra={
        <>
          {
            model.selectedBooks.length > 0 &&
            <>
              <Dropdown menu={{items: SelectedItems, onClick: onSelectedMenuClick}}>
                <Button type={"primary"}>Selected {model.selectedBooks.length} items</Button>
              </Dropdown>
              <Divider type={"vertical"}/>
            </>
          }
          <Button onClick={() => setBatchMatchTagDrawerOpen(true)}>Batch Match</Button>
          <Button type={"primary"} onClick={() => setFilterDrawerOpen(true)}>Filter</Button>
        </>
      }
    >
      {
        matchTagDialogOpen &&
        <MatchTagDialog
          visible
          onMatchOk={onMatchNameDialogOk}
          onCancel={() =>
            setMatchTagDialogOpen(false)
          }
          text={model.contextBook?.dirName}
        />
      }
      <LibraryPickUpDialog
        onCancel={() => setMoveBookDialogOpen(false)}
        isOpen={moveBookDialogOpen}
        onOk={(id) => model.move({id})}
      />
      <BatchMatchTagDrawer
        onClose={() => setBatchMatchTagDrawerOpen(false)}
        isOpen={batchMatchTagDrawerOpen}
        books={model.books}
        onOk={onBatchMatchOkHandler}
      />
      <BookFilterDrawer
        onClose={() => setFilterDrawerOpen(false)}
        isOpen={filterDrawerOpen}
        filter={model.filter}
        onFilterChange={onSetFilter}
        searchTags={model.searchTags}
        onTagSearch={onTagSearch}
      />
      <BooksCollection
        books={model.books}
        onSelectAction={onBookSelect}
        selectedBooks={model.selectedBooks}
        onAddToCollectionAction={() => {
        }}
        onBookClick={onBookClick}
        type={"horizon"}
        onParseFromName={book => {
          model.setContextBook(book)
          setMatchTagDialogOpen(true)
        }}
      />
      <div className={styles.pageWrap}>
        <Pagination
          defaultCurrent={1}
          total={model.pagination.total}
          current={model.pagination.page}
          pageSize={model.pagination.pageSize}
          pageSizeOptions={[25, 35, 50, 75, 100, 200, 300, 1000]}
          onChange={(page, pageSize) => {
            model.updatePagination(page, pageSize)
          }}
        />
      </div>
    </PageContainer>
  )
}
export default BookListPage;
