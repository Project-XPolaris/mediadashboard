import {PageContainer, ProDescriptions, ProTable, ProCard} from "@ant-design/pro-components";
import {useParams} from "@umijs/max";
import {useEffect, useState} from "react";
import {getLibrary, getLibraryScanHistories, matchLibraryBooksTag, scanLibraryById, generateLibraryThumbnail} from "@/services/youcomic/library";
import {newWriteBookMetaTask} from "@/services/youcomic/task";
import {Button, Space, Tag, message} from "antd";
import {FolderOpenOutlined, SyncOutlined, TagsOutlined, PictureOutlined, FileTextOutlined} from "@ant-design/icons";

const YouComicLibraryDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<YouComicAPI.Library | undefined>()
  const [histories, setHistories] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await getLibrary(Number(id))
      setData(res)
    } finally {
      setLoading(false)
    }
  }
  const fetchHistories = async (p = page, ps = pageSize) => {
    if (!id) return
    const res = await getLibraryScanHistories(Number(id), { page: p, page_size: ps })
    setHistories(res.result || [])
    setTotal(res.count || 0)
    setPage(p)
    setPageSize(ps)
  }
  useEffect(() => {
    fetchData()
    fetchHistories(1, 10)
  }, [id])
  const onScan = async () => {
    if (!data) return
    await scanLibraryById({ id: data.id as unknown as number })
    message.success('Scan task added')
  }
  const onMatch = async () => {
    if (!data) return
    await matchLibraryBooksTag(data.id as unknown as number)
    message.success('Match tag task added')
  }
  const onGenerateThumb = async () => {
    if (!data) return
    await generateLibraryThumbnail(data.id as unknown as number, false)
    message.success('Generate thumbnails task added')
  }
  const onWriteMeta = async () => {
    if (!data) return
    await newWriteBookMetaTask({ libraryId: data.id as unknown as number })
    message.success('Write meta task added')
  }
  return (
    <PageContainer
      loading={loading}
      header={{
        title: (
          <Space>
            <FolderOpenOutlined />
            <span>{data?.name || `Library #${id}`}</span>
          </Space>
        ),
        subTitle: data?.path,
        onBack: () => window.history.back(),
        extra: [
          <Button key="scan" icon={<SyncOutlined />} onClick={onScan}>Scan</Button>,
          <Button key="match" icon={<TagsOutlined />} onClick={onMatch}>Match Tags</Button>,
          <Button key="thumb" icon={<PictureOutlined />} onClick={onGenerateThumb}>Thumbnails</Button>,
          <Button key="meta" icon={<FileTextOutlined />} onClick={onWriteMeta}>Write Meta</Button>,
        ]
      }}
    >
      <ProCard tabs={{ type: 'line' }}>
        <ProCard.TabPane key="overview" tab="Overview">
          <ProDescriptions<YouComicAPI.Library>
            column={2}
            dataSource={data}
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: 'Name', dataIndex: 'name' },
              { title: 'Path', dataIndex: 'path', span: 2 },
              { title: 'Created At', dataIndex: 'created_at', render: (_:any, rec:any) => rec.created_at ? new Date(rec.created_at).toLocaleString() : '-' },
              { title: 'Updated At', dataIndex: 'updated_at', render: (_:any, rec:any) => rec.updated_at ? new Date(rec.updated_at).toLocaleString() : '-' },
            ]}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="history" tab="Scan Histories">
          <ProTable
            rowKey={(r) => String(r.ID)}
            search={false}
            dataSource={histories}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (p, ps) => fetchHistories(p, ps)
            }}
            columns={[
              { title: 'ID', dataIndex: 'ID', width: 80 },
              { title: 'Total', dataIndex: 'Total', width: 100 },
              { title: 'Errors', dataIndex: 'ErrorCount', width: 100 },
              { title: 'Status', dataIndex: 'Status', width: 120, render: (_:any, rec:any) => {
                const status = (rec.Status || '').toString().toLowerCase();
                const color = status === 'complete' ? 'green' : status === 'error' ? 'red' : status === 'stop' ? 'orange' : 'blue';
                return <Tag color={color}>{rec.Status}</Tag>
              } },
              { title: 'Finished', dataIndex: 'FinishedAt', render: (_:any, rec:any) => rec.FinishedAt ? new Date(rec.FinishedAt * 1000).toLocaleString() : '-' },
            ]}
          />
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  )
}

export default YouComicLibraryDetailPage


