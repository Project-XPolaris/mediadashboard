import {Modal} from "antd";
import {HexColorPicker} from "react-colorful";
import {useState} from "react";

export type ColorPickValues = {
  color: string
}
export type ColorPickerDialogProps = {
  open?: boolean
  onClose?: () => void
  onSelectColor?: (color: string) => void
  onOk?: (values: ColorPickValues) => void
}
export const ColorPickerDialog = ({open, onOk, onClose}: ColorPickerDialogProps) => {
  const [selectColor, setSelectColor] = useState<string>("#000000")
  return (
    <Modal
      open={open}
      onOk={() => {
        console.log(onOk)
        onOk && onOk({
          color: selectColor,
        })
      }}
      title={"Pick Color"}
      onCancel={onClose}
    >
      <HexColorPicker
        onChange={(color) => setSelectColor(color)}
        defaultValue={selectColor}
      />
    </Modal>
  )
}
export default ColorPickerDialog
