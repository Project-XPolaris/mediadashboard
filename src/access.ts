/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const {currentUser} = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access?.find((item) => item === 'admin'),
    youvideo: currentUser && localStorage.getItem('YouVideoConfig') !== null,
    youphoto: currentUser && localStorage.getItem('YouPhotoConfig') !== null,
    youmusic: currentUser && localStorage.getItem('YouMusicConfig') !== null,
    youcomic: currentUser && localStorage.getItem('YouComicConfig') !== null,
  };
}
