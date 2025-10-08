import { get, post, put, del } from './request';
import type { ApiResult, PageResult } from 'src/types/common';
import type {
  Timesheet,
  CreateTimesheetDto,
  BatchCreateTimesheetDto,
  UpdateTimesheetDto,
  ReviewTimesheetDto,
  BatchReviewTimesheetDto,
  TimesheetQuery,
  TimesheetStatistics,
  TimesheetStatisticsQuery,
} from 'src/types/timesheet';

/**
 * 工时管理API
 */
export const timesheetApi = {
  /**
   * 创建工时记录
   * @param data 工时数据
   */
  createTimesheet: (data: CreateTimesheetDto) => {
    return post<ApiResult<void>>('/timesheet/create', data);
  },

  /**
   * 批量创建工时记录
   * @param data 批量工时数据
   */
  batchCreateTimesheets: (data: BatchCreateTimesheetDto) => {
    return post<ApiResult<{ successCount: number; failedCount: number; errors: Array<{ index: number; error: string }> }>>('/timesheet/batch-create', data);
  },

  /**
   * 更新工时记录
   * @param data 工时数据
   */
  updateTimesheet: (data: UpdateTimesheetDto) => {
    return put<ApiResult<void>>('/timesheet/update', data);
  },

  /**
   * 删除工时记录
   * @param uuid 工时记录ID
   */
  deleteTimesheet: (uuid: string) => {
    return del<ApiResult<void>>('/timesheet/delete', { uuid });
  },

  /**
   * 提交工时审核
   * @param uuid 工时记录ID
   */
  submitTimesheet: (uuid: string) => {
    return post<ApiResult<void>>(`/timesheet/submit?uuid=${uuid}`);
  },

  /**
   * 批量提交工时审核
   * @param uuids 工时记录ID数组
   */
  batchSubmitTimesheets: (uuids: string[]) => {
    return post<ApiResult<void>>('/timesheet/batch-submit', { uuids });
  },

  /**
   * 撤回工时审核
   * @param uuid 工时记录ID
   */
  withdrawTimesheet: (uuid: string) => {
    return post<ApiResult<void>>(`/timesheet/withdraw?uuid=${uuid}`);
  },

  /**
   * 审核工时记录
   * @param data 审核数据
   */
  reviewTimesheet: (data: ReviewTimesheetDto) => {
    return post<ApiResult<void>>('/timesheet/review', data);
  },

  /**
   * 批量审核工时记录
   * @param data 批量审核数据
   */
  batchReviewTimesheets: (data: BatchReviewTimesheetDto) => {
    return post<ApiResult<void>>('/timesheet/batch-review', data);
  },

  /**
   * 查询我的工时列表（分页）
   * @param query 查询参数
   */
  getMyTimesheets: (query: TimesheetQuery) => {
    return get<ApiResult<PageResult<Timesheet>>>('/timesheet/my-timesheets', query);
  },

  /**
   * 查询待我审核的工时列表（分页）
   * @param query 查询参数
   */
  getPendingReviewTimesheets: (query: TimesheetQuery) => {
    return get<ApiResult<PageResult<Timesheet>>>('/timesheet/pending-review', query);
  },

  /**
   * 查询项目经理管理的工时列表（分页）
   * @param query 查询参数
   */
  getProjectManagerTimesheets: (query: TimesheetQuery) => {
    return get<ApiResult<PageResult<Timesheet>>>('/timesheet/project-manager-timesheets', query);
  },

  /**
   * 查询工时列表（管理员用，分页）
   * @param query 查询参数
   */
  getTimesheetList: (query: TimesheetQuery) => {
    return get<ApiResult<PageResult<Timesheet>>>('/timesheet/list', query);
  },

  /**
   * 查询工时详情
   * @param uuid 工时记录ID
   */
  getTimesheetDetail: (uuid: string) => {
    return get<ApiResult<Timesheet>>('/timesheet/detail', { uuid });
  },

  /**
   * 工时统计
   * @param params 统计参数
   */
  getTimesheetStatistics: (params: TimesheetStatisticsQuery) => {
    return get<ApiResult<TimesheetStatistics>>('/timesheet/statistics', params);
  },
};
