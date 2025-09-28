import {Avatar, Button, Input, List, message, Modal} from "antd";
import style from "./style.less";
import {FolderOutlined} from "@ant-design/icons";
import useExplore, {File} from "@/hooks/explore";
import {readDir} from "@/services/youmusic/library";

const NewYouMusicLibraryDialog = (
  {
    onOk,
    onCancel,
    visible
  }: {
    onOk: (path: string) => void,
    onCancel: () => void,
    visible: boolean,
  }) => {
  const explore = useExplore({
    onReadDir: readDir
  });
  const onConfirm = () => {
    if (explore.currentPath === "") {
      message.error("Path is required");
      return;
    }
    onOk(explore.currentPath);
  };
  return (
    <Modal
      title={"New Library"}
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <div className={style.selectorHeader}>
        <Button
          onClick={explore.goBack}
        >
          Back
        </Button>
        <Input
          className={style.pathInput}
          value={explore.currentPath}
          onChange={(e) => explore.setCurrentPath(e.target.value)}
        />
        <Button
          onClick={() => explore.navigate(explore.currentPath)}
        >
          GO
        </Button>
      </div>
      <div className={style.itemList}>
        <List
          dataSource={explore.getDirectoryList()}
          loading={explore.isLoading}
          renderItem={(item: File, index: number) => {
            return (
              <List.Item
                key={index}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FolderOutlined/>}/>}
                  title={<span style={{color: '#1890ff', cursor: 'pointer'}} onClick={() => explore.navigate(item.path)}>{item.name}</span>}
                  description="Directory"
                />
              </List.Item>
            );
          }}/>
      </div>
    </Modal>
  );
};
export default NewYouMusicLibraryDialog;
