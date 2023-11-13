import {Button} from "antd";
import ColorPickerDialog from "@/components/YouPhoto/ColorPickerDialog";
import {
  DrawerForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormSlider,
  ProFormText
} from "@ant-design/pro-components";
import React, {useRef, useState} from "react";
import {useModel} from "@umijs/max";
import {RankColor} from "@/pages/YouPhoto/Photo/List/index";

export type ImageDrawerFilterProps = {
  open?: boolean
  rankColor: RankColor
  onClose?: () => void
  trigger?: any
  setRankColor: (rankColor: RankColor) => void
}
const ImageDrawerFilter= (
  {
    open,onClose,rankColor,trigger,setRankColor
  }: ImageDrawerFilterProps) => {
  const model = useModel('YouPhoto.Photo.List.model');
  const [pickupColorDialogOpen, setPickupColorDialogOpen] = useState(false)
  const [pickupColorTarget, setPickupColorTarget] = useState<any>()
  const formRef = useRef<ProFormInstance>()

  return (
    <DrawerForm
      title="Filter"
      open={open}
      onFinish={async (values) => {
        await model.updateFilter(values)
        onClose
      }}
      drawerProps={{
        onClose: onClose
      }}
      width={500}
      trigger={trigger}
      formRef={formRef}
      initialValues={{
        maxDistance: 100
      }}
    >
      <ColorPickerDialog
        open={pickupColorDialogOpen}
        onClose={() => setPickupColorDialogOpen(false)}
        onOk={({color}) => {
          formRef.current?.setFieldValue(pickupColorTarget, color)
          setPickupColorDialogOpen(false)
          if (pickupColorTarget) {
            setRankColor({
              ...rankColor,
              [pickupColorTarget]: color
            })
          }
        }}
      />
      <ProForm.Group>
        <ProFormSelect
          allowClear={false}
          name="libraryId"
          placeholder="Select Library"
          label="Library"
          width={200}
          options={[
            {
              label: 'All',
              value: undefined
            },
            ...model.libraryList.map(lib => {
              return {
                label: `${lib.name}(${lib.id})`,
                value: lib.id
              }
            })]}/>
      </ProForm.Group>
      <ProForm.Group title={"Color Match"}>
        <ProFormText
          width={140}
          name="colorRank1"
          label="ColorRank1"
          fieldProps={{
            prefix: (
              <div style={{width: 8, height: 8, background: rankColor.colorRank1}}/>
            ),
          }}
          extra={
            <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
              setPickupColorDialogOpen(true)
              setPickupColorTarget('colorRank1')
            }}
            >Pickup</Button>
          }
        />
        <ProFormText
          name="colorRank2"
          label="ColorRank2"
          width={120}
          fieldProps={{
            prefix: (
              <div style={{width: 8, height: 8, background: rankColor.colorRank2}}/>
            ),
          }}
          extra={
            <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
              setPickupColorDialogOpen(true)
              setPickupColorTarget('colorRank2')
            }}
            >Pickup</Button>
          }
        />
        <ProFormText
          width={120}
          name="colorRank3"
          label="ColorRank3"
          fieldProps={{
            prefix: (
              <div style={{width: 8, height: 8, background: rankColor.colorRank3}}/>
            ),
          }}
          extra={
            <Button size={"small"} type={'link'} style={{marginTop: 4}} onClick={() => {
              setPickupColorDialogOpen(true)
              setPickupColorTarget('colorRank3')
            }}
            >Pickup</Button>
          }
        />
        <ProFormSlider
          width={120}
          name="maxDistance"
          label="MaxDistance"
          max={300}
          min={0}
        />
      </ProForm.Group>
      {
        model.filter.nearImageId && (
          <ProForm.Group title={"Near image"} extra={
            <Button
              type={"text"}
              onClick={() => model.setFilter({
                ...model.filter,
                nearImageId: undefined
              })}>Clear</Button>
          }>
            <img src={model.getCurrentNearImage()?.thumbnailUrl} width={120}/>
            <ProFormSlider name="nearImageDistance"
                           label="Near Image Distance"
                           max={50}
                           min={0}/>
          </ProForm.Group>
        )
      }
      <ProForm.Group title={"Size"}>
        <ProFormText label={"Max Width"} name={"maxWidth"}/>
        <ProFormText label={"Min Width"} name={"minWidth"}/>
        <ProFormText label={"Max Height"} name={"maxHeight"}/>
        <ProFormText label={"Min Height"} name={"minHeight"}/>
      </ProForm.Group>
      <ProForm.Group title={"Deepdanbooru"}>
        <ProFormSelect name={"dbTag"} label={"Include Tag"} mode={"tags"} width={"xl"}/>
        <ProFormSelect name={"dbTagNot"} label={"Not Include Tag"} mode={"tags"} width={"xl"}/>
      </ProForm.Group>
      <ProForm.Group title={"Tagger"}>
        <ProFormSelect name={"tag"} label={"Include Tag"} mode={"tags"} width={"xl"}/>
        <ProFormSelect name={"tagNot"} label={"Not Include Tag"} mode={"tags"} width={"xl"}/>
      </ProForm.Group>

    </DrawerForm>
  )
}

export default React.forwardRef(ImageDrawerFilter)
