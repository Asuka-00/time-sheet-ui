import { get, post, put, del } from './request';
import type { ApiResult, PageResult } from 'src/types/common';
import type {
  ReportConfig,
  ReportConfigQuery,
  ReportConfigCreateDto,
  ReportConfigUpdateDto,
} from 'src/types/report-config';

/**
 * 辅助函数：将数组转换为逗号分隔的字符串
 */
const arrayToString = (arr?: string[]): string => {
  return arr && arr.length > 0 ? arr.join(',') : '';
};

/**
 * 前端数据传输接口（带数组字段）
 */
export interface ReportConfigFormData {
  uuid?: string;
  reportName: string;
  cronExpression: string;
  recipientEmailsArray?: string[];
  ccEmailsArray?: string[];
  projectCodes?: string[];
  monthOffset: number;
  isEnabled: boolean;
  description?: string;
}

/**
 * 报表配置管理API
 */
export const reportConfigApi = {
  /**
   * 创建报表配置
   * @param data 报表配置数据
   */
  createReportConfig: (data: ReportConfigCreateDto | ReportConfigFormData) => {
    // 转换数组字段为字符串格式
    const formData = data as ReportConfigFormData;
    const requestData = {
      reportName: formData.reportName,
      cronExpression: formData.cronExpression,
      recipientEmails: arrayToString(formData.recipientEmailsArray),
      ccEmails: arrayToString(formData.ccEmailsArray),
      filterConditions: arrayToString(formData.projectCodes),
      monthOffset: formData.monthOffset !== undefined ? formData.monthOffset : -1,
      isEnabled: formData.isEnabled,
      ...(formData.description && { description: formData.description }),
    };
    return post<ApiResult<void>>('/report-config/create', requestData);
  },

  /**
   * 获取报表配置列表（分页）
   * @param query 查询参数
   */
  getReportConfigList: (query: ReportConfigQuery) => {
    return get<ApiResult<PageResult<ReportConfig>>>('/report-config/list', query);
  },

  /**
   * 查询报表配置
   * @param uuid 配置ID（可选，不传则返回所有配置）
   */
  getReportConfig: (uuid?: string) => {
    return get<ApiResult<ReportConfig[]>>('/report-config/get', uuid ? { uuid } : undefined);
  },

  /**
   * 更新报表配置
   * @param data 报表配置数据
   */
  updateReportConfig: (data: ReportConfigUpdateDto | ReportConfigFormData) => {
    // 转换数组字段为字符串格式
    const formData = data as ReportConfigFormData;
    const requestData = {
      uuid: formData.uuid,
      reportName: formData.reportName,
      cronExpression: formData.cronExpression,
      recipientEmails: arrayToString(formData.recipientEmailsArray),
      ccEmails: arrayToString(formData.ccEmailsArray),
      filterConditions: arrayToString(formData.projectCodes),
      monthOffset: formData.monthOffset !== undefined ? formData.monthOffset : -1,
      isEnabled: formData.isEnabled,
      ...(formData.description && { description: formData.description }),
    };
    return put<ApiResult<void>>('/report-config/update', requestData);
  },

  /**
   * 删除报表配置
   * @param uuid 配置ID
   */
  deleteReportConfig: (uuid: string) => {
    return del<ApiResult<void>>('/report-config/delete', { uuid });
  },

  /**
   * 启用/禁用报表配置
   * @param uuid 配置ID
   * @param isEnabled 是否启用
   */
  toggleReportConfig: (uuid: string, isEnabled: boolean) => {
    return put<ApiResult<void>>('/report-config/toggle', undefined, {
      params: { uuid, isEnabled },
    });
  },

  /**
   * 测试执行报表任务
   * @param uuid 配置ID
   */
  testExecuteReportTask: (uuid: string) => {
    return post<ApiResult<void>>('/report-config/test-execute', undefined, {
      params: { uuid },
    });
  },
};
