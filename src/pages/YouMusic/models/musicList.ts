import {useState} from "react";
import {fetchMusicList, updateMusic, uploadMusicCover} from "@/services/youmusic/music";
import {getYouMusicConfig} from "@/utils/config";
import {DataPagination} from "@/utils/page";
import {MusicEditInitValues, MusicEditValues} from "@/components/YouMusic/MusicEditor";
import {updateMusicTags} from "@/services/youmusic/tag";

export type MusicItem = {
  editor?: MusicEditInitValues
} & YouMusicAPI.Music
export type UpdateInfo = {
  open: boolean
  total: number
  success: number
  fail: number
  name: string
}
const musicListModel = () => {
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    pageSize: 50,
    total: 0
  })
  const [contextMusics, setContextMusics] = useState<MusicItem[]>([])
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    total: 0,
    success: 0,
    fail: 0,
    name: "",
    open: false
  })
  const loadData = async (
    {
      page = pagination,
      title,
      album,
      artist
    }: {
      page?: DataPagination,
      title?: string,
      album?: string
      artist?:string
    }) => {
    const response = await fetchMusicList({
      page: page.page,
      pageSize: page.pageSize,
      search: title,
      albumSearch:album,
      artistSearch:artist,
      withTag:"1"
    })
    if (response?.data) {
      const config = getYouMusicConfig()
      if (!config) {
        return
      }
      const newList = response.data
      newList.forEach((music) => {
        if (music.album?.cover) {
          music.album.cover = config.baseUrl + music.album.cover
        }
      })
      setMusicList(newList)
      setPagination({
        page: page.page,
        pageSize: page.pageSize,
        total: response.count
      })
      setContextMusics([])
    }
  }
  const getEditValues = (): MusicEditInitValues => {
    if (contextMusics.length === 0) {
      return {}
    }
    let title: string | undefined = contextMusics[0].title
    contextMusics.forEach(it => {
      if (it.title !== title) {
        title = undefined
      }
    })

    // get first has artist music
    const initArtistMusic: MusicItem | undefined = contextMusics.find(it => {
      if (it.artist && it.artist.length > 0) {
        return true
      }
      if (it.editor?.artist && it.editor?.artist.length > 0) {
        return true
      }
      return false
    })
    let artist: string[] = []
    if (initArtistMusic) {
      artist = initArtistMusic.artist.map(it => it.name)
      contextMusics.forEach(it => {
        if (!it.artist) {
          artist = []
          return
        }
        it.artist.forEach((artistItem) => {
          if (!artist.includes(artistItem.name)) {
            artist = []
          }
        })
      })
    }


    // get first has album
    let album: string | undefined
    const initAlbumMusic: MusicItem | undefined = contextMusics.find(it => {
      if (it.album) {
        return true
      }
      if (it.editor?.album) {
        return true
      }
      return false
    })
    if (initAlbumMusic) {
      album = initAlbumMusic.album?.name
      contextMusics.forEach(it => {
        if (it.album?.name !== album) {
          album = undefined
        }
      })
    }
    // get first album cover

    const initAlbumCoverMusic: MusicItem | undefined = contextMusics.find(it => {
      if (it.album?.cover) {
        return true
      }
      return false
    })
    let albumCover: string | undefined = initAlbumCoverMusic?.album?.cover
    // get first track
    const initTrackMusic: MusicItem | undefined = contextMusics.find(it => {
      if (it.track) {
        return true
      }
      if (it.editor?.track) {
        return true
      }
      return false
    })
    let track: number | undefined
    if (initTrackMusic) {
      track = initTrackMusic.track
      contextMusics.forEach(it => {
        if (it.track !== track) {
          track = undefined
        }
      })
    }

    // get first has tag music
    const initTagMusic: MusicItem | undefined = contextMusics.find(it => {
      if (it.tag && it.tag.length > 0) {
        return true
      }
      if (it.editor?.tags && it.editor?.tags.length > 0) {
        return true
      }
      return false
    })
    let tag: string[] = []
    if (initTagMusic) {
      tag = initTagMusic.tag?.map(it => it.name) ?? []
      contextMusics.forEach(it => {
        if (!it.tag) {
          tag = []
          return
        }
        it.tag.forEach((tagItem) => {
          if (!tag.includes(tagItem.name)) {
            tag = []
          }
        })
      })
    }
    console.log({
      title,
      artist,
      album,
      cover: albumCover,
      track,
      tag
    })
    return {
      title,
      artist,
      album,
      cover: albumCover,
      track,
      tags: tag
    }
  }

  const updateValues = (values: MusicEditValues) => {
    const newList = contextMusics
    console.log(values)
    newList.forEach(it => {
      if (!it.editor) {
        it.editor = {}
      }
      if (values.title && values.title !== it.title) {
        it.editor.title = values.title
      }
      if (values.artist) {
        // same
        let isSame = false
        if (values.artist.length !== it.artist.length) {
          isSame = false
        }else{
          for (let i = 0; i < values.artist.length; i++) {
            if (it.artist[i]?.name !== values.artist[i]) {
              isSame = false
              break
            }
            isSame = true
          }
        }
        if (!isSame) {
          it.editor.artist = values.artist
        }
      }
      if (values.album && values.album !== it.album?.name) {
        it.editor.album = values.album
      }
      if (values.track && values.track !== it.track) {
        it.editor.track = values.track
      }
      if (values.cover) {
        it.editor.coverFile = values.cover
      }
      if (values.tags && values.tags.length > 0) {
        it.editor.tags = values.tags
      }
    })
    setContextMusics(newList)
    setIsEditorOpen(false)
  }
  const applyEdit = async () => {
    const updateProgress = {
      total: contextMusics.length,
      success: 0,
      fail: 0,
      name: "",
      open: true
    }
    setUpdateInfo(updateProgress)
    for (let music of musicList) {
      updateProgress.name = music.title
      setUpdateInfo({...updateProgress})
      if (music.editor) {
        try {
          await updateMusic(music.id, music.editor)
        } catch (e) {
          updateProgress.fail++
          continue
        }
        if (music.editor.coverFile) {
          try {
            await uploadMusicCover(music.id, music.editor.coverFile)
          } catch (e) {
            updateProgress.fail++
            continue
          }
        }
        if (music.editor.tags) {
          try {
            await updateMusicTags(music.id, music.editor.tags,true)
          } catch (e) {
            updateProgress.fail++
            continue
          }
        }
        updateProgress.success++
      }
      setUpdateInfo({...updateProgress})
    }
    setUpdateInfo({
      ...updateProgress,
      open: false
    })
    await loadData({page: pagination})
  }
  const hasEditedMusic = (): boolean => {
    return musicList.some(it => it.editor)
  }
  return {
    loadData,
    musicList,
    pagination,
    setContextMusics,
    contextMusics,
    isEditorOpen,
    setIsEditorOpen,
    getEditValues,
    updateValues,
    applyEdit,
    hasEditedMusic,
    updateInfo
  }
}
export default musicListModel
