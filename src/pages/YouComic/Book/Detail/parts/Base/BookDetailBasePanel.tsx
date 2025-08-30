import {useModel} from "@umijs/max";
import {Card, Descriptions, Button, message} from "antd";
import {getBookTagInfo} from "@/utils/YouComic/book";
import moment from 'moment';
import {useState} from "react";
import {RobotOutlined} from "@ant-design/icons";
import LLMMatchTagDialog from "@/components/YouComic/LLMMatchTagDialog";
import {updateBook} from "@/services/youcomic/book";

export type BookDetailBasePanelProps = {

}
const BookDetailBasePanel = (props: BookDetailBasePanelProps) => {
  const model = useModel('YouComic.bookDetail')
  const { author, series, theme, translator } = getBookTagInfo(model.bookDetail);
  const [matchDialogVisible, setMatchDialogVisible] = useState(false);
  const [matchDialogText, setMatchDialogText] = useState('');

  const handleAnalyze = async () => {
    if (!model.bookDetail) {
      message.error('书籍信息不存在');
      return;
    }
    
    // 使用文件夹名作为分析文本
    const folderName = model.bookDetail.dirName || model.bookDetail.name;
    setMatchDialogText(folderName);
    
    // 调用LLM分析
    const result = await model.analyzeFolderName();
    if (result && result.success) {
      // 显示MatchTagDialog
      setMatchDialogVisible(true);
    }
  };

  const handleMatchOk = async (title: string | undefined, tags: YouComicAPI.MatchTag[]) => {
    if (!model.bookDetail) {
      message.error('书籍信息不存在');
      return;
    }

    try {
      // 准备更新数据
      const updateData: any = {};
      
      // 更新标题
      if (title) {
        updateData.name = title;
      }
      
      // 更新标签
      if (tags.length > 0) {
        const updateTags = tags.map(tag => ({
          name: tag.name,
          type: tag.type
        }));
        updateData.updateTags = updateTags;
        updateData.overwriteTag = true;
      }
      
      // 调用更新API
      if (Object.keys(updateData).length > 0) {
        await updateBook(model.bookDetail.id, updateData);
        message.success('书籍信息更新成功');
        // 重新加载书籍信息
        await model.initData(model.bookDetail.id.toString());
      }
      
      setMatchDialogVisible(false);
    } catch (error: any) {
      console.error('更新书籍信息失败:', error);
      message.error('更新书籍信息失败: ' + (error.message || '未知错误'));
    }
  };

  return (
    <div>
      {
        model.bookDetail && (
          <Card 
            title="基本信息" 
            extra={
              <Button 
                type="primary" 
                icon={<RobotOutlined />}
                onClick={handleAnalyze}
                loading={model.analysisLoading}
              >
                LLM智能分析
              </Button>
            }
          >
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

      {/* LLMMatchTagDialog */}
      <LLMMatchTagDialog
        open={matchDialogVisible}
        onCancel={() => setMatchDialogVisible(false)}
        onMatchOk={handleMatchOk}
        text={matchDialogText}
        llmTags={model.llmMatchTags}
      />
    </div>
  )
}

export default BookDetailBasePanel
