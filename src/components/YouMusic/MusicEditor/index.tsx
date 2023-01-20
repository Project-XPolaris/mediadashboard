import {Button, Drawer, Space} from "antd";
import {ProForm, ProFormGroup, ProFormInstance, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import styles from './styles.less'
import {useRef, useState} from "react";
import {useRequest} from "ahooks";
import {fetchArtistList} from "@/services/youmusic/artist";
import {fetchTagList} from "@/services/youmusic/tag";
import AlbumMetaSearchDialog from "@/components/YouMusic/AlbumMetaSearchDialog";

export type MusicEditInitValues = {
  title?: string
  artist?: string[]
  cover?: string
  album?: string
  track?: number
  coverFile?: File
  tags?: string[]
}
export type MusicEditValues = {
  title?: string
  artist: string[]
  album?: string
  track?: number,
  cover?: File,
  tags?: string[]
}
export type MusicEditorProps = {
  open?: boolean
  onSave: (values: MusicEditValues) => void
  onClose: () => void
} & MusicEditInitValues
const MusicEditor = ({title, open, onClose, artist, cover, album, track, onSave, tags}: MusicEditorProps) => {
  const [searchAlbumMetaDialogOpen, setSearchAlbumMetaDialogOpen] = useState(false)
  const refreshSearchArtist = async (search?: string) => {
    if (!search || search.length < 2) {
      return
    }
    const response = await fetchArtistList({search, page: 1, pageSize: 20})
    if (response.data) {
      return response.data
    }
    return []
  }
  const searchArtistController = useRequest(refreshSearchArtist, {
    debounceWait: 300,
    manual: true
  });
  const artistOptions = (): string[] => {
    const searchArtists = (searchArtistController.data?.map((item) => item.name) ?? [])
    // remove same
    const artists = artist?.filter((item) => !searchArtists.includes(item)) ?? []
    return [...artists, ...searchArtists]
  }
  const refreshSearchTag = async (search?: string) => {
    if (!search || search.length < 2) {
      return
    }
    const response = await fetchTagList({search, page: 1, pageSize: 20})
    if (response.data) {
      return response.data
    }
    return []
  }
  const searchTagController = useRequest(refreshSearchTag, {
    debounceWait: 300,
    manual: true
  });
  const tagOptions = (): string[] => {
    const searchTags = (searchTagController.data?.map((item) => item.name) ?? [])
    // remove same
    const tag = tags?.filter((item: string) => !searchTags.includes(item)) ?? []
    return [...tag, ...searchTags]
  }
  const formRef = useRef<ProFormInstance>();
  const [coverFile, setCoverFile] = useState<File>()
  const onFileChange = (event: any) => {
    // Update the state
    setCoverFile(event.target.files[0])
  };
  const closeHandler = () => {
    onClose()
    setCoverFile(undefined)
  }

  return (
    <Drawer title={title} width={720} open={open} onClose={closeHandler} extra={
      <>
        <Space>
          <Button
            onClick={() => setSearchAlbumMetaDialogOpen(true)}
          >Search Album</Button>
        </Space>
        <Space>
          <Button
            onClick={() => {
              onSave({
                ...(formRef.current?.getFieldsValue() as MusicEditValues),
                cover: coverFile
              })
            }}
          >Save</Button>
        </Space>

      </>
    }>
      <AlbumMetaSearchDialog
        open={searchAlbumMetaDialogOpen}
        onOk={async values => {
          const form = formRef.current
          if (!form) {
            return
          }
          form.setFieldsValue({
            artist: values.artist,
            album: values.name,
          })
          if (values.cover) {
            let blob = await fetch(values.cover).then(r => r.blob());
            setCoverFile(new File([blob], "cover.jpg", {type: "image/jpeg"}))
          }
          setSearchAlbumMetaDialogOpen(false)
        }}
        onCancel={() => setSearchAlbumMetaDialogOpen(false)}
      />
      {
        open && <ProForm
          formRef={formRef}
          submitter={{
            render: (props, dom) => {
              return (
                <div></div>
              )
            }
          }}
        >
          <ProFormGroup>
            <ProFormText name="title" label="Title" initialValue={title} width={"xl"}/>
            <ProFormSelect
              mode={'tags'}
              name="artist"
              label="Artist"
              initialValue={artist}
              width={"xl"}
              showSearch
              options={artistOptions()}
              fieldProps={{
                onSearch: (value) => {
                  searchArtistController.run(value)
                },
              }}
            />
          </ProFormGroup>
          <ProFormGroup title={"Album"}>
            <div>
              <img src={coverFile ? URL.createObjectURL(coverFile) : cover} className={styles.cover}/>
              <div>
                <input type="file" onChange={onFileChange} className={styles.uploadInput}/>
              </div>
            </div>
            <ProFormText name="album" label="Album" initialValue={album} width={"xl"}/>
          </ProFormGroup>
          <ProFormGroup title={"Meta"}>
            <ProFormText name="track" label="Track" initialValue={track}/>
            <ProFormSelect
              mode={'tags'}
              name="tags"
              label="Tags"
              initialValue={tags}
              width={"xl"}
              showSearch
              options={tagOptions()}
              fieldProps={{
                onSearch: (value) => {
                  searchTagController.run(value)
                },
              }}
            />
          </ProFormGroup>
        </ProForm>
      }

    </Drawer>
  )
}
export default MusicEditor
