import { get, post, put, del } from './request';
import type {
  ApiResult,
  Permission,
  PermissionQuery,
  PermissionPageResult,
  PermissionCreateDto,
  PermissionUpdateDto,
} from 'src/types';

/**
 * 权限管理API接口
 */
export const permissionApi = {
  /**
   * 创建权限
   * @param permission 权限信息
   */
  createPermission: (permission: PermissionCreateDto) => {
    return post<ApiResult<void>>('/permission/create', permission);
  },

  /**
   * 分页查询权限列表
   * @param query 查询参数
   */
  getPermissionList: (query: PermissionQuery) => {
    return get<ApiResult<PermissionPageResult>>('/permission/list', query);
  },

  /**
   * 删除权限
   * @param uuid 权限ID
   */
  deletePermission: (uuid: string) => {
    return del<ApiResult<void>>('/permission/delete', { uuid });
  },

  /**
   * 更新权限
   * @param permission 权限信息
   */
  updatePermission: (permission: PermissionUpdateDto) => {
    return put<ApiResult<void>>('/permission/update', permission);
  },

  /**
   * 查询单个权限
   * @param uuid 权限ID
   */
  getPermission: (uuid?: string) => {
    return get<ApiResult<Permission[]>>('/permission/get', { uuid });
  },

  /**
   * 获取树形权限列表
   */
  getPermissionTree: () => {
    return get<ApiResult<Permission[]>>('/permission/tree');
  },

  /**
   * 获取子权限树
   * @param parentCode 父级权限代码
   */
  getPermissionSubTree: (parentCode: string) => {
    return get<ApiResult<Permission[]>>('/permission/subtree', { parentCode });
  },

  /**
   * 获取当前用户权限菜单树
   */
  getUserPermissionMenu: () => {
    return get<ApiResult<Permission[]>>('/permission/tree');
  },
};
