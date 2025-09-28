import { Card, Dropdown, Menu } from 'antd';
import styles from './style.less';
import { UserOutlined, BookOutlined, GlobalOutlined, EditOutlined, PictureOutlined, ScissorOutlined } from '@ant-design/icons/lib';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import FolderIcon from '@ant-design/icons/FolderFilled';
import ImageLoader, { BookCoverLoader } from "@/components/YouComic/ImageLoader";
import {getBookTagInfo} from "@/utils/YouComic/book";

export interface BookCardHorizonPropsType {
  book?: YouComicAPI.Book;
  onSelectAction: (book: YouComicAPI.Book) => void;
  onAddToCollectionAction: (book: YouComicAPI.Book) => void;
  onSelectCover?: (book: YouComicAPI.Book) => void;
  onCropCover?: (book: YouComicAPI.Book) => void;
  isSelected?: boolean;
  onBookClick?: (book: YouComicAPI.Book) => void;
  onParseFromName: (book: YouComicAPI.Book) => void;
}

const BookCardHorizon = ({
  book,
  onSelectAction,
  onAddToCollectionAction,
  onSelectCover,
  onCropCover,
  isSelected = false,
  onBookClick,
  onParseFromName,
}: BookCardHorizonPropsType) => {
  const { author, series, theme } = getBookTagInfo(book);
  const onMenuItemSelect = () => {
    if (!book) {
      return;
    }
    onSelectAction(book);
  };
  const onMenuItemAddToCollection = () => {
    if (!book) {
      return;
    }
    onAddToCollectionAction(book);
  };
  const onMenuItemParseFromName = () => {
    if (!book) {
      return;
    }
    onParseFromName(book);
  };
  const onMenuItemSelectCover = () => {
    if (!book || !onSelectCover) {
      return;
    }
    onSelectCover(book);
  };
  const onMenuItemCropCover = () => {
    if (!book || !onCropCover) {
      return;
    }
    onCropCover(book);
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
      <Menu.Item key="3" onClick={onMenuItemParseFromName}>
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
    if (onBookClick === undefined || !book) {
      return;
    }
    onBookClick(book);
  };
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card bodyStyle={{ padding: 0 }} className={styles.main} hoverable onClick={onBookCardClick}>
        <div
          className={styles.content}
          style={{ backgroundColor: isSelected ? '#1890ff' : undefined }}
        >
          {book && <BookCoverLoader className={styles.cover} book={book} />}
          <div className={styles.info}>
            <div className={styles.title} style={{ color: isSelected ? '#FFFFFF' : undefined }}>
              {book?.name || '未知'}
            </div>
            <div className={styles.meta} style={{ color: isSelected ? '#FFFFFF' : undefined }}>
              <div className={styles.icon}>
                <UserOutlined />
              </div>
              {author?.name || '未知作者'}
            </div>
            <div className={styles.meta} style={{ color: isSelected ? '#FFFFFF' : undefined }}>
              <div className={styles.icon}>
                <BookOutlined />
              </div>
              {series?.name || '未知系列'}
            </div>
            <div className={styles.meta} style={{ color: isSelected ? '#FFFFFF' : undefined }}>
              <div className={styles.icon}>
                <GlobalOutlined />
              </div>
              {theme?.name || '未知主题'}
            </div>
          </div>
        </div>
      </Card>
    </Dropdown>
  );
};

export default BookCardHorizon;
