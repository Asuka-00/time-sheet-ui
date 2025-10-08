import { get, post, put, del } from './request';
import type {
  ApiResult,
  User,
  UserQuery,
  UserPageResult,
  UserCreateDto,
  UserUpdateDto,
  ChangePasswordDto,
} from 'src/types';

/**
 * 用户管理API接口
 */
export const userApi = {
  /**
   * 创建用户
   * @param user 用户信息
   */
  createUser: (user: UserCreateDto) => {
    return post<ApiResult<void>>('/user/create', user);
  },

  /**
   * 分页查询用户列表
   * @param query 查询参数
   */
  getUserList: (query: UserQuery) => {
    return get<ApiResult<UserPageResult>>('/user/list', query);
  },

  /**
   * 删除用户
   * @param uuid 用户ID
   */
  deleteUser: (uuid: string) => {
    return del<ApiResult<void>>('/user/delete', { uuid });
  },

  /**
   * 更新用户
   * @param user 用户信息
   */
  updateUser: (user: UserUpdateDto) => {
    return put<ApiResult<void>>('/user/update', user);
  },

  /**
   * 查询单个用户
   * @param uuid 用户ID
   */
  getUser: (uuid?: string) => {
    return get<ApiResult<User[]>>('/user/get', { uuid });
  },

  /**
   * 重置用户密码
   * @param uuid 用户ID
   * @param newPassword 新密码
   */
  resetPassword: (uuid: string, newPassword: string) => {
    return put<ApiResult<void>>('/user/reset-password', { uuid, newPassword });
  },

  /**
   * 修改密码
   * @param changePasswordDto 修改密码数据
   */
  changePassword: (changePasswordDto: ChangePasswordDto) => {
    return put<ApiResult<void>>('/user/change-password', changePasswordDto);
  },
};
