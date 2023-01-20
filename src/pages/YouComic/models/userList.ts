import {useState} from "react";
import {DataPagination} from "@/utils/page";
import {fetchUserList} from "@/services/youcomic/user";

const userList = () => {
  const [users, setUsers] = useState<YouComicAPI.User[]>([]);
  const [pagination, setPagination] = useState<DataPagination>({
    page: 1, pageSize: 20, total: 0
  })
  const loadData = async (
    {
      queryPagination = pagination
    }:{
      queryPagination?:DataPagination
    }
  ) => {
    const response = await fetchUserList({
      page: queryPagination.page,
      page_size: queryPagination.pageSize,
    })
    if (response.result) {
      setUsers(response.result)
      setPagination({
        page: queryPagination.page,
        pageSize: queryPagination.pageSize,
        total: response.count
      })
    }
  }
  return {
    users, setUsers,loadData
  }
}
export default userList
