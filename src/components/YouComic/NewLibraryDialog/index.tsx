import {Avatar, Button, Divider, Input, List, message, Modal} from "antd";
import style from "./style.less";
import {FolderOutlined} from "@ant-design/icons";
import {useState} from "react";
import useExplore, {Directory, File} from "@/hooks/explore";
import {fetchDirInfo} from "@/services/youcomic/library";

const NewYouComicLibraryDialog = (
  {
    onOk,
    onCancel,
    visible
  }: {
    onOk: (name: string,path: string) => void,
    onCancel: () => void,
    visible: boolean,
  }) => {
  const [name, setName] = useState("");
  const explore = useExplore({
    onReadDir: async (path) => {
      const response = await fetchDirInfo(path)
      if (response?.data) {
        const dir:Directory = {
          sep: response.data.sep,
          files: response.data.files,
          backPath:response.data.backPath,
          path:response.data.path
        }
        return dir
      }
     return undefined
    }
  });
  const onConfirm = () => {
    if (name === "") {
      message.error("Name is required");
      return;
    }
    if (explore.currentPath === "") {
      message.error("Path is required");
      return;
    }
    onOk(name,explore.currentPath);
  };
  return (
    <Modal
      title={"New Library"}
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <Input
        placeholder={"Name"}
        className={style.nameInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Divider/>
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
                onClick={() => explore.navigate(item.path)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FolderOutlined/>}/>} 
                  title={item.name}
                  description="Directory"
                />
              </List.Item>
            );
          }}/>
      </div>
    </Modal>
  );
};
export default NewYouComicLibraryDialog;
