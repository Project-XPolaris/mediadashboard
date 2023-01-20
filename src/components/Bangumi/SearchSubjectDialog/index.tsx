import {Divider, Input, List, message, Modal, Typography} from "antd";
import {BangumiAPI} from "@/services/bangumi/types";
import {useState} from "react";
import {searchSubject} from "@/services/bangumi/subject";
import styles from './style.less'

const {Search} = Input;
type SearchSubjectDialogProps = {
  visible: boolean;
  onCancel: () => void;
  type: number
  onOk: (subject: BangumiAPI.Subject) => void
}
const SearchSubjectDialog = ({visible, onCancel, type,onOk}: SearchSubjectDialogProps) => {
  const [subjects, setSubjects] = useState<BangumiAPI.Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<BangumiAPI.Subject>();
  const [loading, setLoading] = useState(false);
  const onSearch = async (value: string) => {
    setLoading(true);
    const response = await searchSubject(value, type)
    setLoading(false)
    setSubjects(response.list);
    if (response?.list) {
      setSubjects(response.list)
      if (response.list.length > 0) {
        setSelectedSubject(response.list[0])
      }
    }
  }
  const onOkClick = () => {
    if (!selectedSubject) {
      message.error('Please select a subject')
      return
    }
    onOk(selectedSubject)
  }


  return (
    <Modal title={"Search subject"} onCancel={onCancel} visible={visible} width={'60vw'} onOk={onOkClick}>
      <Search placeholder="input search text" onSearch={onSearch} loading={loading}/>
      <Divider/>
      <div className={styles.resultContainer}>
        <div className={styles.resultList}>
          <List
            dataSource={subjects}
            renderItem={item => (
              <List.Item
                onClick={() => setSelectedSubject(item)}
                className={item.id === selectedSubject?.id?styles.itemSelected:undefined}
              >
                <div className={styles.itemContent}>
                  <img src={item.images.grid} className={styles.itemCover}/>
                  <div>
                    {item.name}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className={styles.detail}>
        {
          selectedSubject && (
              <div>
                <Typography.Title level={5}>{selectedSubject.name}</Typography.Title>
                <Typography.Title level={5}>{selectedSubject.name_cn}</Typography.Title>
                <div className={styles.detailSummary}>
                  {selectedSubject.summary}
                </div>

              </div>
          )
        }
        </div>
      </div>
    </Modal>
  )
}
export default SearchSubjectDialog
