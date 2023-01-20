import { Col, Row } from 'antd';
import styles from './style.less';
import BookCardHorizon from "@/components/YouComic/BookCardHorizon";
import BookCard from "@/components/YouComic/BookCard";

interface BooksCollectionPropsType {
  books?: YouComicAPI.Book[];
  onSelectAction: (book: YouComicAPI.Book) => void;
  onAddToCollectionAction: (book: YouComicAPI.Book) => void;
  selectedBooks?: YouComicAPI.Book[];
  onBookClick?: (book: YouComicAPI.Book) => void;
  type?: 'vertical' | 'horizon';
  onParseFromName: (book: YouComicAPI.Book) => void;
}

export default function BooksCollection({
  books = [],
  selectedBooks = [],
  onSelectAction,
  onAddToCollectionAction,
  onBookClick,
  onParseFromName,
  type = 'vertical',
}: BooksCollectionPropsType) {
  const items = books?.map((book: YouComicAPI.Book) => {
    return (
      <Col key={book.id}>
        {type === 'vertical' && (
          <BookCard
            book={book}
            onSelectAction={onSelectAction}
            onAddToCollectionAction={onAddToCollectionAction}
            isSelected={Boolean(selectedBooks?.find(selectedBook => selectedBook.id === book.id))}
            onBookClick={onBookClick}
          />
        )}
        {type === 'horizon' && (
          <BookCardHorizon
            book={book}
            onSelectAction={onSelectAction}
            onAddToCollectionAction={onAddToCollectionAction}
            isSelected={Boolean(selectedBooks?.find(selectedBook => selectedBook.id === book.id))}
            onBookClick={onBookClick}
            onParseFromName={onParseFromName}
          />
        )}
      </Col>
    );
  });
  return (
    <Row gutter={16} className={styles.main}>
      {items}
    </Row>
  );
}
