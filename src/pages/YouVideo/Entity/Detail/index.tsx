import {useModel, useSearchParams} from "@@/exports";
import {PageContainer} from "@ant-design/pro-components";
import {Card} from "antd";
import {useEffect} from "react";

const EntityDetailPage = () => {
  const [searchParams] = useSearchParams();
  const model = useModel("YouVideo.entityDetail")
  useEffect(() => {
    model.loadData({id:Number(searchParams.get("id"))})
  },[])
  return (
    <PageContainer title={model.getEntityName()}>
      <Card />
    </PageContainer>
  )
};
export default EntityDetailPage
