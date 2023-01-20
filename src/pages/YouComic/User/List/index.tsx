import {PageContainer, ProColumnType, ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {useEffect} from "react";

const userListPage = () => {
  const model = useModel('YouComic.userList')
  useEffect(() => {
    model.loadData({})
  },[])
  const columns:ProColumnType<YouComicAPI.User>[]  = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      search: false,
    }
  ]
  return (
    <PageContainer>
      <ProTable dataSource={model.users} columns={columns} />
    </PageContainer>
  )
}
export default userListPage
