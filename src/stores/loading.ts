import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 全局Loading状态管理
 * 使用计数器机制支持多个并发请求
 */
export const useLoadingStore = defineStore('loading', () => {
  // 是否显示loading
  const isLoading = ref(false);
  // loading计数器，支持并发请求
  const loadingCount = ref(0);

  /**
   * 显示loading
   */
  const showLoading = () => {
    loadingCount.value++;
    isLoading.value = true;
  };

  /**
   * 隐藏loading
   * 只有当所有请求完成时才真正隐藏
   */
  const hideLoading = () => {
    loadingCount.value--;
    if (loadingCount.value <= 0) {
      loadingCount.value = 0;
      isLoading.value = false;
    }
  };

  /**
   * 重置loading状态
   * 用于异常情况处理
   */
  const resetLoading = () => {
    loadingCount.value = 0;
    isLoading.value = false;
  };

  return {
    isLoading,
    loadingCount,
    showLoading,
    hideLoading,
    resetLoading,
  };
});
