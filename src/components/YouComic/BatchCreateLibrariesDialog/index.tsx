import {Avatar, Button, Checkbox, Divider, Input, List, Modal, Table} from "antd";
import style from "./style.less";
import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  BorderOutlined,
  CheckSquareOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  SwapOutlined
} from "@ant-design/icons";
import {useEffect, useMemo, useState} from "react";
import useExplore, {File} from "@/hooks/explore";
import {fetchDirInfo} from "@/services/youcomic/library";

type LibraryDraft = {
  path: string
  name: string
}

const BatchCreateLibrariesDialog = (
  {
    visible,
    onCancel,
    onSubmit
  }: {
    visible: boolean,
    onCancel: () => void,
    onSubmit: (libraries: LibraryDraft[], scan: boolean) => void
  }
) => {
  const [scan, setScan] = useState(false)
  const [drafts, setDrafts] = useState<LibraryDraft[]>([])
  const [filter, setFilter] = useState("")
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const PANEL_HEIGHT = 460
  const SCROLL_Y = 360
  const explore = useExplore({
    onReadDir: async (path) => {
      const response = await fetchDirInfo(path)
      if (response?.data) {
        return {
          sep: response.data.sep,
          files: response.data.files,
          backPath: response.data.backPath,
          path: response.data.path
        }
      }
      return undefined
    }
  })

  useEffect(() => {
    if (visible) {
      setDrafts([])
      setScan(false)
      setFilter("")
    }
  }, [visible])

  const subDirectories = useMemo(() => {
    return explore.getDirectoryList().filter((d: File) => d.name.toLowerCase().includes(filter.toLowerCase()))
  }, [explore.getDirectoryList(), filter])

  const onLoadSubDirs = async () => {
    const dirs = explore.getDirectoryList()
    const ds: LibraryDraft[] = dirs.map((d) => ({path: d.path, name: d.name}))
    setDrafts(ds)
    setSelectedRowKeys(ds.map(d => d.path))
  }

  const columns = [
    {
      title: 'Folder',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
      render: (_: any, rec: LibraryDraft) => (
        <div style={{display: 'flex', alignItems: 'center', minWidth: 0}}>
          <Avatar icon={<FolderOutlined/>} style={{marginRight: 8}}/>
          <span title={rec.path} style={{
            display: 'inline-block',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{rec.path}</span>
        </div>
      )
    },
    {
      title: 'Library Name',
      dataIndex: 'name',
      key: 'name',
      width: 360,
      render: (_: any, rec: LibraryDraft, index: number) => (
        <Input
          value={rec.name}
          size="large"
          style={{ width: '100%' }}
          onChange={(e) => {
            const newDrafts = [...drafts]
            newDrafts[index] = {...rec, name: e.target.value}
            setDrafts(newDrafts)
          }}
        />
      )
    }
  ]

  return (
    <Modal
      title={<span><AppstoreAddOutlined style={{ marginRight: 8 }}/>Batch Create Libraries</span>}
      visible={visible}
      onCancel={onCancel}
      onOk={() => onSubmit(drafts.filter(d => selectedRowKeys.includes(d.path)), scan)}
      width={'90vw'}
      bodyStyle={{ paddingBottom: 72 }}
    >
      <div className={style.selectorHeader}>
        <Button onClick={explore.goBack} icon={<ArrowLeftOutlined/>}>Back</Button>
        <Input className={style.pathInput} value={explore.currentPath} onChange={(e) => explore.setCurrentPath(e.target.value)}/>
        <Button onClick={() => explore.navigate(explore.currentPath)} icon={<PlayCircleOutlined/>}>GO</Button>
      </div>
      <div style={{display: 'flex', gap: 16}}>
        <div style={{flex: 1, height: PANEL_HEIGHT}}>
          <Divider><FolderOpenOutlined style={{marginRight: 6}}/>Subdirectories</Divider>
          <Input placeholder={'Filter folder name'} value={filter} onChange={(e) => setFilter(e.target.value)} allowClear prefix={<SearchOutlined/>} />
          <List
            dataSource={subDirectories}
            loading={explore.isLoading}
            style={{height: SCROLL_Y, overflow: 'auto', marginTop: 8}}
            renderItem={(item: File, index: number) => (
              <List.Item key={index} onClick={() => explore.navigate(item.path)} style={{cursor: 'pointer'}}>
                <List.Item.Meta avatar={<Avatar icon={<FolderOutlined/>}/>} title={item.name} description={"Directory"}/>
              </List.Item>
            )}
          />
          <Button type={'primary'} style={{marginTop: 8}} onClick={onLoadSubDirs} icon={<FolderOpenOutlined/>}>Load all subdirectories</Button>
        </div>
        <div style={{flex: 1, height: PANEL_HEIGHT, minWidth: 0}}>
          <Divider><AppstoreAddOutlined style={{marginRight: 6}}/>Preview Libraries</Divider>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Button onClick={() => setSelectedRowKeys(drafts.map(d => d.path))} icon={<CheckSquareOutlined/>}>Select All</Button>
            <Button onClick={() => setSelectedRowKeys([])} icon={<BorderOutlined/>}>Select None</Button>
            <Button onClick={() => {
              const current = new Set(selectedRowKeys)
              const inverted = drafts
                .filter(d => !current.has(d.path))
                .map(d => d.path)
              setSelectedRowKeys(inverted)
            }} icon={<SwapOutlined/>}>Invert Selection</Button>
          </div>
          <Table
            rowKey={(r) => r.path}
            size={'small'}
            pagination={false}
            dataSource={drafts}
            columns={columns as any}
            tableLayout="fixed"
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as string[])
            }}
            scroll={{ y: SCROLL_Y }}
          />
          <div style={{marginTop: 8}}>
            <Checkbox checked={scan} onChange={(e) => setScan(e.target.checked)}><PlayCircleOutlined style={{marginRight: 6}}/>Scan immediately after creation</Checkbox>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BatchCreateLibrariesDialog


