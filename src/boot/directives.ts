import { boot } from 'quasar/wrappers';
import { permissionDirective } from 'src/directives/permission';

/**
 * 注册全局自定义指令
 */
export default boot(({ app }) => {
  // 注册权限指令
  app.directive('permission', permissionDirective);
});
