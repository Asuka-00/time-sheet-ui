/**
 * 日期时间格式化工具函数
 * 统一格式化项目中所有的日期时间显示
 */

import { useAuthStore } from 'src/stores/auth';

/**
 * 从auth store获取当前用户时区
 * @returns 用户时区，默认为系统时区
 */
function getUserTimezone(): string | undefined {
  try {
    const authStore = useAuthStore();
    return authStore.userInfo?.timezone;
  } catch {
    return undefined;
  }
}

/**
 * 将UTC时间转换到指定时区
 * @param date Date对象
 * @param timezone 目标时区（IANA格式）
 * @returns 转换后的Date对象
 */
function convertToTimezone(date: Date, timezone?: string): Date {
  if (!timezone) {
    return date;
  }

  try {
    // 使用Intl API获取目标时区的时间字符串
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const values: Record<string, string> = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    });

    // 构建目标时区的Date对象
    return new Date(
      `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
    );
  } catch (error) {
    console.warn('Timezone conversion failed, using original date:', error);
    return date;
  }
}

/**
 * 辅助函数：将数字补零到两位
 * @param num 需要补零的数字
 * @returns 补零后的字符串
 */
function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * 格式化日期时间为 yyyy-mm-dd hh:mm:ss 格式
 * @param dateStr 日期字符串或 Date 对象
 * @param timezone 时区（可选，不传则使用当前用户时区）
 * @returns 格式化后的日期时间字符串，如果输入为空则返回 '-'
 * @example
 * formatDateTime('2024-10-02T18:02:52') // '2024-10-02 18:02:52' (使用用户时区)
 * formatDateTime(new Date()) // '2024-10-02 18:02:52' (使用用户时区)
 * formatDateTime('2024-10-02T18:02:52', 'Asia/Tokyo') // '2024-10-03 03:02:52' (指定时区)
 */
export function formatDateTime(dateStr?: string | Date, timezone?: string): string {
  if (!dateStr) return '-';

  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }

    // 应用时区转换
    const targetTimezone = timezone ?? getUserTimezone();
    const convertedDate = convertToTimezone(date, targetTimezone);

    const year = convertedDate.getFullYear();
    const month = padZero(convertedDate.getMonth() + 1);
    const day = padZero(convertedDate.getDate());
    const hours = padZero(convertedDate.getHours());
    const minutes = padZero(convertedDate.getMinutes());
    const seconds = padZero(convertedDate.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
}

/**
 * 格式化日期为 yyyy-mm-dd 格式
 * @param dateStr 日期字符串或 Date 对象
 * @param timezone 时区（可选，不传则使用当前用户时区）
 * @returns 格式化后的日期字符串，如果输入为空则返回 '-'
 * @example
 * formatDate('2024-10-02T18:02:52') // '2024-10-02' (使用用户时区)
 * formatDate('2024-10-02') // '2024-10-02' (使用用户时区)
 * formatDate(new Date()) // '2024-10-02' (使用用户时区)
 * formatDate('2024-10-02T23:30:00', 'Asia/Tokyo') // '2024-10-03' (指定时区，可能跨日期)
 */
export function formatDate(dateStr?: string | Date, timezone?: string): string {
  if (!dateStr) return '-';

  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }

    // 应用时区转换
    const targetTimezone = timezone ?? getUserTimezone();
    const convertedDate = convertToTimezone(date, targetTimezone);

    const year = convertedDate.getFullYear();
    const month = padZero(convertedDate.getMonth() + 1);
    const day = padZero(convertedDate.getDate());

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
}
