import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useLoadingStore } from 'src/stores/loading';
import { useAuthStore } from 'src/stores/auth';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';

// 扩展axios配置类型，支持hideLoading选项
declare module 'axios' {
  export interface AxiosRequestConfig {
    hideLoading?: boolean; // 是否隐藏全局loading
  }
}

/**
 * 根据错误代码获取翻译后的错误消息
 * @param errorCode - 错误代码，例如 'USER.CREATE.ALREADY_EXISTS'
 * @param defaultMessage - 默认错误消息（如果找不到翻译）
 * @returns 翻译后的错误消息
 */
const getErrorMessage = (errorCode?: string, defaultMessage?: string): string => {
  const t = i18n.global.t;

  if (!errorCode) {
    return defaultMessage || t('request.defaultError');
  }

  // 将错误代码转换为i18n路径，例如 'USER.CREATE.ALREADY_EXISTS' => 'errors.USER.CREATE.ALREADY_EXISTS'
  const i18nKey = `errors.${errorCode}`;

  // 尝试获取翻译
  const translatedMessage = t(i18nKey);

  // 如果翻译后的消息等于key本身，说明没有找到翻译，返回默认消息或通用错误消息
  if (translatedMessage === i18nKey) {
    return defaultMessage || t('request.defaultError');
  }

  return translatedMessage;
};

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 显示全局loading（可通过config.hideLoading配置跳过）
    if (!config.hideLoading) {
      const loadingStore = useLoadingStore();
      loadingStore.showLoading();
    }

    // 从Pinia store中获取token
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: Error) => {
    const loadingStore = useLoadingStore();
    loadingStore.hideLoading();
    return Promise.reject(error);
  },
);

// 用于防止并发刷新令牌
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const loadingStore = useLoadingStore();
    loadingStore.hideLoading();

    // 返回响应数据
    return response.data;
  },
  async (error: {
    response?: { status: number; data: { message?: string; errorCode?: string } };
    request?: unknown;
    message?: string;
    config?: AxiosRequestConfig;
  }) => {
    const loadingStore = useLoadingStore();
    loadingStore.hideLoading();

    const originalRequest = error.config;
    const t = i18n.global.t;

    // 统一错误处理
    let errorMessage = t('request.requestFailed');

    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;

      // 优先使用errorCode翻译错误消息
      if (data.errorCode) {
        errorMessage = getErrorMessage(data.errorCode, data.message);
      } else if (data.message) {
        // 如果后端直接返回了message但没有errorCode，尝试将message作为errorCode翻译
        errorMessage = getErrorMessage(data.message, data.message);
      }

      switch (status) {
        case 400:
          errorMessage = t('request.badRequest');
          break;
        case 401: {
          // 如果没有从errorCode获取到消息，使用默认消息
          if (!data.errorCode && !data.message) {
            errorMessage = t('request.unauthorized');
          }

          // 检查是否为刷新令牌请求，避免无限循环
          if (originalRequest?.url?.includes('/auth/refresh')) {
            if (!data.errorCode) {
              errorMessage = t('request.sessionExpired');
            }
            // 清除所有认证信息
            const authStore = useAuthStore();
            authStore.clearAuth();
            // 跳转到登录页
            const currentPath = window.location.hash.slice(1) || '/';
            if (!currentPath.startsWith('/login')) {
              window.location.hash = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
            break;
          }

        // 如果正在刷新令牌，将请求加入队列
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            // 重新发送原始请求
            if (originalRequest) {
              const authStore = useAuthStore();
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
              }
              return instance(originalRequest);
            }
            return Promise.reject(new Error(t('request.requestConfigLost')));
          });
        }

        // 开始刷新令牌
        isRefreshing = true;

        try {
          const authStore = useAuthStore();
          const refreshSuccess = await authStore.refreshAccessToken();

          if (refreshSuccess) {
            // 刷新成功，处理队列中的请求
            processQueue(null, authStore.accessToken);

            // 重新发送原始请求
            if (originalRequest) {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
              }
              return instance(originalRequest);
            }
          } else {
            throw new Error(t('request.refreshTokenFailed'));
          }
        } catch {
          // 刷新失败，处理队列中的请求
          processQueue(new Error(t('request.refreshTokenFailed')), null);
          if (!data.errorCode) {
            errorMessage = t('request.sessionExpired');
          }
          // 跳转到登录页
          const currentPath = window.location.hash.slice(1) || '/';
          if (!currentPath.startsWith('/login')) {
            window.location.hash = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        } finally {
          isRefreshing = false;
        }
        break;
      }
        case 403:
          errorMessage = t('request.forbidden');
          break;
        case 404:
          errorMessage = t('request.notFound');
          break;
        case 500:
          errorMessage = t('request.serverError');
          break;
        default:
          errorMessage = t('request.requestFailedWithStatus', { status });
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = t('request.networkError');
    } else {
      // 请求配置出错
      errorMessage = error.message || t('request.configError');
    }

    // 显示错误提示
    Notify.create({
      type: 'negative',
      message: errorMessage,
      position: 'top',
    });

    return Promise.reject(new Error(errorMessage));
  },
);

// 封装基础请求方法
/* eslint-disable @typescript-eslint/no-explicit-any */
export const get = <T = unknown>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.get(url, { params, ...config });
};

export const post = <T = unknown>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.post(url, data, config);
};

export const put = <T = unknown>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.put(url, data, config);
};

export const del = <T = unknown>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.delete(url, { params, ...config });
};
/* eslint-enable @typescript-eslint/no-explicit-any */

// 导出axios实例，供特殊需求使用
export default instance;
