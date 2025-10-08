import { get, post, put, del } from './request';
import type { ApiResult, PageResult } from 'src/types/common';
import type {
  Department,
  DepartmentQuery,
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from 'src/types/department';

/**
 * 部门管理API
 */
export const departmentApi = {
  /**
   * 创建部门
   * @param data 部门数据
   */
  createDepartment: (data: DepartmentCreateDto) => {
    return post<ApiResult<void>>('/department/create', data);
  },

  /**
   * 获取部门列表（分页）
   * @param query 查询参数
   */
  getDepartmentList: (query: DepartmentQuery) => {
    return get<ApiResult<PageResult<Department>>>('/department/list', query);
  },

  /**
   * 删除部门
   * @param uuid 部门ID
   */
  deleteDepartment: (uuid: string) => {
    return del<ApiResult<void>>('/department/delete', { uuid });
  },

  /**
   * 更新部门
   * @param data 部门数据
   */
  updateDepartment: (data: DepartmentUpdateDto) => {
    return put<ApiResult<void>>('/department/update', data);
  },

  /**
   * 查询部门
   * @param uuid 部门ID（可选，不传则返回所有部门）
   */
  getDepartment: (uuid?: string) => {
    return get<ApiResult<Department[]>>('/department/get', uuid ? { uuid } : undefined);
  },
};

