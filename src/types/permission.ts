import type { PageQuery, PageResult, AuditFields } from './common';

// 权限类型定义
export interface Permission extends AuditFields {
  uuid?: string;
  name: string;
  menuName?: string;
  code: string;
  module: string;
  parentCode?: string;
  type?: string;
  path?: string;
  icon?: string;
  component?: string;
  sort?: number;
  description: string;
  status: number;
  children?: Permission[];
}

// 权限查询参数
export type PermissionQuery = PageQuery;

// 权限分页结果
export type PermissionPageResult = PageResult<Permission>;

// 权限创建DTO - 排除审计字段、uuid和children
export type PermissionCreateDto = Omit<Permission, 'uuid' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'children'>;

// 权限更新DTO - 排除审计字段和children但保留uuid
export type PermissionUpdateDto = Omit<Permission, 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'children'>;

// 菜单项类型定义（用于UI渲染）
export interface MenuItem {
  code: string;
  name: string;
  menuName?: string;
  path?: string;
  icon?: string;
  component?: string;
  children?: MenuItem[];
}
