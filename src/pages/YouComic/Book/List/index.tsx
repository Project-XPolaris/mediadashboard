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
import LLMBatchMatchTagModal from "@/components/YouComic/LLMBatchMatchTagModal";
import SelectCoverModal from "@/components/YouComic/SelectCoverModal";
import CropCoverModal from "@/components/YouComic/CropCoverModal";
import {MenuClickEventHandler} from "rc-menu/es/interface";
import { history } from '@umijs/max';
import TranslateTitleModal from '@/components/YouComic/TranslateTitleModal';

const BookListPage = () => {
  const model = useModel('YouComic.bookList')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [batchMatchTagDrawerOpen, setBatchMatchTagDrawerOpen] = useState(false)
  const [matchTagDialogOpen, setMatchTagDialogOpen] = useState(false)
  const [moveBookDialogOpen, setMoveBookDialogOpen] = useState(false)
  const [llmBatchModalOpen, setLlmBatchModalOpen] = useState(false)
  const [selectCoverModalOpen, setSelectCoverModalOpen] = useState(false)
  const [cropCoverModalOpen, setCropCoverModalOpen] = useState(false)
  const [cropCoverBook, setCropCoverBook] = useState<YouComicAPI.Book | null>(null)
  const [translateModalOpen, setTranslateModalOpen] = useState(false)
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
      tagSearchType: newFilter.tagSearchType,
      noTags: newFilter.noTags
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
  const onLLMBatchMatchOk = (results: Array<{id: number, title: string, tags: YouComicAPI.MatchTag[]}>) => {
    const updateValues: UpdateValue[] = results.map(result => ({
      id: result.id,
      title: result.title,
      tags: result.tags.map(tag => ({name: tag.name, type: tag.type}))
    }))
    model.updateList({books: updateValues})
    // 批量更新后清空选择
    model.setSelectedBooks([])
  }

  const onTranslateTitles = async () => {
    const { message } = await import('antd');
    if (model.selectedBooks.length === 0) {
      message.warning('请先选择书籍喵～');
      return;
    }
    setTranslateModalOpen(true);
  }
  const onSelectCoverOk = async (coverSelections: Array<{bookId: number, coverPath: string}>) => {
    const { message } = await import('antd');
    const loadingKey = 'updateCover';
    
    try {
      // 调用API来更新书籍的封面
      const { updateBook } = await import('@/services/youcomic/book');
      
      const totalCount = coverSelections.length;
      message.loading({ content: `正在更新 ${totalCount} 本书的封面...`, key: loadingKey });
      
      for (let i = 0; i < coverSelections.length; i++) {
        const selection = coverSelections[i];
        await updateBook(selection.bookId, { cover: selection.coverPath });
        
        // 更新进度提示
        if (i % 3 === 0 || i === coverSelections.length - 1) {
          message.loading({ 
            content: `正在更新封面... (${i + 1}/${totalCount})`, 
            key: loadingKey 
          });
        }
      }
      
      // 重新加载数据以获取最新的封面信息
      await model.loadData({});
      
      // 批量更新后清空选择
      model.setSelectedBooks([]);
      
      message.success({ 
        content: `成功更新了 ${totalCount} 本书的封面喵～`, 
        key: loadingKey,
        duration: 3
      });
    } catch (error) {
      console.error('更新封面失败:', error);
      message.error({ 
        content: '更新封面失败，请检查网络连接喵～', 
        key: loadingKey,
        duration: 5
      });
      // 如果更新失败，重新加载数据
      await model.loadData({});
      model.setSelectedBooks([]);
    }
  }
  const onSingleBookSelectCover = (book: YouComicAPI.Book) => {
    // 单个书籍选择封面 - 设置选中该书籍并打开封面选择模态框
    model.setSelectedBooks([book]);
    setSelectCoverModalOpen(true);
  }
  const onSingleBookCropCover = (book: YouComicAPI.Book) => {
    // 单个书籍裁剪封面 - 设置当前书籍并打开裁剪模态框
    setCropCoverBook(book);
    setCropCoverModalOpen(true);
  }
  const onCropCoverOk = async (croppedImageData: { bookId: number; imageBlob: Blob; fileName: string }) => {
    const { message } = await import('antd');
    const { cropBookCover } = await import('@/services/youcomic/book');
    
    try {
      message.loading('正在保存裁剪后的封面...');
      
      // 调用API保存裁剪后的封面
      await cropBookCover(croppedImageData.bookId, croppedImageData.imageBlob, croppedImageData.fileName);
      
      // 重新加载数据以获取最新的封面信息
      await model.loadData({});
      
      // 关闭模态框
      setCropCoverModalOpen(false);
      setCropCoverBook(null);
      
      message.success('封面裁剪保存成功喵～');
    } catch (error) {
      console.error('裁剪封面保存失败:', error);
      message.error('封面裁剪保存失败，请重试喵～');
    }
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
      key: 'llmBatchMatch',
      label: "LLM Batch Match"
    },
    {
      key: 'selectCover',
      label: "Select Cover"
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
      case 'llmBatchMatch':
        setLlmBatchModalOpen(true);
        break;
      case 'selectCover':
        setSelectCoverModalOpen(true);
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
          <Button onClick={onTranslateTitles}>Translate Title</Button>
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
      <LLMBatchMatchTagModal
        visible={llmBatchModalOpen}
        onClose={() => setLlmBatchModalOpen(false)}
        books={model.selectedBooks}
        onOk={onLLMBatchMatchOk}
      />
      <SelectCoverModal
        visible={selectCoverModalOpen}
        onClose={() => setSelectCoverModalOpen(false)}
        books={model.selectedBooks}
        onOk={onSelectCoverOk}
      />
      <CropCoverModal
        visible={cropCoverModalOpen}
        onClose={() => {
          setCropCoverModalOpen(false);
          setCropCoverBook(null);
        }}
        book={cropCoverBook}
        onOk={onCropCoverOk}
      />
      <TranslateTitleModal
        visible={translateModalOpen}
        onClose={() => setTranslateModalOpen(false)}
        books={model.selectedBooks}
        onApplied={async () => {
          await model.loadData({});
          model.setSelectedBooks([]);
          setTranslateModalOpen(false);
        }}
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
        onSelectCover={onSingleBookSelectCover}
        onCropCover={onSingleBookCropCover}
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
