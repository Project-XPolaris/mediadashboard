import {ModalForm, ProFormGroup, ProFormText} from "@ant-design/pro-components";
import {Button, Form, message, Segmented} from "antd";
import React from "react";
import {AppInfo, Auth, fetchAppInfo} from "@/services/common/info";
import styles from './styles.less'
import {AuthResult, fetchUserAuth} from "@/services/common/auth";
import {Account} from "@/hooks/account";

export type LinkDialogProps = {
  client: string
  open?: boolean
  onOk: (account: Account) => void
  trigger?: React.ReactElement
}
const LinkDialog = ({open, onOk, client, trigger}: LinkDialogProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [appInfo, setAppInfo] = React.useState<AppInfo | undefined>()
  const [selectAuth, setSelectAuth] = React.useState<Auth | undefined>()
  const [userAuth, setUserAuth] = React.useState<AuthResult | undefined>()
  const getInfo = async () => {
    const baseUrl = form.getFieldValue('baseUrl')
    if (!baseUrl) {
      message.error('Base URL is required')
      return
    }
    const resp = await fetchAppInfo(baseUrl)
    setAppInfo(resp)
    if (resp.auth.length > 0) {
      setSelectAuth(resp.auth[0])
    }
  }
  const fetchAuth = async () => {
    if (!selectAuth) {
      message.error('Auth is required')
      return
    }
    const username = form.getFieldValue('username')
    const password = form.getFieldValue('password')
    if (!username || !password) {
      message.error('Username and password are required')
      return
    }
    const baseUrl = form.getFieldValue('baseUrl')
    const authUrl = baseUrl + selectAuth.url
    const resp = await fetchUserAuth(authUrl, username, password)
    setUserAuth(resp.data)
  }
  const loginComplete = () => {
    if (!selectAuth) {
      message.error('Auth is required')
      return
    }
    const baseUrl = form.getFieldValue('baseUrl')
    if (!baseUrl) {
      message.error('Base URL is required')
      return
    }
    if (selectAuth.type === 'base' && !userAuth) {
      message.error('Auth is required')
      return
    }
    const account: Account = {
      client,
      baseUrl,
      token: userAuth?.accessToken,
      username: form.getFieldValue('username') === undefined ? 'Anonymous' : form.getFieldValue('username'),
    }
    onOk(account)

  }
  return (
    <ModalForm
      title="Link with application"
      form={form}
      autoFocusFirstInput
      trigger={trigger}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run')
      }}
      open={open}
      submitTimeout={2000}
      onFinish={async (values) => {
        return true
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            appInfo === undefined &&
            <Button onClick={getInfo}>
              Connect
            </Button>,
            (selectAuth && userAuth === undefined && selectAuth.type !== 'anonymous') &&
            <Button onClick={() => fetchAuth()}>
              Login
            </Button>,
            (userAuth || selectAuth?.type === 'anonymous') &&
            <Button onClick={() => {
              loginComplete()
              props.submit()
            }}>
              Complete with user {userAuth?.username ?? 'Anonymous'}
            </Button>
          ];
        },
      }}
    >

      <ProFormGroup>
        <ProFormText label={"Base url"} name={"baseUrl"} width={"xl"}/>
      </ProFormGroup>
      {
        appInfo &&
        <Segmented
          className={styles.seg}
          options={appInfo.auth.map(it => it.name)}
          value={selectAuth?.name}
          onChange={(s) => setSelectAuth(appInfo.auth.find(it => it.name === s))}
        />
      }
      {
        selectAuth?.type === 'base' &&
        <ProFormGroup>
          <ProFormText label={"Username"} name={"username"} width={"xl"}/>
          <ProFormText label={"Password"} name={"password"} width={"xl"}/>
        </ProFormGroup>
      }
      {
        selectAuth?.type === 'anonymous' &&
        <ProFormGroup>
          no auth
        </ProFormGroup>
      }

    </ModalForm>
  )
}
export default LinkDialog
