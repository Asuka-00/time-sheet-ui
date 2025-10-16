import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from 'src/api/auth';
import { permissionApi } from 'src/api/permission';
import type { LoginRequest, RegisterRequest, UserInfo, PermissionPushDto } from 'src/types/auth';
import type { Permission } from 'src/types/permission';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';

/**
 * 认证状态管理
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // 状态
    const userInfo = ref<UserInfo | null>(null);
    const accessToken = ref<string>('');
    const refreshToken = ref<string>('');
    const userPermissions = ref<Permission[]>([]);
    const buttonPermissions = ref<string[]>([]);

    // 计算属性
    const isAuthenticated = computed(() => {
      return !!accessToken.value && !!userInfo.value;
    });

    /**
     * 用户登录
     */
    const login = async (credentials: LoginRequest) => {
      try {
        const response = await authApi.login(credentials);

        if (response.code === 200 && response.data) {
          // 保存认证信息（持久化插件会自动保存到localStorage）
          accessToken.value = response.data.accessToken;
          refreshToken.value = response.data.refreshToken;
          userInfo.value = response.data.user;
          userPermissions.value = response.data.permissions || [];
          buttonPermissions.value = response.data.buttonPermissions || [];

          // 登录成功后建立 WebSocket 连接
          try {
            const { useWebSocket } = await import('src/composables/useWebSocket');
            const webSocket = useWebSocket();
            webSocket.connect();

            // 注册权限更新监听器
            webSocket.onPermissionUpdated((data) => {
              updatePermissions(data);
            });
          } catch (wsError) {
            console.error('WebSocket connection error:', wsError);
            // WebSocket 连接失败不影响登录流程
          }

          return true;
        } else {
          Notify.create({
            type: 'negative',
            message: response.message || '登录失败',
          });
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    };

    /**
     * 用户注册
     */
    const register = async (data: RegisterRequest) => {
      try {
        const response = await authApi.register(data);

        if (response.code === 200 && response.data) {
          // 注册成功后自动登录（持久化插件会自动保存到localStorage）
          accessToken.value = response.data.accessToken;
          refreshToken.value = response.data.refreshToken;
          userInfo.value = response.data.user;
          userPermissions.value = response.data.permissions || [];
          buttonPermissions.value = response.data.buttonPermissions || [];

          // 注册成功后建立 WebSocket 连接
          try {
            const { useWebSocket } = await import('src/composables/useWebSocket');
            const webSocket = useWebSocket();
            webSocket.connect();

            // 注册权限更新监听器
            webSocket.onPermissionUpdated((data) => {
              updatePermissions(data);
            });
          } catch (wsError) {
            console.error('WebSocket connection error:', wsError);
            // WebSocket 连接失败不影响注册流程
          }

          return true;
        } else {
          Notify.create({
            type: 'negative',
            message: response.message || '注册失败',
          });
          return false;
        }
      } catch (error) {
        console.error('Register error:', error);
        return false;
      }
    };

    /**
     * 用户退出登录
     */
    const logout = () => {
      clearAuth();
      Notify.create({
        type: 'positive',
        message: '退出成功',
      });
    };

    /**
     * 因空闲超时退出登录
     */
    const logoutDueToIdle = () => {
      clearAuth();
      Notify.create({
        type: 'warning',
        message: i18n.global.t('auth.logoutDueToIdle'),
        timeout: 5000,
      });
    };

    /**
     * 清除认证信息
     */
    const clearAuth = () => {
      // 断开 WebSocket 连接
      try {
        // 使用动态导入避免循环依赖
        import('src/composables/useWebSocket').then(({ useWebSocket }) => {
          const webSocket = useWebSocket();
          webSocket.disconnect();
        }).catch((error) => {
          console.error('Error disconnecting WebSocket:', error);
        });
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }

      accessToken.value = '';
      refreshToken.value = '';
      userInfo.value = null;
      userPermissions.value = [];
      buttonPermissions.value = [];
      // 持久化插件会自动同步到localStorage
    };

    /**
     * 获取当前用户信息
     */
    const getUserInfo = async () => {
      try {
        const response = await authApi.getCurrentUser();

        if (response.code === 200 && response.data) {
          userInfo.value = response.data;
          // 持久化插件会自动保存到localStorage
          return response.data;
        }
        return null;
      } catch (error) {
        console.error('Get user info error:', error);
        return null;
      }
    };

    /**
     * 获取用户权限菜单
     */
    const fetchUserPermissions = async () => {
      try {
        const response = await permissionApi.getUserPermissionMenu();

        if (response.code === 200 && response.data) {
          userPermissions.value = response.data;
          return response.data;
        }
        return [];
      } catch (error) {
        console.error('Get user permissions error:', error);
        return [];
      }
    };

    /**
     * 刷新访问令牌
     */
    const refreshAccessToken = async () => {
      if (!refreshToken.value) {
        clearAuth();
        return false;
      }

      try {
        const response = await authApi.refreshToken({
          refreshToken: refreshToken.value,
        });

        if (response.code === 200 && response.data) {
          accessToken.value = response.data.accessToken;
          // 持久化插件会自动保存到localStorage
          return true;
        } else {
          clearAuth();
          return false;
        }
      } catch (error) {
        console.error('Refresh token error:', error);
        clearAuth();
        return false;
      }
    };

    /**
     * 更新用户权限（来自 WebSocket 推送）
     */
    const updatePermissions = (data: PermissionPushDto) => {
      userPermissions.value = data.permissions;
      buttonPermissions.value = data.buttonPermissions;
      // 持久化插件会自动保存到localStorage

      // 显示通知提示
      Notify.create({
        type: 'info',
        message: i18n.global.t('auth.permissionUpdated'),
        position: 'top-right',
        timeout: 3000,
      });
    };

    return {
      // 状态
      userInfo,
      accessToken,
      refreshToken,
      userPermissions,
      buttonPermissions,
      isAuthenticated,
      // 方法
      login,
      register,
      logout,
      logoutDueToIdle,
      getUserInfo,
      fetchUserPermissions,
      refreshAccessToken,
      updatePermissions,
      clearAuth,
    };
  },
  {
    persist: {
      key: 'time-sheet-auth',
      storage: localStorage,
    },
  },
);
