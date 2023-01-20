import {BangumiAPI} from "@/services/bangumi/types";
import {bangumiClient} from "@/services/bangumi/client";

export const searchSubject = async (key:string,type:number): Promise<BangumiAPI.SearchSubjectResult> => {
  console.log({key,type})
  return bangumiClient(`/search/subject/${key}`, {
    method: 'GET',
    params: {
      type,
      responseGroup:'large'
    }
  });
}
