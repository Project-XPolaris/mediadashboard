import {YouComicConfig, YouMusicConfig, YouPhotoConfig, YouVideoConfig} from "@/models/appsModel";

export const getYouVideoConfig = ():YouVideoConfig | null => {
  if (localStorage.getItem('YouVideoConfig') !== null) {
    return JSON.parse(localStorage.getItem('YouVideoConfig')!)
  }
  return null
}

export const getYouMusicConfig = ():YouMusicConfig | null => {
  if (localStorage.getItem('YouMusicConfig') !== null) {
    return JSON.parse(localStorage.getItem('YouMusicConfig')!)
  }
  return null
}
export const getYouPhotoConfig = ():YouPhotoConfig | null => {
  if (localStorage.getItem('YouPhotoConfig') !== null) {
    return JSON.parse(localStorage.getItem('YouPhotoConfig')!)
  }
  return null
}

export const getYouComicConfig = ():YouComicConfig | null => {
  if (localStorage.getItem('YouComicConfig') !== null) {
    return JSON.parse(localStorage.getItem('YouComicConfig')!)
  }
  return null
}
