import type { Permission } from './permission';

/**
 * 用户信息接口
 */
export interface UserInfo {
  uuid: string;
  userCode: string;
  userName: string;
  email: string;
  roleName?: string;
  departmentName?: string;
  timezone?: string;
  status: number;
}

/**
 * 登录请求
 */
export interface LoginRequest {
  userCode: string;
  password: string;
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  userCode: string;
  userName: string;
  password: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  permissions?: Permission[];
}

/**
 * 刷新令牌请求
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}
