/**
 * 数据处理工具函数
 */

import type { AuditFields } from 'src/types';

/**
 * 从对象中移除审计字段
 * @param data 包含审计字段的对象
 * @returns 移除审计字段后的对象
 */
export function omitAuditFields<T extends Partial<AuditFields>>(
  data: T
): Omit<T, keyof AuditFields> {
  const { createdBy, createdAt, updatedBy, updatedAt, ...rest } = data;
  // 显式使用这些变量以避免 lint 警告
  void createdBy;
  void createdAt;
  void updatedBy;
  void updatedAt;
  return rest as Omit<T, keyof AuditFields>;
}

/**
 * 从对象中移除审计字段和指定的额外字段
 * @param data 数据对象
 * @param keys 要移除的额外键名数组
 * @returns 移除指定字段后的对象
 */
export function omitFields<T, K extends keyof T>(
  data: T,
  keys: K[]
): Omit<T, K | keyof AuditFields> {
  const result = omitAuditFields(data as T & Partial<AuditFields>);
  const filtered = { ...result } as Record<string, unknown>;
  keys.forEach((key) => {
    delete filtered[key as string];
  });
  return filtered as Omit<T, K | keyof AuditFields>;
}
