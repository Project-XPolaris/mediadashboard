import {YouVideoConfig} from "@/models/appsModel";

export const getYouVideoConfig = ():YouVideoConfig | null => {
  if (localStorage.getItem('YouVideoConfig') !== null) {
    return JSON.parse(localStorage.getItem('YouVideoConfig')!)
  }
  return null
}