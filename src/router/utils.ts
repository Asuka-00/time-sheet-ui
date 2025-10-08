import type { RouteRecordRaw } from 'vue-router';
import type { Permission } from 'src/types/permission';

/**
 * 组件路径映射函数
 * 将权限配置中的组件路径转换为实际的组件导入
 * @param componentPath 组件路径，如 'pages/department/DepartmentManagement.vue'
 */
function getComponentImport(componentPath: string) {
  // 移除可能的前导斜杠和多余空格
  const path = componentPath.replace(/^\//, '').trim();
  
  // 使用相对路径导入（相对于当前 router 目录）
  // ../pages/xxx 会解析为 src/pages/xxx
  return () => import(`../${path}`);
}

/**
 * 根据权限列表生成动态路由配置
 * @param permissions 权限菜单树
 * @returns 路由配置数组
 */
export function generateRoutesFromPermissions(
  permissions: Permission[]
): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  permissions.forEach((permission) => {
    // 只处理有路径和组件的菜单项
    if (permission.type === 'menu' && permission.path && permission.component) {
      // 递归处理子路由
      const childRoutes =
        permission.children && permission.children.length > 0
          ? generateRoutesFromPermissions(permission.children)
          : [];

      const route: RouteRecordRaw = {
        path: permission.path,
        name: permission.code,
        component: getComponentImport(permission.component),
        meta: {
          requiresAuth: true,
          title: permission.menuName || permission.name,
          icon: permission.icon,
          code: permission.code,
        },
        ...(childRoutes.length > 0 ? { children: childRoutes } : {}),
      };

      routes.push(route);
    } else if (permission.children && permission.children.length > 0) {
      // 如果父节点没有路径但有子节点，递归处理子节点
      const childRoutes = generateRoutesFromPermissions(permission.children);
      routes.push(...childRoutes);
    }
  });

  return routes;
}

/**
 * 将权限菜单树转换为扁平的路由数组（用于批量注册）
 * @param permissions 权限菜单树
 * @returns 扁平化的路由配置数组
 */
export function flattenPermissionRoutes(
  permissions: Permission[]
): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  function flatten(perms: Permission[]) {
    perms.forEach((permission) => {
      if (permission.type === 'menu' && permission.path && permission.component) {
        routes.push({
          path: permission.path,
          name: permission.code,
          component: getComponentImport(permission.component),
          meta: {
            requiresAuth: true,
            title: permission.menuName || permission.name,
            icon: permission.icon,
            code: permission.code,
          },
        });
      }

      if (permission.children && permission.children.length > 0) {
        flatten(permission.children);
      }
    });
  }

  flatten(permissions);
  return routes;
}
