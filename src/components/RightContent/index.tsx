import {EditOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {SelectLang, useModel} from '@umijs/max';
import {Space} from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import TaskDrawer from "@/components/Tasks/Drawer";
import SDWDrawer from "@/components/YouPhoto/SDWDrawer";

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const [open, setOpen] = React.useState(false);
  if (!initialState || !initialState.settings) {
    return null;
  }
  const sdwModel = useModel('sdwModel')

  const {navTheme, layout} = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const isYouPhotoActive = () => {
    return window.location.pathname.startsWith('/youphoto')
  }
  return (
    <Space className={className}>
      <TaskDrawer open={open} onClose={() => setOpen(false)}/>
      <SDWDrawer
        open={sdwModel.open}
        onClose={() => sdwModel.setOpen(false)}

      />

      {/*<HeaderSearch*/}
      {/*  className={`${styles.action} ${styles.search}`}*/}
      {/*  placeholder="站内搜索"*/}
      {/*  defaultValue="umi ui"*/}
      {/*  options={[*/}
      {/*    { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },*/}
      {/*    {*/}
      {/*      label: <a href="next.ant.design">Ant Design</a>,*/}
      {/*      value: 'Ant Design',*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: <a href="https://protable.ant.design/">Pro Table</a>,*/}
      {/*      value: 'Pro Table',*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: <a href="https://prolayout.ant.design/">Pro Layout</a>,*/}
      {/*      value: 'Pro Layout',*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*  // onSearch={value => {*/}
      {/*  //   console.log('input', value);*/}
      {/*  // }}*/}
      {/*/>*/}
      {/*<span*/}
      {/*  className={styles.action}*/}
      {/*  onClick={() => {*/}
      {/*    window.open('https://pro.ant.design/docs/getting-started');*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <QuestionCircleOutlined />*/}
      {/*</span>*/}
      <span
        className={styles.action}
        onClick={() => {
          setOpen(true)
        }}
      >
        <QuestionCircleOutlined/>
      </span>
      {
        isYouPhotoActive() &&
        <span
          className={styles.action}
          onClick={() => {
            sdwModel.setOpen(true)
          }}
        >
        <EditOutlined/>
      </span>
      }
      <Avatar/>
      <SelectLang className={styles.action}/>
    </Space>
  );
};
export default GlobalHeaderRight;
