import { useAuthStore } from 'src/stores/auth';

/**
 * 权限检查 Composable
 * 用于检查当前用户是否拥有指定权限
 */
export function usePermission() {
  const authStore = useAuthStore();

  /**
   * 检查用户是否拥有指定权限
   * @param permission 权限码（单个或多个）
   * @returns 是否拥有权限
   */
  const hasPermission = (permission: string | string[] | undefined): boolean => {
    // 如果权限码为空或 undefined，不做限制，返回 true
    if (!permission || (Array.isArray(permission) && permission.length === 0)) {
      return true;
    }

    // 获取用户按钮权限列表
    const buttonPermissions = authStore.buttonPermissions;

    // 如果用户未登录或按钮权限列表为空，返回 false
    if (!authStore.isAuthenticated || !buttonPermissions || buttonPermissions.length === 0) {
      return false;
    }

    // 单个权限码检查
    if (typeof permission === 'string') {
      return buttonPermissions.includes(permission);
    }

    // 多个权限码检查（OR 逻辑：满足任一即可）
    if (Array.isArray(permission)) {
      return permission.some((code) => buttonPermissions.includes(code));
    }

    return false;
  };

  return {
    hasPermission,
  };
}
