import { get, post } from './request';
import type {
  ApiResult,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserInfo,
} from 'src/types';

/**
 * 认证API接口
 */
export const authApi = {
  /**
   * 用户登录
   * @param data 登录信息
   */
  login: (data: LoginRequest) => {
    return post<ApiResult<AuthResponse>>('/auth/login', data);
  },

  /**
   * 用户注册
   * @param data 注册信息
   */
  register: (data: RegisterRequest) => {
    return post<ApiResult<AuthResponse>>('/auth/register', data);
  },

  /**
   * 刷新访问令牌
   * @param data 刷新令牌
   */
  refreshToken: (data: RefreshTokenRequest) => {
    return post<ApiResult<{ accessToken: string }>>('/auth/refresh', data);
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: () => {
    return get<ApiResult<UserInfo>>('/auth/me');
  },
};
