import {PageContainer} from "@ant-design/pro-components";
import React from "react";
import {Button, Card, Dropdown, Menu, message, Table, Tag} from "antd";
import LinkDialog from "@/components/LinkDialog";
import useAccountManager, {Account} from "@/hooks/account";
import {ColumnsType} from "antd/es/table";
import {getYouComicConfig, getYouMusicConfig, getYouPhotoConfig, getYouVideoConfig} from "@/utils/config";
import styles from './style.less'
const AppsPage: React.FC = () => {
  // const appsModel = useModel('appsModel')
  const accountManager = useAccountManager()
  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void
  const isActive = (account:Account):boolean => {
    switch (account.client) {
      case 'YouVideo':
        const youvideoConfig  = getYouVideoConfig()
        if (!youvideoConfig) {
          return false
        }
        return youvideoConfig.token === account.token
      case 'YouMusic':
        const youmusicConfig = getYouMusicConfig()
        if (!youmusicConfig) {
          return false
        }
        return youmusicConfig.token === account.token
      case 'YouPhoto':
        const youphotoConfig = getYouPhotoConfig()
        if (!youphotoConfig) {
          return false
        }
        return youphotoConfig.token === account.token
      case 'YouComic':
        const youComicConfig = getYouComicConfig()
        if (!youComicConfig) {
          return false
        }
        return youComicConfig.token === account.token
    }
    return false
  }

  const columns: ColumnsType<Account> = [
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'BaseUrl',
      dataIndex: 'baseUrl',
      key: 'baseUrl',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => {
        return (
          <>
            {text}
            {isActive(record)?<Tag title={'Active'} color={"green"} className={styles.activeTag}>Active</Tag>:<></> }
          </>
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => {
        return (
          <>

            {
              isActive(record)?
                <a onClick={() => accountManager.inactiveAccount(record)}>
                  Inactive
                </a>:
                <a onClick={() => {
                  accountManager.applyAccount(record)
                  forceUpdate()
                  message.success(`Applied ${record.username}`)
                }}>
                  Apply
                </a>
            }
          </>
        )
      }
    },
  ]
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <LinkDialog
              onOk={(account) => {
                accountManager.addAccount(account)
                accountManager.applyAccount(account)
                forceUpdate()
              }}
              trigger={
                <a>
                  YouVideo
                </a>
              }
              client={'YouVideo'}
            />

          ),
        },
        {
          key: '2',
          label: (
            <LinkDialog
              onOk={(account) => {
                accountManager.addAccount(account)
                accountManager.applyAccount(account)
                forceUpdate()
              }}
              trigger={
                <a>
                  YouPhoto
                </a>
              }
              client={'YouPhoto'}
            />

          ),
        },
        {
          key: '3',
          label: (
            <LinkDialog
              onOk={(account) => {
                accountManager.addAccount(account)
                accountManager.applyAccount(account)
                forceUpdate()
              }}
              trigger={
                <a>
                  YouMusic
                </a>
              }
              client={'YouMusic'}
            />
          ),
        },
        {
          key: '4',
          label: (
            <LinkDialog
              onOk={(account) => {
                accountManager.addAccount(account)
                accountManager.applyAccount(account)
                forceUpdate()
              }}
              trigger={
                <a>
                  YouComic
                </a>
              }
              client={'YouComic'}
            />

          ),
        },
      ]}
    />
  );
  return (
    <PageContainer extra={
      <Dropdown overlay={menu}>
        <Button type={"primary"}>Link with</Button>
      </Dropdown>
    }>
      <Card>
        <Table columns={columns} dataSource={accountManager.accounts}/>
      </Card>
    </PageContainer>
  )
}
export default AppsPage
