<template>
  <div class="work-calendar">
    <!-- 日历头部 - 月份切换 -->
    <div class="calendar-header row items-center justify-between q-mb-sm">
      <q-btn
        flat
        dense
        round
        icon="chevron_left"
        @click="previousMonth"
        :aria-label="$t('dashboard.previousMonth')"
      />
      <div class="text-h6">{{ currentMonthLabel }}</div>
      <q-btn
        flat
        dense
        round
        icon="chevron_right"
        @click="nextMonth"
        :aria-label="$t('dashboard.nextMonth')"
      />
    </div>

    <!-- 星期标题 -->
    <div class="calendar-weekdays row">
      <div
        v-for="day in weekdays"
        :key="day"
        class="calendar-weekday col text-center text-caption text-grey-7"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日历主体 -->
    <div class="calendar-body">
      <div
        v-for="(week, weekIndex) in calendarWeeks"
        :key="`week-${weekIndex}`"
        class="calendar-week row"
      >
        <div
          v-for="(day, dayIndex) in week"
          :key="day ? day.dateString : `empty-${dayIndex}`"
          class="calendar-day col"
          :class="{
            'calendar-day-empty': !day,
            today: day?.isToday,
            selected: day?.dateString === selectedDate,
            'has-timesheet': day?.hasTimesheet,
            'status-bg-1': day?.primaryStatus === 1,
            'status-bg-2': day?.primaryStatus === 2,
            'status-bg-3': day?.primaryStatus === 3,
            'status-bg-4': day?.primaryStatus === 4,
          }"
          @click="day && handleDateClick(day)"
        >
          <template v-if="day">
            <div class="day-number">{{ day.day }}</div>

            <!-- 工时数量显示 -->
            <div v-if="day.totalHours > 0" class="total-hours text-caption">
              {{ day.totalHours }}h
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 图例说明 -->
    <div class="calendar-legend q-mt-md">
      <div class="row items-center q-gutter-md flex-wrap">
        <div class="legend-item row items-center">
          <div class="legend-color-box status-bg-1 q-mr-xs" />
          <span class="text-caption">{{ $t('dashboard.timesheetStatus.draft') }}</span>
        </div>
        <div class="legend-item row items-center">
          <div class="legend-color-box status-bg-2 q-mr-xs" />
          <span class="text-caption">{{ $t('dashboard.timesheetStatus.pending') }}</span>
        </div>
        <div class="legend-item row items-center">
          <div class="legend-color-box status-bg-3 q-mr-xs" />
          <span class="text-caption">{{ $t('dashboard.timesheetStatus.approved') }}</span>
        </div>
        <div class="legend-item row items-center">
          <div class="legend-color-box status-bg-4 q-mr-xs" />
          <span class="text-caption">{{ $t('dashboard.timesheetStatus.rejected') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Timesheet } from 'src/types/timesheet';

interface CalendarDay {
  dateString: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTimesheet: boolean;
  statuses: number[];
  totalHours: number;
  primaryStatus: number | null;
}

interface Props {
  timesheets: Timesheet[];
  selectedDate?: string;
  year: number;
  month: number; // 1-12
}

interface Emits {
  (e: 'date-click', date: string): void;
  (e: 'month-change', year: number, month: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  timesheets: () => [],
  selectedDate: '',
});

const emit = defineEmits<Emits>();

// 使用props的年月（month需要从1-12转换为0-11）
const currentYear = computed(() => props.year);
const currentMonth = computed(() => props.month - 1);

// 星期标题
const weekdays = computed(() => ['日', '一', '二', '三', '四', '五', '六']);

// 当前月份标签
const currentMonthLabel = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`;
});

// 今天的日期字符串
const todayString = computed(() => {
  const today = new Date();
  return formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
});

// 生成日历数据
const calendarWeeks = computed(() => {
  const weeks: (CalendarDay | null)[][] = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  // 获取第一天是星期几（0-6）和当月总天数
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 生成6周的日历网格
  for (let week = 0; week < 6; week++) {
    const weekDays: (CalendarDay | null)[] = [];

    for (let day = 0; day < 7; day++) {
      const dayIndex = week * 7 + day;
      const monthDay = dayIndex - firstDayOfWeek + 1;

      // 只为当月日期创建CalendarDay对象
      if (monthDay >= 1 && monthDay <= daysInMonth) {
        const dateString = formatDateString(currentYear.value, currentMonth.value, monthDay);

        const isToday = dateString === todayString.value;

        // 获取该日期的工时数据
        const dayTimesheets = getTimesheetsForDate(dateString);
        const hasTimesheet = dayTimesheets.length > 0;
        const statuses = [...new Set(dayTimesheets.map((t) => t.status))];
        const totalHours = dayTimesheets.reduce((sum, t) => sum + t.hours, 0);
        const primaryStatus = getPrimaryStatus(statuses);

        weekDays.push({
          dateString,
          day: monthDay,
          isCurrentMonth: true,
          isToday,
          hasTimesheet,
          statuses,
          totalHours,
          primaryStatus,
        });
      } else {
        // 非当月日期推入null
        weekDays.push(null);
      }
    }

    weeks.push(weekDays);
  }

  return weeks;
});

// 格式化日期字符串 YYYY-MM-DD
const formatDateString = (year: number, month: number, day: number): string => {
  const y = year.toString();
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 获取指定日期的工时列表
const getTimesheetsForDate = (dateString: string): Timesheet[] => {
  return props.timesheets.filter((t) => t.workDate.startsWith(dateString));
};

// 计算主要状态（优先级：4 > 2 > 3 > 1）
const getPrimaryStatus = (statuses: number[]): number | null => {
  if (statuses.length === 0) return null;

  const statusPriority = [4, 2, 3, 1]; // 驳回 > 待审核 > 已通过 > 草稿

  for (const priority of statusPriority) {
    if (statuses.includes(priority)) {
      return priority;
    }
  }

  return statuses[0] || null;
};

// 上一个月
const previousMonth = () => {
  let newYear = props.year;
  let newMonth = props.month;
  
  if (newMonth === 1) {
    newMonth = 12;
    newYear--;
  } else {
    newMonth--;
  }
  
  emit('month-change', newYear, newMonth);
};

// 下一个月
const nextMonth = () => {
  let newYear = props.year;
  let newMonth = props.month;
  
  if (newMonth === 12) {
    newMonth = 1;
    newYear++;
  } else {
    newMonth++;
  }
  
  emit('month-change', newYear, newMonth);
};

// 点击日期
const handleDateClick = (day: CalendarDay) => {
  emit('date-click', day.dateString);
};
</script>

<style scoped lang="scss">
.work-calendar {
  width: 100%;
  max-width: 100%;
}

.calendar-header {
  padding: 0 8px;
}

.calendar-weekdays {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.calendar-weekday {
  font-weight: 500;
  padding: 4px;
}

.calendar-body {
  .calendar-week {
    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

.calendar-day {
  position: relative;
  padding: 4px 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 35px;
  height: 35px;

  &:hover:not(.calendar-day-empty) {
    background-color: #f5f5f5;
  }

  &.calendar-day-empty {
    cursor: default;
    pointer-events: none;
  }

  &.today {
    .day-number {
      background: var(--q-primary);
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  }

  &.selected {
    border-color: var(--q-primary);
    background-color: rgba(var(--q-primary-rgb), 0.05);
  }

  &.has-timesheet {
    font-weight: 500;
  }
}

.day-number {
  font-size: 11px;
  margin-bottom: 2px;
}

.timesheet-indicators {
  display: flex;
  gap: 2px;
  margin-top: auto;
  margin-bottom: 1px;
}

.status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;

  &.status-1 {
    background-color: #9e9e9e; // 草稿 - 灰色
  }

  &.status-2 {
    background-color: #ff9800; // 待审核 - 橙色
  }

  &.status-3 {
    background-color: #4caf50; // 已通过 - 绿色
  }

  &.status-4 {
    background-color: #f44336; // 已驳回 - 红色
  }
}

// 状态背景颜色类
.status-bg-1 {
  background-color: rgba(158, 158, 158, 0.15); // 草稿 - 半透明灰色

  .day-number {
    color: #424242;
    font-weight: 600;
  }
}

.status-bg-2 {
  background-color: rgba(255, 152, 0, 0.15); // 待审核 - 半透明橙色

  .day-number {
    color: #d84315;
    font-weight: 600;
  }
}

.status-bg-3 {
  background-color: rgba(76, 175, 80, 0.15); // 已通过 - 半透明绿色

  .day-number {
    color: #2e7d32;
    font-weight: 600;
  }
}

.status-bg-4 {
  background-color: rgba(244, 67, 54, 0.15); // 已驳回 - 半透明红色

  .day-number {
    color: #c62828;
    font-weight: 600;
  }
}

.total-hours {
  font-size: 8px;
  color: #757575;
  margin-top: 1px;
}

.calendar-legend {
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;

  .legend-item {
    .legend-color-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

// 响应式设计
@media (max-width: 600px) {
  .calendar-day {
    min-height: 30px;
    height: 30px;
    padding: 2px 1px;
  }

  .day-number {
    font-size: 10px;
    margin-bottom: 1px;
  }

  .total-hours {
    font-size: 7px;
  }

  .status-dot {
    width: 3px;
    height: 3px;
  }

  // 移动端状态背景样式优化
  .status-bg-1,
  .status-bg-2,
  .status-bg-3,
  .status-bg-4 {
    .day-number {
      font-size: 10px;
      font-weight: 700; // 移动端加粗以提高可读性
    }
  }

  .calendar-legend {
    .legend-item {
      .legend-color-box {
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>
