import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // 认证相关路由（不需要布局）
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('pages/auth/RegisterPage.vue'),
    meta: { requiresAuth: false },
  },

  // 主应用路由（需要认证）
  {
    path: '/',
    name: 'MainLayout',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/DashboardPage.vue') },
      // 动态路由将在router/index.ts中通过addRoute动态添加
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
