import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LocaleOption {
  value: string;
  label: string;
}

export const useLocaleStore = defineStore('locale', () => {
  // 可用语言列表
  const availableLocales: LocaleOption[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
  ];

  // 从 localStorage 读取保存的语言，如果没有则使用默认值
  const savedLocale = localStorage.getItem('user-locale');
  const currentLocale = ref<string>(savedLocale || 'zh-CN');

  // 获取当前语言的标签
  const currentLocaleLabel = computed(() => {
    const locale = availableLocales.find((l) => l.value === currentLocale.value);
    return locale?.label || '简体中文';
  });

  // 设置语言
  const setLocale = (locale: string) => {
    currentLocale.value = locale;
    localStorage.setItem('user-locale', locale);
  };

  return {
    currentLocale,
    currentLocaleLabel,
    availableLocales,
    setLocale,
  };
});

