import {Pagination} from "antd";
import styles from './style.less';
import {useModel} from "@@/exports";
import PageCollection from "@/pages/YouComic/Book/Detail/parts/Pages/components/PageCollection";

const BookDetailPages = () => {
  const model = useModel('YouComic.bookDetail')
  return (
    <>
      <PageCollection
        pages={model.bookPageList}
        onDelete={(page) => {
        }}
        onSetOrderActionClick={() => {
        }}
      />
      <div className={styles.pageWrap}>
        <Pagination
          defaultCurrent={1}
          total={model.bookPageTotal}
          current={model.bookPageCurrent}
          pageSize={model.bookPagePageSize}
          onChange={(page, pageSize) => {
            const id = model.bookDetail?.id
            if (id) {
              model.pageUpdate(id.toString(),{page,pageSize})
            }
          }}
        />
      </div>
    </>
  )
}
export default BookDetailPages;
