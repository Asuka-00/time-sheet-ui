import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';
import { Quasar } from 'quasar';
import quasarLangZhCN from 'quasar/lang/zh-CN';
import quasarLangEnUS from 'quasar/lang/en-US';
import quasarLangJaJP from 'quasar/lang/ja';

import messages from 'src/i18n';

// 从 localStorage 读取保存的语言设置
const savedLocale = localStorage.getItem('user-locale') || 'zh-CN';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

// 创建 i18n 实例并导出，供非组件上下文使用（如 axios 拦截器）
export const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
  locale: savedLocale,
  legacy: false,
  messages,
});

// 导出 Quasar 语言包映射，供其他模块使用
export const quasarLangMap: Record<string, typeof quasarLangZhCN> = {
  'zh-CN': quasarLangZhCN,
  'en-US': quasarLangEnUS,
  'ja-JP': quasarLangJaJP,
};

export default defineBoot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);

  // 根据当前语言设置 Quasar 语言
  const currentLocale = i18n.global.locale as unknown as { value: string };
  Quasar.lang.set(quasarLangMap[currentLocale.value] || quasarLangZhCN);

  // 监听语言切换，同步更新 Quasar 语言
  app.config.globalProperties.$watchLocale = (locale: string) => {
    Quasar.lang.set(quasarLangMap[locale] || quasarLangZhCN);
  };
});
