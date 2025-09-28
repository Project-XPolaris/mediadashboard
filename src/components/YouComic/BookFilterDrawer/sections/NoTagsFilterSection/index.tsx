import { Select, Typography } from 'antd';

const { Text } = Typography;
const { Option } = Select;

interface NoTagsFilterSectionProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function NoTagsFilterSection({ value = 'all', onChange }: NoTagsFilterSectionProps) {
  return (
    <div>
      <Text strong>标签过滤</Text>
      <div style={{ marginTop: 8 }}>
        <Select
          style={{ width: '100%' }}
          value={value}
          onChange={onChange}
          placeholder="选择标签过滤模式"
        >
          <Option value="all">全部显示</Option>
          <Option value="only">只显示无标签</Option>
          <Option value="exclude">不显示无标签</Option>
        </Select>
      </div>
    </div>
  );
}
