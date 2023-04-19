import {Modal} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useEffect, useState} from "react";

export type TextDisplayDialogProps = {
  open?: boolean
  onClose?: () => void
  text?: string
}
const TextDisplayDialog = ({ open,onClose,text }:TextDisplayDialogProps) => {
  const [displayText, setDisplayText] = useState<string>('')
  useEffect(() => {
    if (text) {
      setDisplayText(text)
    }
  }, [text]);

  return (
      <Modal open={open} onCancel={onClose} title={"Text"}>
        <TextArea
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
          minLength={320}
          style={{ height: 320, marginBottom: 24 }}
        />
      </Modal>
  );
};
export default TextDisplayDialog;
