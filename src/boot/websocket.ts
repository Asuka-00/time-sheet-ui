import { defineBoot } from '#q-app/wrappers';
import { useWebSocket } from 'src/composables/useWebSocket';
import { useAuthStore } from 'src/stores/auth';

/**
 * WebSocket 初始化
 * 在应用启动时建立 WebSocket 连接并监听权限更新
 */
export default defineBoot(() => {
  const authStore = useAuthStore();
  const webSocket = useWebSocket();

  // 只有在用户已登录时才建立连接
  if (authStore.isAuthenticated) {
    console.log('[Boot] 用户已登录，建立 WebSocket 连接');
    webSocket.connect();

    // 注册权限更新监听器
    webSocket.onPermissionUpdated((data) => {
      console.log('[Boot] 收到权限更新推送，更新 store');
      authStore.updatePermissions(data);
    });
  } else {
    console.log('[Boot] 用户未登录，跳过 WebSocket 连接');
  }
});
