import {Col, Row} from 'antd';
import styles from './style.less';
import PageCard from "@/pages/YouComic/Book/Detail/parts/Pages/components/PageCard";

interface PageCollectionPropsType {
  pages?: YouComicAPI.Page[];
  onDelete: (page: YouComicAPI.Page) => void;
  onSetOrderActionClick: (page: YouComicAPI.Page) => void;
}

export default function PageCollection({
  pages = [],
  onDelete,
  onSetOrderActionClick,
}: PageCollectionPropsType) {
  const items = pages?.map((page: YouComicAPI.Page) => {
    return (
      <Col key={page.id} className={styles.col}>
        <PageCard page={page} onDelete={onDelete} onSetOrderActionClick={onSetOrderActionClick} />
      </Col>
    );
  });
  return <Row gutter={8}>{items}</Row>;
}
