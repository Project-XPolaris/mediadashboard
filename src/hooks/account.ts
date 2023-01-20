import {useState} from "react";
import {YouComicConfig, YouMusicConfig, YouPhotoConfig, YouVideoConfig} from "@/models/appsModel";

export type Account = {
  baseUrl: string
  client: string
  token: string | undefined
  username: string
}
const useAccountManager = () => {
  const getAccount = () => {
    const raw = localStorage.getItem('accounts')
    if (raw === null) {
      return []
    }
    return JSON.parse(raw)
  }
  const [accounts, setAccounts] = useState<Account[]>(getAccount)
  const addAccount = (account: Account) => {
    // remove same client
    const newAccounts = accounts.filter((a) => {
      if (a.client !== account.client) {
        return true
      }
      if (a.baseUrl !== account.baseUrl) {
        return true
      }
      if (a.username !== account.username) {
        return true
      }
      return false
    })
    newAccounts.push(account)
    localStorage.setItem('accounts', JSON.stringify(newAccounts))
    setAccounts(newAccounts)
  }
  const removeAccount = (account: Account) => {
    const newAccounts = accounts.filter(it => it.baseUrl !== account.baseUrl && it.username !== account.username)
    localStorage.setItem('accounts', JSON.stringify(newAccounts))
    setAccounts(newAccounts)
  }
  const applyYouVideoAccount = (account: Account) => {
    const youVideoConfig: YouVideoConfig = {
      baseUrl: account.baseUrl,
      token: account.token
    }
    localStorage.setItem("YouVideoConfig", JSON.stringify(youVideoConfig))
  }
  const applyYouPhotoAccount = (account: Account) => {
    const youPhotoConfig: YouPhotoConfig = {
      baseUrl: account.baseUrl,
      token: account.token
    }
    localStorage.setItem("YouPhotoConfig", JSON.stringify(youPhotoConfig))
  }
  const applyYouMusicAccount = (account: Account) => {
    const youMusicConfig: YouMusicConfig = {
      baseUrl: account.baseUrl,
      token: account.token
    }
    localStorage.setItem("YouMusicConfig", JSON.stringify(youMusicConfig))
  }
  const applyYouComicAccount = (account: Account) => {
    const youComicConfig: YouComicConfig = {
      baseUrl: account.baseUrl,
      token: account.token
    }
    localStorage.setItem("YouComicConfig", JSON.stringify(youComicConfig))
  }
  const applyAccount = (account: Account) => {
    switch (account.client) {
      case 'YouVideo':
        applyYouVideoAccount(account)
        break
      case 'YouPhoto':
        applyYouPhotoAccount(account)
        break
      case 'YouMusic':
        applyYouMusicAccount(account)
        break
      case 'YouComic':
        applyYouComicAccount(account)
        break
    }
    window.location.reload();
  }
  const inactiveAccount = (account: Account) => {
    let configKey = ""
    switch (account.client) {
      case 'YouVideo':
        configKey = "YouVideoConfig"
        break
      case 'YouPhoto':
        configKey = "YouPhotoConfig"
        break
      case 'YouMusic':
        configKey = "YouMusicConfig"
        break
      case 'YouComic':
        configKey = "YouComicConfig"
    }
    if (configKey !== "") {
      localStorage.removeItem(configKey)
      window.location.reload();
    }
  }

  return {
    accounts, addAccount, removeAccount, applyAccount, inactiveAccount
  }
}
export default useAccountManager
