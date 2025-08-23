import {useModel} from "@umijs/max";
import {Card, Descriptions} from "antd";
import {getBookTagInfo} from "@/utils/YouComic/book";
import moment from 'moment';

export type BookDetailBasePanelProps = {

}
const BookDetailBasePanel = (props: BookDetailBasePanelProps) => {
  const model = useModel('YouComic.bookDetail')
  const { author, series, theme, translator } = getBookTagInfo(model.bookDetail);

  return (
    <div>
      {
        model.bookDetail && (
          <Card>
            <Descriptions bordered>
              <Descriptions.Item label="ID">{model.bookDetail.id}</Descriptions.Item>
              <Descriptions.Item label="标题">
                {
                  model.bookDetail.name
                }
              </Descriptions.Item>
              <Descriptions.Item label="作者">{author?.name}</Descriptions.Item>
              <Descriptions.Item label="系列">{series?.name}</Descriptions.Item>
              <Descriptions.Item label="主题">{theme?.name}</Descriptions.Item>
              <Descriptions.Item label="翻译">{translator?.name}</Descriptions.Item>
              <Descriptions.Item label="路径" span={3}>
                {model.bookDetail.dirName}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(model.bookDetail.created_at).format('YYYY-MM-DD hh:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="最后一次修改">
                {moment(model.bookDetail.updated_at).format('YYYY-MM-DD hh:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )
      }

    </div>
  )
}

export default BookDetailBasePanel
