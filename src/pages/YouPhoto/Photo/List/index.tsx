
import { useEffect } from "react";
import styles from "./style.less";
import { Card, Col, Image, Pagination, Row } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import usePhotoListModel, {PhotoItem} from "@/pages/YouPhoto/Photo/List/model";
import {PageContainer} from "@ant-design/pro-components";

const ImageListPage = () => {
  const model = usePhotoListModel();
  useEffect(() => {
    model.refresh();
  }, []);
  const onDownload = (photo: PhotoItem) => {
    const fileName = photo.name;
    const el = document.createElement("a");
    el.setAttribute("href", photo.rawUrl);
    el.setAttribute("download", fileName);
    document.body.appendChild(el);
    el.click();
    el.remove();
  };
  return (
    <PageContainer>
      <Image.PreviewGroup>
        <Row gutter={[16, 16]}>
          {
            model.photos.map(it => {
              return (
                <Col xs={4}>
                  <Card

                    actions={[
                      <DownloadOutlined key="download" onClick={() => onDownload(it)} />
                    ]}
                  >
                    <div className={styles.imageItem}>
                      <Image
                        className={styles.image}
                        src={it.thumbnailUrl} alt=""
                        preview={{
                          src: it.rawUrl
                        }}

                      />
                    </div>

                  </Card>
                </Col>
              );
            })
          }
        </Row>
      </Image.PreviewGroup>
      <div className={styles.pagination}>
        <Row>
          <Col xs={12}>
            <Pagination
              pageSize={model.pagination.pageSize}
              current={model.pagination.page}
              showQuickJumper
              showTotal={total => `Total ${total} items`}
              onChange={(page) => model.refresh({ queryPage: page, queryPageSize: model.pagination.pageSize })}
              total={model.pagination.total}
            />
          </Col>
        </Row>
      </div>


    </PageContainer>

  );
};
export default ImageListPage;
