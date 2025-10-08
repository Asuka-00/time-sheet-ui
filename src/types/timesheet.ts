/**
 * 工时状态枚举
 */
export enum TimesheetStatus {
  DRAFT = 1, // 草稿
  PENDING_REVIEW = 2, // 待审核
  APPROVED = 3, // 已通过
  REJECTED = 4, // 已驳回
}

/**
 * 工时记录接口
 */
export interface Timesheet {
  uuid?: string;
  timesheetCode?: string;
  userCode: string;
  userName?: string;
  projectCode: string;
  projectName?: string;
  workDate: string;
  hours: number;
  description: string;
  status: number;
  statusText?: string;
  submitDate?: string;
  reviewerUserCode?: string;
  reviewerUserName?: string;
  reviewDate?: string;
  reviewComment?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 创建工时记录DTO
 */
export interface CreateTimesheetDto {
  projectCode: string;
  workDate: string;
  hours: number;
  description: string;
}

/**
 * 批量创建工时记录DTO
 */
export interface BatchCreateTimesheetDto {
  timesheets: CreateTimesheetDto[];
}

/**
 * 更新工时记录DTO
 */
export interface UpdateTimesheetDto {
  uuid: string;
  projectCode?: string;
  workDate?: string;
  hours?: number;
  description?: string;
}

/**
 * 审核工时记录DTO
 */
export interface ReviewTimesheetDto {
  uuid: string;
  status: number; // 3-通过，4-驳回
  reviewComment?: string;
}

/**
 * 批量审核DTO
 */
export interface BatchReviewTimesheetDto {
  reviews: ReviewTimesheetDto[];
}

/**
 * 工时查询参数
 */
export interface TimesheetQuery {
  current?: number;
  size?: number;
  userCode?: string;
  projectCode?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * 工时统计数据
 */
export interface TimesheetStatistics {
  totalHours: number;
  totalRecords: number;
  projectStats: Record<string, number>;
  statusStats: {
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

/**
 * 工时统计查询参数
 */
export interface TimesheetStatisticsQuery {
  userCode?: string;
  projectCode?: string;
  startDate?: string;
  endDate?: string;
}
