import {Avatar, Button, Checkbox, Divider, Input, List, message, Modal} from "antd";
import style from "./style.less";
import {FolderOutlined} from "@ant-design/icons";
import {useState} from "react";
import useExplore, {Directory, File} from "@/hooks/explore";
import {fetchDirInfo} from "@/services/youphoto/library";

const NewYouPhotoLibraryDialog = (
  {
    onOk,
    onCancel,
    visible
  }: {
    onOk: (name: string, isPrivate: boolean, path: string) => void,
    onCancel: () => void,
    visible: boolean,
  }) => {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
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
    onOk(name, isPrivate, explore.currentPath);
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
      <Checkbox
        checked={isPrivate}
        onChange={(e) => setIsPrivate(e.target.checked)}
      >Private
      </Checkbox>
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
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FolderOutlined/>}/>}
                  title={<span style={{cursor: 'pointer', color: '#1890ff'}} onClick={() => explore.navigate(item.path)}>{item.name}</span>}
                  description="Directory"
                />
              </List.Item>
            );
          }}/>
      </div>
    </Modal>
  );
};
export default NewYouPhotoLibraryDialog;
