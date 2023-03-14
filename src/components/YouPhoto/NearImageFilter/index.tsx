import {PhotoItem} from "@/pages/YouPhoto/Photo/List/model";
import {Button, Slider} from "antd";
import {useState} from "react";

const NearImageFilter = (
  {
    image,
    onChange,
  }: {
    image: PhotoItem
    onChange?: (imageId: number, maxDistance: number) => void
  }) => {
  const [maxDistance, setMaxDistance] = useState(9)
  return (
    <div>
      <img src={image.thumbnailUrl} style={{width: 120}}/>
      <Slider
        defaultValue={maxDistance}
        min={0}
        max={50}
        onChange={(value) => setMaxDistance(value)}
      />
      <Button
        onClick={() => {
          if (onChange) {
            onChange(image.id, maxDistance)
          }
        }}
      >Apply</Button>
    </div>
  )
}
export default NearImageFilter
