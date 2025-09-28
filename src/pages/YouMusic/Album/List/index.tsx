import {useModel, history} from "@umijs/max";
import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {useEffect} from "react";
import styles from './styles.less';
import {Divider} from "antd";
const AlbumListPage = () => {
  const model = useModel("YouMusic.albumList")
  useEffect(() => {
    model.loadData({})
  },[])
  const columns :ProColumnType<YouMusicAPI.Album>[] = [
    {
      title: 'cover',
      dataIndex: 'id',
      key: 'id',
      width: 48,
      hideInSearch: true,
      render: (text, record) => {
        if (!record.cover) {
          return <></>
        }
        return (
          <img src={record.cover} className={styles.cover}/>
        )
      }
    },{
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <a 
            onClick={() => history.push(`/youmusic/album/detail?id=${record.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {text}
          </a>
        )
      }
    },
    {
      title: 'artist',
      dataIndex: 'artist',
      key: 'artist',
      render: (text, record) => {
        if (!record.artist) {
          return <></>
        }
        return record.artist.map(artist => {
          return (
            <>
              {artist.name}
              <Divider type={"vertical"} />
            </>
          )
        })
      }
    }
  ]

  return (
    <PageContainer extra={
      <>
      </>
    }>
      <ProTable dataSource={model.albumList} columns={columns} />
    </PageContainer>
  )
}
export default AlbumListPage
