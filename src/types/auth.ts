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
  buttonPermissions?: string[];
}

/**
 * 刷新令牌请求
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 权限推送数据（WebSocket）
 */
export interface PermissionPushDto {
  permissions: Permission[];
  buttonPermissions: string[];
  timestamp: number;
}
