import {Button, Modal, Space, Tag, Typography} from "antd";
import {useState} from "react";
import {Task} from "@/services/types";
import {fetchTaskById as youVideoFetchTaskById} from "@/services/youvideo/task";
import {ProDescriptions, ProList} from "@ant-design/pro-components";
import styles from './style.less'
import {getStatusColor} from "@/utils/color";
import {formatTimeToHuman} from "@/utils/time";
import GetRender from "@/components/TaskViewer/SubTask/task";
import {useRequest} from "ahooks";
import {fetchTaskById as youPhotoFetchTaskById} from "@/services/youphoto/task";

export type TaskViewerProps<T> = {
  open?: boolean
  onClose?: () => void
  taskId?: string
  service: string
}
const TaskViewer = (
  {
    open,
    onClose,
    taskId,
    service
  }: TaskViewerProps<any>) => {
  if (!taskId) {
    return <></>
  }
  const [currentTask, setCurrentTask] = useState<string | undefined>(taskId)
  const [nestedDialogOpen, setNestedDialogOpen] = useState<boolean>(false)
  const refreshTask = async () => {
    if (taskId === undefined) {
      return undefined
    }
    let taskResponse
    switch (service){
      case 'YouVideo':
        taskResponse = await youVideoFetchTaskById(taskId)
        break
      case 'YouPhoto':
        taskResponse = await youPhotoFetchTaskById(taskId)
        break
    }
    if (!taskResponse) {
      return undefined
    }
    if (taskResponse.success) {
      return taskResponse.data
    }
    return undefined
  }
  const refreshData = useRequest<Task<any> | undefined, any>(refreshTask, {
    pollingInterval: 1000,
    pollingWhenHidden:false
  });


  const getTtile = () => {
    if (!refreshData.data) {
      return 'Task'
    }
    return `${refreshData.data.type}(${refreshData.data.status}) - ${refreshData.data.id}`
  }
  return (
    <Modal
      open={open}
      title={getTtile()}
      onCancel={onClose}
      width={"80%"}
      // footer={
      //   <Row>
      //     <Col span={6}>
      //       <Space>
      //         <Button>
      //           Cancel
      //         </Button>
      //         <Button>
      //           OK
      //         </Button>
      //       </Space>
      //     </Col>
      //   </Row>
      //
      // }
    >
      {
        refreshData.data && (
          <>
            {
              currentTask && <TaskViewer
                taskId={currentTask}
                open={nestedDialogOpen}
                onClose={() => setNestedDialogOpen(false)}
                service={service}
              />
            }
            <ProDescriptions column={3}>
              <ProDescriptions.Item label={"id"}>
                {refreshData.data.id}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={"type"}>
                {refreshData.data.type}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={"status"}>
                {refreshData.data.status}
              </ProDescriptions.Item>
            </ProDescriptions>
            <Typography.Title level={5}>
              Sub tasks
            </Typography.Title>
            <div className={styles.subTaskContainer}>
              <ProList<Task<any>>
                dataSource={refreshData.data.subTask}
                rowKey={refreshData.data.id}
                metas={{
                  title: {
                    render: (text, row) => {
                      return GetRender(service, row?.type).title(row)
                    }
                  },
                  description: {
                    render: (text, row) => {
                      const render = GetRender(service, row?.type)
                      if (render.description) {
                        return render.description(row)
                      }
                      return ""
                    }
                  },
                  subTitle: {
                    render: () => {
                      return (
                        <Space size={0}>
                        </Space>
                      );
                    },
                  },
                  actions: {
                    render: (text, row) => [
                      <Tag>{row?.duration ? formatTimeToHuman(row.duration) : "Unknown time"}</Tag>,
                      <Tag color={getStatusColor(row.status)}>{row.status}</Tag>,
                      <Button size={"small"} onClick={() => {
                        setCurrentTask(row.id)
                        setNestedDialogOpen(true)
                      }}>Detail</Button>
                    ],
                  },
                }}
                size={"small"}
              />
            </div>
          </>
        )
      }
    </Modal>
  )
}
export default TaskViewer
