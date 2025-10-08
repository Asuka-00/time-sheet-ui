import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { flattenPermissionRoutes } from './utils';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 动态路由注册标志
  let isRoutesRegistered = false;

  // 路由守卫：认证检查和动态路由注册
  Router.beforeEach(async (to, from, next) => {
    try {
      // 动态导入 authStore 避免循环依赖
      const { useAuthStore } = await import('src/stores/auth');
      const authStore = useAuthStore();
      const requiresAuth = to.meta.requiresAuth !== false; // 默认需要认证

      // 如果用户已登录且动态路由尚未注册
      if (authStore.isAuthenticated && !isRoutesRegistered) {
        const permissions = authStore.userPermissions;

        if (permissions && permissions.length > 0) {
          // 生成动态路由
          const dynamicRoutes = flattenPermissionRoutes(permissions);

          // 将动态路由添加到 MainLayout 的 children 中
          dynamicRoutes.forEach((route) => {
            Router.addRoute('MainLayout', route);
          });

          // 标记路由已注册
          isRoutesRegistered = true;

          // 如果当前要去的路由是动态路由，需要重新导航以确保路由生效
          // 检查path而不是name，因为刷新时路由未注册，to.name可能是404
          const isDynamicRoute = dynamicRoutes.some((r) => r.path === to.path);
          
          if (isDynamicRoute) {
            next({ ...to, replace: true });
            return;
          }
        }
      }

      // 认证检查
      if (requiresAuth && !authStore.isAuthenticated) {
        // 需要认证但未登录，跳转登录页
        next({ name: 'Login', query: { redirect: to.fullPath } });
      } else if (to.name === 'Login' && authStore.isAuthenticated) {
        // 已登录访问登录页，跳转首页
        next({ path: '/' });
      } else {
        next();
      }
    } catch (error) {
      // 如果 store 加载失败，允许继续导航
      console.error('Router guard error:', error);
      next();
    }
  });

  return Router;
});
