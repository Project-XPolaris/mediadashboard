import {youMusicRequest} from "@/services/youmusic/client";
import {Task} from "@/services/types";

export const fetchYouMusicTaskList = (): Promise<{
  tasks:Task<YouMusicAPI.TaskOutput>[]
}> => {
  return youMusicRequest("/task", {
    method: "GET"
  });
}
