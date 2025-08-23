/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const {currentUser} = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access?.find((item) => item === 'admin'),
    youvideo: currentUser && currentUser.access?.find((item) => item === 'video'),
    youphoto: currentUser && currentUser.access?.find((item) => item === 'photo'),
    youmusic: currentUser && currentUser.access?.find((item) => item === 'music'),
    youcomic: currentUser && currentUser.access?.find((item) => item === 'comic'),
  };
}
