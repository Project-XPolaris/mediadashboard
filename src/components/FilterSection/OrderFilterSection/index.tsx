import { Button, Form, Select } from 'antd';
import styles from './style.less';
import {useForm} from "antd/es/form/Form";
import SectionContainer from '@/components/YouComic/BookFilterDrawer/sections/SectionContainer';
const { Option } = Select;
export interface OrderFilterItem {
  title: string;
  key: string;
}
interface OrderFilterSectionPropsType {
  orderItems: OrderFilterItem[];
  onAddFilter: (orderKey: string, order: 'asc' | 'desc') => void;
  defaultOrderKey: string;
}

export default function OrderFilterSection({
  orderItems,
  onAddFilter,
  defaultOrderKey,
}: OrderFilterSectionPropsType) {
  const [form] = useForm();
  const orderSelections = orderItems.map((orderItem: OrderFilterItem) => (
    <Option value={orderItem.key} key={orderItem.key}>
      {orderItem.title}
    </Option>
  ));
  const onAddSubmit = (values: any) => {
    const { orderKey = defaultOrderKey, order = 'asc' } = values;
    onAddFilter(orderKey, order);
  };
  return (
    <SectionContainer title={"Order"}>
      <Form form={form} onFinish={onAddSubmit}>
        <Form.Item label={"Order key"} name="orderKey">
          <Select
            size="small"
            defaultValue={defaultOrderKey}
            className={styles.selectInput}
            style={{ width: 120 }}
          >
            {orderSelections}
          </Select>
        </Form.Item>
        <Form.Item label={"Order"} name="order">
          <Select
            defaultValue="asc"
            size="small"
            className={styles.selectInput}
            style={{ width: 120 }}
          >
            <Option value="asc">{"ASC"}</Option>
            <Option value="desc">{"Desc"}</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles.addButton}>
          {"Add"}
        </Button>
      </Form>
    </SectionContainer>
  );
}
