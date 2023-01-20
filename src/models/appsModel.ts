import {useEffect, useState} from "react";

export type YouVideoConfig = {
  baseUrl: string
  token?: string
}
export type YouPhotoConfig = {
  baseUrl: string
  token?: string
}
export type YouMusicConfig = {
  baseUrl: string
  token?: string
}

export type YouComicConfig = {
  baseUrl: string
  token?: string
}
const appsModel = () => {
  const [youvideoConfig, setYouvideoConfig] = useState<YouVideoConfig | null>(null)
  useEffect(() => {
    const youvideoConfig = localStorage.getItem('YouVideoConfig')
    if (youvideoConfig) {
      setYouvideoConfig(JSON.parse(youvideoConfig))
    }
  }, [])
  const updateYouVideoConfig = (config: YouVideoConfig) => {
    setYouvideoConfig(config)
    localStorage.setItem("YouVideoConfig", JSON.stringify(config))
  }
  return {
    youvideoConfig,
    updateYouVideoConfig
  }
}
export default appsModel
