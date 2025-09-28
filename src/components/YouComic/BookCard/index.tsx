import { Card, Dropdown, Menu } from 'antd';
import styles from './style.less';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import FolderIcon from '@ant-design/icons/FolderFilled';
import { EditOutlined, PictureOutlined, ScissorOutlined } from '@ant-design/icons';
import ImageLoader, { BookCoverLoader } from "@/components/YouComic/ImageLoader";
import {getBookTagInfo} from "@/utils/YouComic/book";

interface BookCardPropsType {
  book: YouComicAPI.Book;
  onSelectAction: (book: YouComicAPI.Book) => void;
  onAddToCollectionAction: (book: YouComicAPI.Book) => void;
  onSelectCover?: (book: YouComicAPI.Book) => void;
  onCropCover?: (book: YouComicAPI.Book) => void;
  isSelected?: boolean;
  onBookClick?: (book: YouComicAPI.Book) => void;
}

export default function BookCard({
  book,
  onSelectAction,
  onAddToCollectionAction,
  onSelectCover,
  onCropCover,
  isSelected = false,
  onBookClick,
}: BookCardPropsType) {
  const { author } = getBookTagInfo(book);
  const onMenuItemSelect = () => {
    onSelectAction(book);
  };
  const onMenuItemAddToCollection = () => {
    onAddToCollectionAction(book);
  };
  const onMenuItemSelectCover = () => {
    if (onSelectCover) {
      onSelectCover(book);
    }
  };
  const onMenuItemCropCover = () => {
    if (onCropCover) {
      onCropCover(book);
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onMenuItemSelect}>
        <CheckIcon />
        {isSelected ? '取消选中' : '选中'}
      </Menu.Item>
      <Menu.Item key="2" onClick={onMenuItemAddToCollection}>
        <FolderIcon />
        加入集合
      </Menu.Item>
      <Menu.Item key="3" onClick={onMenuItemAddToCollection}>
        <EditOutlined />
        从文件名解析
      </Menu.Item>
      {onSelectCover && (
        <Menu.Item key="4" onClick={onMenuItemSelectCover}>
          <PictureOutlined />
          选择封面
        </Menu.Item>
      )}
      {onCropCover && (
        <Menu.Item key="5" onClick={onMenuItemCropCover}>
          <ScissorOutlined />
          裁剪封面
        </Menu.Item>
      )}
    </Menu>
  );
  const onBookCardClick = () => {
    if (onBookClick === undefined) {
      return;
    }
    onBookClick(book);
  };
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card
        className={styles.main}
        hoverable
        cover={
          <div className={styles.coverWrap}>
            <BookCoverLoader className={styles.cover} book={book} />
          </div>
        }
        style={{ backgroundColor: isSelected ? '#1890ff' : undefined }}
        onClick={onBookCardClick}
      >
        <div>
          <div id="title" className={isSelected ? styles.titleSelected : styles.title}>
            {book.name}
          </div>
          <div id="author" className={isSelected ? styles.authorSelected : styles.author}>
            {author?.name || ''}
          </div>
        </div>
      </Card>
    </Dropdown>
  );
}
