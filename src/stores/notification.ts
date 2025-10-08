import { defineStore } from 'pinia';
import { ref } from 'vue';
import { timesheetApi } from 'src/api/timesheet';

/**
 * 通知状态管理
 */
export const useNotificationStore = defineStore('notification', () => {
  // 状态：待审核工时数量
  const pendingReviewCount = ref<number>(0);
  
  // 轮询定时器引用
  let pollingTimer: NodeJS.Timeout | null = null;

  /**
   * 获取待审核工时数量
   */
  const fetchPendingReviewCount = async (): Promise<void> => {
    try {
      const response = await timesheetApi.getPendingReviewTimesheets({
        current: 1,
        size: 1,
      });

      if (response.code === 200 && response.data) {
        pendingReviewCount.value = response.data.total || 0;
      }
    } catch (error) {
      // 静默处理错误，避免频繁通知用户
      console.error('Failed to fetch pending review count:', error);
    }
  };

  /**
   * 启动轮询
   * @param interval 轮询间隔（毫秒），默认30秒
   */
  const startPolling = (interval: number = 30000): void => {
    // 如果已经在轮询，先停止
    if (pollingTimer) {
      stopPolling();
    }

    // 立即执行一次
    void fetchPendingReviewCount();

    // 启动定时轮询
    pollingTimer = setInterval(() => {
      void fetchPendingReviewCount();
    }, interval);
  };

  /**
   * 停止轮询
   */
  const stopPolling = (): void => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };

  return {
    // 状态
    pendingReviewCount,
    // 方法
    fetchPendingReviewCount,
    startPolling,
    stopPolling,
  };
});

