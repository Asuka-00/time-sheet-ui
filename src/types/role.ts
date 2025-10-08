import type { PageQuery, PageResult } from './common';

/**
 * 角色接口
 */
export interface Role {
  uuid?: string;
  name: string;
  description: string;
  permissionCodes?: string[];
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
}

/**
 * 角色查询参数
 */
export interface RoleQuery extends PageQuery {
  searchKey?: string;
}

/**
 * 角色分页结果
 */
export type RolePageResult = PageResult<Role>;

/**
 * 角色创建DTO - 排除审计字段和uuid
 */
export type RoleCreateDto = Omit<
  Role,
  'uuid' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;

/**
 * 角色更新DTO - 排除审计字段但保留uuid
 */
export type RoleUpdateDto = Omit<
  Role,
  'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;
