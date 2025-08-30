import {PageContainer} from "@ant-design/pro-components";
import {useEffect, useState} from "react";
import {useModel,useParams} from "@umijs/max";
import {Button, message} from "antd";
import BookDetailBasePanel from "@/pages/YouComic/Book/Detail/parts/Base/BookDetailBasePanel";
import BookDetailTags from "@/pages/YouComic/Book/Detail/parts/Tags";
import BookDetailPages from "@/pages/YouComic/Book/Detail/parts/Pages";
import MatchTagDialog from "@/components/YouComic/MatchTagDialog";

const BookDetailPage = () => {
  const bookDetailModel = useModel('YouComic.bookDetail')
  const params  = useParams();
  const [matchTagDialogVisible, setMatchTagDialogVisible] = useState<boolean>(false);
  const [matchTagText, setMatchTagText] = useState<string>('');
  useEffect(() => {
    const {id} = params
    if (!id){
      return
    }
    bookDetailModel.initData(id)
  },[])

  // 打开匹配标签对话框
  const onOpenMatchTagDialog = () => {
    if (!bookDetailModel.bookDetail) {
      message.error('书籍信息不存在');
      return;
    }
    // 使用书籍的目录名作为匹配文本
    const text = bookDetailModel.bookDetail.dirName || bookDetailModel.bookDetail.name || '';
    setMatchTagText(text);
    setMatchTagDialogVisible(true);
  };

  // 处理匹配标签确认
  const onMatchTagOk = async (title: string | undefined, tags: YouComicAPI.MatchTag[]) => {
    try {
      // 这里可以调用API将标签应用到书籍
      // 暂时只显示消息，实际应用需要调用相应的API
      console.log('选中的标题:', title);
      console.log('选中的标签:', tags);
      
      message.success(`成功匹配 ${tags.length} 个标签${title ? '，标题: ' + title : ''}`);
      
      // 关闭对话框
      setMatchTagDialogVisible(false);
      
      // 如果需要刷新标签页数据，可以在这里调用
      if (bookDetailModel.activeKey === 'tag') {
        // 重新加载书籍信息
        const {id} = params;
        if (id) {
          await bookDetailModel.initData(id);
        }
      }
    } catch (error: any) {
      console.error('应用标签失败:', error);
      message.error('应用标签失败: ' + (error.message || '未知错误'));
    }
  };
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
        <Button 
          key="matchTag" 
          type="primary" 
          onClick={onOpenMatchTagDialog}
          disabled={!bookDetailModel.bookDetail}
        >
          匹配标签
        </Button>
      ]}
      footer={[

      ]}
    >
      {
        renderTabContent()
      }
      
      <MatchTagDialog
        open={matchTagDialogVisible}
        onCancel={() => setMatchTagDialogVisible(false)}
        onMatchOk={onMatchTagOk}
        text={matchTagText}
      />

    </PageContainer>
  )
}

export default BookDetailPage;
