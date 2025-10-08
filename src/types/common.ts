/**
 * API统一响应结构
 */
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  current: number;
  size: number;
  searchKey?: string;
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

/**
 * 审计字段接口
 * 包含创建和更新的时间戳及操作人信息
 */
export interface AuditFields {
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
