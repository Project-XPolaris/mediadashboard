import {Avatar, Button, Checkbox, Divider, Input, List, message, Modal} from "antd";
import style from "./style.less";
import {FolderOutlined} from "@ant-design/icons";
import {useState} from "react";
import useExplore, {File} from "@/hooks/explore";
import {readDirectory} from "@/services/youvideo/library";

const NewYouVideoLibraryDialog = (
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
    onReadDir: readDirectory
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
                  title={<a href="#" onClick={() => explore.navigate(item.path)}>{item.name}</a>}
                  description="Directory"
                />
              </List.Item>
            );
          }}/>
      </div>
    </Modal>
  );
};
export default NewYouVideoLibraryDialog;
