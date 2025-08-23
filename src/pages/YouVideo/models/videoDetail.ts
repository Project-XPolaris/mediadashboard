import {fetchVideo} from "@/services/youvideo/video";
import {message} from "antd";
import {useState} from "react";

const videoDetailModel = () => {
  const [video, setVideo] = useState<YouVideoAPI.Video | undefined>();
  const loadData = async ({id}: { id: number }) => {
    const response = await fetchVideo(id)
    if (!response.success) {
      message.error(response.err)
      return
    }
    const data = response.data
    if (!data) {
      message.error("video is null")
      return
    }
    const token = localStorage.getItem('token')
    const tokenParam = token ? `?token=${token}` : ''
    if (data.files) {
      data.files.forEach((file) => {
        if (file.cover) {
          file.cover = "/api/video" + file.cover + tokenParam
        }
      })
    }
    setVideo(data)
  }
  const getCover = () => {
    if (!video?.files || video.files.length === 0) return undefined
    return video.files[0].cover
  }
  return {
    video,
    loadData,
    getCover,
  }
}
export default videoDetailModel


