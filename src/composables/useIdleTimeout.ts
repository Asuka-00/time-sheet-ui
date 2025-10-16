import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useIdle } from '@vueuse/core';

/**
 * 空闲超时检测配置选项
 */
export interface IdleTimeoutOptions {
  /**
   * 超时时间（毫秒），默认30分钟
   */
  timeout?: number;
  /**
   * 空闲时的回调函数
   */
  onIdle?: () => void | Promise<void>;
  /**
   * 是否立即启动检测
   */
  immediate?: boolean;
}

/**
 * 从环境变量获取空闲超时时间
 * @returns 超时时间（毫秒）
 */
const getIdleTimeoutFromEnv = (): number => {
  const envMinutes = import.meta.env.VITE_IDLE_TIMEOUT_MINUTES;

  // 默认30分钟
  const defaultMinutes = 30;
  const minMinutes = 5; // 最小5分钟
  const maxMinutes = 480; // 最大8小时

  if (!envMinutes) {
    return defaultMinutes * 60 * 1000;
  }

  const minutes = parseInt(envMinutes, 10);

  if (isNaN(minutes)) {
    console.warn(
      `Invalid VITE_IDLE_TIMEOUT_MINUTES value: ${envMinutes}. Using default ${defaultMinutes} minutes.`,
    );
    return defaultMinutes * 60 * 1000;
  }

  if (minutes < minMinutes) {
    console.warn(
      `VITE_IDLE_TIMEOUT_MINUTES (${minutes}) is less than minimum (${minMinutes}). Using ${minMinutes} minutes.`,
    );
    return minMinutes * 60 * 1000;
  }

  if (minutes > maxMinutes) {
    console.warn(
      `VITE_IDLE_TIMEOUT_MINUTES (${minutes}) is greater than maximum (${maxMinutes}). Using ${maxMinutes} minutes.`,
    );
    return maxMinutes * 60 * 1000;
  }

  return minutes * 60 * 1000;
};

/**
 * 空闲超时检测 Composable
 *
 * 使用 @vueuse/core 的 useIdle 实现可配置时间无操作自动退出功能
 * 超时时间通过环境变量 VITE_IDLE_TIMEOUT_MINUTES 配置，默认30分钟
 *
 * @param options - 配置选项
 * @returns 空闲状态和控制方法
 */
export const useIdleTimeout = (options: IdleTimeoutOptions = {}) => {
  const {
    timeout = getIdleTimeoutFromEnv(), // 从环境变量获取超时时间
    onIdle,
    immediate = true,
  } = options;

  // 是否已经处理过空闲状态（防止重复处理）
  const isIdleProcessed = ref(false);

  // 使用 @vueuse/core 的 useIdle
  const { idle, lastActive } = useIdle(timeout, {
    initialState: false,
    listenForVisibilityChange: true,
  });

  // 监听空闲状态变化的 watcher
  const stopWatcher = ref<(() => void) | null>(null);

  /**
   * 启动空闲检测
   */
  const startIdleDetection = () => {
    if (stopWatcher.value) {
      return; // 已经在运行
    }

    isIdleProcessed.value = false;

    // 监听空闲状态变化
    stopWatcher.value = watch(idle, (isIdle) => {
      if (isIdle && !isIdleProcessed.value) {
        isIdleProcessed.value = true;
        void onIdle?.();
      }
    });
  };

  /**
   * 停止空闲检测
   */
  const stopIdleDetection = () => {
    if (stopWatcher.value) {
      stopWatcher.value();
      stopWatcher.value = null;
    }
    isIdleProcessed.value = false;
  };

  /**
   * 重置空闲状态
   */
  const resetIdle = () => {
    isIdleProcessed.value = false;
  };

  // 自动启动
  if (immediate) {
    onMounted(() => {
      startIdleDetection();
    });
  }

  // 清理
  onUnmounted(() => {
    stopIdleDetection();
  });

  return {
    idle,
    lastActive,
    isIdleProcessed,
    startIdleDetection,
    stopIdleDetection,
    resetIdle,
  };
};
