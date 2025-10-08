/**
 * 项目状态枚举
 */
export enum ProjectStatus {
  IN_PROGRESS = 1, // 进行中
  COMPLETED = 2, // 已完成
  CANCELLED = 3, // 已取消
}

/**
 * 项目接口
 */
export interface Project {
  uuid?: string;
  projectCode: string;
  projectName: string;
  description?: string;
  managerUserCode: string;
  managerUserName?: string; // 项目经理姓名（从VO扩展）
  memberCount?: number; // 成员数量（从VO扩展）
  startDate?: string;
  endDate?: string;
  status?: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 创建项目DTO
 */
export interface ProjectCreateDto {
  projectCode: string;
  projectName: string;
  description?: string;
  managerUserCode: string;
  startDate?: string;
  endDate?: string;
  status?: number;
}

/**
 * 更新项目DTO
 */
export interface ProjectUpdateDto {
  uuid: string;
  projectCode: string;
  projectName: string;
  description?: string;
  managerUserCode: string;
  startDate?: string;
  endDate?: string;
  status?: number;
}

/**
 * 项目查询参数
 */
export interface ProjectQuery {
  current?: number;
  size?: number;
  searchKey?: string;
}

/**
 * 项目成员接口
 */
export interface ProjectMember {
  uuid?: string;
  projectCode: string;
  userCode: string;
  userName?: string; // 成员姓名（从VO扩展）
  email?: string; // 成员邮箱（从VO扩展）
  role?: string;
  joinDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 项目成员DTO
 */
export interface ProjectMemberDto {
  uuid?: string;
  projectCode: string;
  userCode: string;
  role?: string;
  joinDate?: string;
}
