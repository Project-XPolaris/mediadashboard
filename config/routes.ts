/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'icon-dashboard',
    component: './Welcome',
  },
  {
    name: 'Apps',
    icon: 'table',
    path: '/apps',
    component: './App',
  },
  {

    path: '/youvideo',
    name: 'YouVideo',
    icon: 'icon-video_fill',
    access: 'youvideo',
    routes: [
      {
        access: 'youvideo',
        path: '/youvideo/library/list',
        name: 'Libraries',
        icon: 'table',
        component: './YouVideo/Library/List',
      },
      {
        access: 'youvideo',
        path: '/youvideo/video/list',
        name: 'Videos',
        component: './YouVideo/Video/List',
      },
      {
        access: 'youvideo',
        path: '/youvideo/Entity/list',
        name: 'Entities',
        component: './YouVideo/Entity/List',
      },
      {
        hideInMenu: true,
        access: 'youvideo',
        path: '/youvideo/Entity/detail',
        name: 'Entity detail',
        component: './YouVideo/Entity/Detail',
      },
    ],
  },
  {
    path: '/youphoto',
    name: 'YouPhoto',
    icon: 'icon-photo',
    access: 'youphoto',
    routes: [
      {
        access: 'youphoto',
        path: '/youphoto/library/list',
        name: 'Libraries',
        component: './YouPhoto/Library/List',
      },
      {
        access: 'youphoto',
        path: '/youphoto/photo/list',
        name: 'Photos',
        component: './YouPhoto/Photo/List',
      },
    ],
  },
  {
    path: '/youmusic',
    name: 'YouMusic',
    icon: 'icon-music',
    access: 'youmusic',
    routes: [
      {
        access: 'youmusic',
        path: '/youmusic/library/list',
        name: 'Libraries',
        component: './YouMusic/Library/List',
      },
      {
        access: 'youmusic',
        path: '/youmusic/music/list',
        name: 'Music list',
        component: './YouMusic/Music/List',
      },
      {
        access: 'youmusic',
        path: '/youmusic/album/list',
        name: 'Album list',
        component: './YouMusic/Album/List',
      },
      {
        access: 'youmusic',
        path: '/youmusic/album/detail',
        name: 'Detail',
        hideInMenu: true,
        component: './YouMusic/Album/Detail',
      },
    ],
  },
  {
    path: '/youcomic',
    name: 'YouComic',
    icon: 'book',
    access: 'youcomic',
    routes: [
      {
        access: 'youcomic',
        path: '/youcomic/book/list',
        name: 'Books',
        component: './YouComic/Book/List',
      },
      {
        access: 'youcomic',
        path: '/youcomic/library/list',
        name: 'Libraries',
        component: './YouComic/Library/List',
      },
      {
        access: 'youcomic',
        path: '/youcomic/tag/list',
        name: 'Tags',
        component: './YouComic/Tag/List',
      },
      {
        access: 'youcomic',
        path: '/youcomic/user/list',
        name: 'Users',
        component: './YouComic/User/List',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
