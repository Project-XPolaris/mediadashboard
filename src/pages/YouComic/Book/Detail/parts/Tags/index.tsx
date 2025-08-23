import {ProList} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";

export type BookDetailTagsProps = {}
const BookDetailTags = (props: BookDetailTagsProps) => {
  const model = useModel('YouComic.bookDetail')
  return (
    <div>
      {
        model.bookDetail && (
          <ProList<YouComicAPI.Tag>
            rowKey="id"
            headerTitle="Tags"
            dataSource={ model.bookDetail.tags}
            showActions="hover"
            editable={{}}
            metas={{
              title: {
                dataIndex: 'name',
              },
              description: {},
              subTitle: {
                dataIndex: 'type',
              },
              actions: {
                render: (text, row, index, action) => [
                  <a
                    onClick={() => {
                      action?.startEditable(row.id);
                    }}
                    key="link"
                  >
                    编辑
                  </a>,
                ],
              },
            }}
          />
        )
      }
    </div>
  )
}

export default BookDetailTags;
