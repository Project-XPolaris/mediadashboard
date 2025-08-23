import {PageContainer} from "@ant-design/pro-components";
import {useEffect} from "react";
import {useModel,useParams} from "@umijs/max";
import BookDetailBasePanel from "@/pages/YouComic/Book/Detail/parts/Base/BookDetailBasePanel";
import BookDetailTags from "@/pages/YouComic/Book/Detail/parts/Tags";
import BookDetailPages from "@/pages/YouComic/Book/Detail/parts/Pages";

const BookDetailPage = () => {
  const bookDetailModel = useModel('YouComic.bookDetail')
  const params  = useParams();
  useEffect(() => {
    const {id} = params
    if (!id){
      return
    }
    bookDetailModel.initData(id)
  },[])
  const renderTabContent = () => {
    switch(bookDetailModel.activeKey) {
      case 'base':
        return <BookDetailBasePanel />;
      case 'page':
       return <BookDetailPages />
      case 'tag':
        return <BookDetailTags />;
      default:
        return (<>/</>);
    }
  }
  return (
    <PageContainer
      title={bookDetailModel.bookDetail?.name}
      content={bookDetailModel.bookDetail?.dirName}
      tabActiveKey={bookDetailModel.activeKey}
      onTabChange={(key) => {
        bookDetailModel.setActiveKey(key)
      }}
      tabList={[
        {
          tab: '基本信息',
          key: 'base',
        },
        {
          tab: '页面',
          key: 'page',
        },
        {
          tab: '标签',
          key: 'tag',
        },
      ]}
      extra={[

      ]}
      footer={[

      ]}
    >
      {
        renderTabContent()
      }

    </PageContainer>
  )
}

export default BookDetailPage;
