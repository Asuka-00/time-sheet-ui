import type { PageQuery, PageResult } from './common';

/**
 * 部门接口
 */
export interface Department {
  uuid?: string;
  name: string;
  description: string;
  parentDepartmentName?: string;
  status: number;
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
}

/**
 * 部门查询参数
 */
export interface DepartmentQuery extends PageQuery {
  searchKey?: string;
}

/**
 * 部门分页结果
 */
export type DepartmentPageResult = PageResult<Department>;

/**
 * 部门创建DTO - 排除审计字段和uuid
 */
export type DepartmentCreateDto = Omit<
  Department,
  'uuid' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;

/**
 * 部门更新DTO - 排除审计字段但保留uuid
 */
export type DepartmentUpdateDto = Omit<
  Department,
  'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;

