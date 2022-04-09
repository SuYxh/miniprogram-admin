import { vue } from '@vitejs/plugin-vue';
import settings from '@/config/settings';
import { RoutesDataItem } from '@/utils/routes';
import BlankLayout from '@/layouts/BlankLayout.vue';

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  /*
  {
    title: 'index-layout.menu.home',
    path: '/home',
    component: ()=> import('@/views/home/index.vue')
  }, */
  {
    icon: 'home',
    title: 'index-layout.menu.home',
    path: '/home',
    redirect: settings.homeRouteItem.path,
    component: BlankLayout,
    children: [
      {
        ...settings.homeRouteItem,
      },
      {
        icon: 'detail',
        title: 'index-layout.menu.home.docs',
        path: 'http://admin-antd-vue.liqingsong.cc/',
        belongTopMenu: '/home',
        redirect: '',
      },
    ],
  },
  // 题目分类
  {
    icon: 'page',
    title: 'index-layout.menu.classify',
    path: '/classify',
    redirect: '/classify/list',
    component: BlankLayout,
    children: [
      {
        icon: 'detail',
        title: 'index-layout.menu.classify.list',
        path: 'list',
        component: () => import('@/views/classify/list/index.vue'),
      },
      // {
      //   icon: 'detail',
      //   title: 'index-layout.menu.classify.add',
      //   path: 'add',
      //   component: () => import('@/views/classify/add/index.vue'),
      // },
    ],
  },
  // 题目相关路由
  {
    icon: 'page',
    title: 'index-layout.menu.question',
    path: '/question',
    redirect: '/question/list',
    component: BlankLayout,
    children: [
      {
        icon: 'detail',
        title: 'index-layout.menu.question.list',
        path: 'list',
        component: () => import('@/views/question/list/index.vue'),
      },
      {
        icon: 'detail',
        title: 'index-layout.menu.question.add',
        path: 'add',
        component: () => import('@/views/question/add/index.vue'),
      },
    ],
  },
];

export default IndexLayoutRoutes;
