import {Divider, Input, List, message, Modal, Typography} from "antd";
import styles from './style.less'
import {useEffect, useState} from "react";
import {fetchAlbumMeta, searchAlbumMeta} from "@/services/youmusic/meta";
import {isArray} from "lodash";

export type AlbumMetaSearchDialogProps = {
  open: boolean
  onOk: (values:AlbumMetaValues) => void
  onCancel: () => void
}
export type AlbumMetaValues = {
  name: string
  artist: string[]
  cover?: string
}
export type SearchResult = {
  isSelected?: boolean,
} & YouMusicAPI.SearchAlbumMeta
const AlbumMetaSearchDialog = ({open,onCancel,onOk}: AlbumMetaSearchDialogProps) => {
  const [result, setResult] = useState<SearchResult[]>([])
  const [contextAlbum, setContextAlbum] = useState<SearchResult>()
  const [detail, setDetail] = useState<YouMusicAPI.AlbumMeta>()
  const fetchDetail = async (album: SearchResult) => {
    const query: any = {}
    switch (album.source) {
      case 'MusicBrain':
        query['mbId'] = album.id
        break
      case "NeteaseMusic":
        query['nemId'] = album.id
    }
    try {
      const res = await fetchAlbumMeta(query)
      if (res.data) {
        setDetail(res.data)
      }
    } catch (e) {
      message.error("fetch error")
    }

  }
  useEffect(() => {
    if (!contextAlbum) {
      return
    }
    fetchDetail(contextAlbum)
  }, [contextAlbum])
  const search = async (key: string) => {
    const response = await searchAlbumMeta(key)
    if (response.data) {
      setResult(response.data)
    }
  }
  const onDialogOk = () => {
    if (!contextAlbum) {
      return
    }

    const values: AlbumMetaValues = {
      name: contextAlbum.name,
      artist: isArray(contextAlbum.artists) ? contextAlbum.artists : [contextAlbum.artists],
      cover: contextAlbum.cover
    }
    onOk(values)
  }
  return (
    <Modal
      open={open}
      width={"60vw"}
      title={"Search album meta"}
      onCancel={onCancel}
      onOk={onDialogOk}
    >
      <Input.Search placeholder="input search text" onSearch={search}/>
      <Divider/>
      <div className={styles.container}>
        <div className={styles.left}>
          <List
            size="small"
            dataSource={result}
            renderItem={(item: SearchResult) => {
              return (
                <List.Item
                  key={item.id}
                  className={item.id === contextAlbum?.id ? styles.itemSelected : undefined}
                  onClick={() => {
                    setContextAlbum(item)
                  }}
                >
                  <div className={styles.item}>
                    {
                      item.cover ?
                        <img src={item.cover} alt={item.name} className={styles.itemCover}/> :
                        <div className={styles.itemNoCover}>
                          No cover
                        </div>
                    }
                    <div>
                      <div>
                        <Typography.Text strong>{item.name}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text>{item.artists}</Typography.Text>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )
            }}
          />
        </div>
        <div className={styles.right}>
          {
            detail &&
            <div>
              <img className={styles.cover} src={detail.cover} alt=""/>
              <div>
                <Typography.Text strong>{detail.name}</Typography.Text>
              </div>
              <div>
                <Typography.Text>{detail.artist}</Typography.Text>
              </div>
            </div>
          }

        </div>
      </div>
    </Modal>
  )
}
export default AlbumMetaSearchDialog
