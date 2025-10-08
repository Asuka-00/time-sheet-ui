import type { PageQuery, PageResult, AuditFields } from './common';

// 用户类型定义
export interface User extends AuditFields {
  uuid?: string;
  userCode: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  roleName: string;
  departmentName: string;
  timezone?: string;
  status: number;
}

// 用户查询参数
export type UserQuery = PageQuery;

// 用户分页结果
export type UserPageResult = PageResult<User>;

// 用户创建DTO - 排除审计字段和uuid
export type UserCreateDto = Omit<User, 'uuid' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>;

// 用户更新DTO - 排除审计字段但保留uuid
export type UserUpdateDto = Omit<User, 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>;

// 修改密码DTO
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
