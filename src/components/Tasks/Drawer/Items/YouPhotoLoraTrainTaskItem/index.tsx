import {TaskItem} from "@/components/Tasks/Drawer/model";
import styles from './style.less'
import {Dropdown, message, Progress, Space, Tag} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import {interruptLoraTrain} from "@/services/youphoto/lora";

export type YouPhotoLoraTrainTaskItemProps = {
  task: TaskItem
  className?: string
}
const YouPhotoLoraTrainTaskItem = ({task, className}: YouPhotoLoraTrainTaskItemProps) => {
  const output = task.output as YouPhotoAPI.LoraTrainOutput
  const getPercent = () => {
    return Math.floor(output.progress * 100)
  }
  const interruptTask = async() => {
    try {
      await interruptLoraTrain({id: task.id})
    }catch (e){
      message.error("interrupt failed")
    }
  }
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.title}>{`Train lora from ${output.libraryName}`}</div>
        <Space>
          <Tag color={"green"} className={styles.tag}>YouPhoto</Tag>
          <Dropdown menu={{
            items:[
              {
                label:"Interrupt",
                key:"interrupt",
              }
            ],
            onClick:(menu) => {
              switch (menu.key) {
                case "interrupt":
                  interruptTask()
                  break
              }

            }
          }}>
            <MenuOutlined/>
          </Dropdown>
        </Space>

      </div>
      <div className={styles.content}>
        <Progress percent={getPercent()} className={styles.progress}/>
        <div className={styles.progressText}>
          {output.allStep}/{output.allTotalStep}
        </div>
      </div>
    </div>
  )
}
export default YouPhotoLoraTrainTaskItem
