import { get, post, put, del } from './request';
import type { ApiResult, PageResult } from 'src/types/common';
import type { Role, RoleQuery, RoleCreateDto, RoleUpdateDto } from 'src/types/role';

/**
 * 角色管理API
 */
export const roleApi = {
  /**
   * 创建角色
   * @param data 角色数据
   */
  createRole: (data: RoleCreateDto) => {
    return post<ApiResult<void>>('/role/create', data);
  },

  /**
   * 获取角色列表（分页）
   * @param query 查询参数
   */
  getRoleList: (query: RoleQuery) => {
    return get<ApiResult<PageResult<Role>>>('/role/list', query);
  },

  /**
   * 删除角色
   * @param uuid 角色ID
   */
  deleteRole: (uuid: string) => {
    return del<ApiResult<void>>('/role/delete', { uuid });
  },

  /**
   * 更新角色
   * @param data 角色数据
   */
  updateRole: (data: RoleUpdateDto) => {
    return put<ApiResult<void>>('/role/update', data);
  },

  /**
   * 查询角色
   * @param uuid 角色ID（可选，不传则返回所有角色）
   */
  getRole: (uuid?: string) => {
    return get<ApiResult<Role[]>>('/role/get', uuid ? { uuid } : undefined);
  },

  /**
   * 查询角色权限
   * @param roleName 角色名称
   */
  getRolePermissions: (roleName: string) => {
    return get<ApiResult<string[]>>(`/role/permissions/${roleName}`);
  },
};
