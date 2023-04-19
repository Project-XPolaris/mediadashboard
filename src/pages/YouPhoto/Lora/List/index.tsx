import {PageContainer, ProTable} from "@ant-design/pro-components";
import {Button, Card, Space} from "antd";
import {useModel} from "@umijs/max";
import LoraConfigDrawer, {LoraTrainConfig} from "@/components/YouPhoto/LoraConfigDrawer";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

const LoraListPage = () => {
  const model = useModel('YouPhoto.loraList')
  const [open, setOpen] = useState(false)
  const onOk = async (values: LoraTrainConfig) => {
    const name = values.name
    if (!name) {
      return
    }
    // remove name field
    values.name = undefined
    await model.saveConfig(name, values)
    setOpen(false)
  }
  useEffect(() => {
    model.refreshList()
  },[])
  return (
    <PageContainer
      extra={
        <Space>
          <Button  icon={<PlusOutlined/>} onClick={() => setOpen(true)}>Add</Button>
        </Space>
      }
    >
      <LoraConfigDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOk={onOk}
      />
      <Card>
        <ProTable
          search={false}
          dataSource={model.configList}
          columns={[
            {
              key: "id",
              dataIndex: "id",
              title: "ID"
            }, {
              key: "name",
              dataIndex: "name",
              title: "Name"
            },
            {
              key: "action",
              dataIndex: "id",
              title: "Action",
              render: (text,rec) => {
                return (
                  <Space>
                    <Button type={"link"} onClick={() => model.deleteConfig(rec.id)}>Delete</Button>
                  </Space>
                )
              }
            }
          ]}
          rowKey="id"

        />
      </Card>
    </PageContainer>
  )
}
export default LoraListPage
