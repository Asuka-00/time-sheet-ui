import type { PageQuery, PageResult } from './common';

/**
 * 报表配置接口
 */
export interface ReportConfig {
  uuid?: string;
  reportType: string;
  reportName: string;
  cronExpression: string;
  recipientEmails: string; // 逗号分隔的字符串
  recipientEmailsArray?: string[]; // 数组形式（VO返回）
  filterConditions?: string; // 逗号分隔的项目编号字符串
  projectCodes?: string[]; // 数组形式（VO返回）
  isEnabled: boolean;
  description?: string;
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
}

/**
 * 报表配置查询参数
 */
export interface ReportConfigQuery extends PageQuery {
  searchKey?: string;
}

/**
 * 报表配置分页结果
 */
export type ReportConfigPageResult = PageResult<ReportConfig>;

/**
 * 报表配置创建DTO - 排除审计字段和uuid
 */
export type ReportConfigCreateDto = Omit<
  ReportConfig,
  'uuid' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;

/**
 * 报表配置更新DTO - 排除审计字段但保留uuid
 */
export type ReportConfigUpdateDto = Omit<
  ReportConfig,
  'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;
