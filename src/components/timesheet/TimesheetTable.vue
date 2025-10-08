<template>
  <q-table
    :rows="timesheets"
    :columns="columns"
    :loading="loading"
    v-model:pagination="internalPagination"
    :rows-per-page-options="[5, 10, 20, 50]"
    :pagination-label="getPaginationLabel"
    :selection="selectable ? 'multiple' : 'none'"
    v-model:selected="selectedModel"
    row-key="uuid"
    flat
    bordered
    @request="handleRequest"
  >
    <!-- 状态列插槽 -->
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge :color="getStatusColor(props.row.status)" :label="props.row.statusText" />
      </q-td>
    </template>

    <!-- 工作描述列插槽 -->
    <template #body-cell-description="props">
      <q-td :props="props">
        <div class="text-ellipsis" style="max-width: 300px">
          {{ props.row.description }}
        </div>
      </q-td>
    </template>

    <!-- 操作列插槽 -->
    <template #body-cell-actions="props">
      <q-td :props="props">
        <div class="q-gutter-xs">
          <!-- 我的工时表操作 -->
          <template v-if="actionType === 'manage'">
            <!-- 编辑按钮（仅草稿状态） -->
            <q-btn
              v-if="props.row.status === 1"
              flat
              dense
              color="primary"
              icon="edit"
              size="sm"
              @click="$emit('edit', props.row)"
            >
              <q-tooltip>{{ $t('timesheet.edit') }}</q-tooltip>
            </q-btn>

            <!-- 删除按钮（仅草稿状态） -->
            <q-btn
              v-if="props.row.status === 1"
              flat
              dense
              color="negative"
              icon="delete"
              size="sm"
              @click="$emit('delete', props.row)"
            >
              <q-tooltip>{{ $t('timesheet.delete') }}</q-tooltip>
            </q-btn>

            <!-- 提交按钮（仅草稿状态） -->
            <q-btn
              v-if="props.row.status === 1"
              flat
              dense
              color="positive"
              icon="send"
              size="sm"
              @click="$emit('submit', props.row)"
            >
              <q-tooltip>{{ $t('timesheet.submit') }}</q-tooltip>
            </q-btn>

            <!-- 撤回按钮（仅待审核状态） -->
            <q-btn
              v-if="props.row.status === 2"
              flat
              dense
              color="warning"
              icon="undo"
              size="sm"
              @click="$emit('withdraw', props.row)"
            >
              <q-tooltip>{{ $t('timesheet.withdraw') }}</q-tooltip>
            </q-btn>
          </template>

          <!-- 审核操作 -->
          <template v-if="actionType === 'review'">
            <!-- 通过按钮 -->
            <q-btn
              flat
              dense
              color="positive"
              icon="check"
              size="sm"
              @click="$emit('review', { timesheet: props.row, action: 'approve' })"
            >
              <q-tooltip>{{ $t('timesheet.approve') }}</q-tooltip>
            </q-btn>

            <!-- 驳回按钮 -->
            <q-btn
              flat
              dense
              color="negative"
              icon="close"
              size="sm"
              @click="$emit('review', { timesheet: props.row, action: 'reject' })"
            >
              <q-tooltip>{{ $t('timesheet.reject') }}</q-tooltip>
            </q-btn>
          </template>

          <!-- 查看详情按钮 -->
          <q-btn
            flat
            dense
            color="info"
            icon="visibility"
            size="sm"
            @click="$emit('view-detail', props.row)"
          >
            <q-tooltip>{{ $t('timesheet.viewDetail') }}</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>

    <!-- 无数据插槽 -->
    <template #no-data>
      <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
        <q-icon name="info" size="2em" />
        <span>{{ $t('timesheet.message.noData') }}</span>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps } from 'quasar';
import type { Timesheet } from 'src/types/timesheet';
import { formatDate, formatDateTime } from 'src/utils/date-formatter';

// Props
interface Props {
  timesheets: Timesheet[];
  loading?: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
  showActions?: boolean;
  actionType?: 'manage' | 'review' | 'view';
  selectable?: boolean;
  selected?: Timesheet[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  actionType: 'manage',
  selectable: false,
  selected: () => [],
  pagination: () => ({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  }),
});

// Emits
const emit = defineEmits<{
  request: [evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]];
  edit: [timesheet: Timesheet];
  delete: [timesheet: Timesheet];
  submit: [timesheet: Timesheet];
  withdraw: [timesheet: Timesheet];
  review: [data: { timesheet: Timesheet; action: 'approve' | 'reject' }];
  'view-detail': [timesheet: Timesheet];
  'selection-change': [selected: Timesheet[]];
}>();

const { t } = useI18n();

// 选中的行（使用 computed 实现双向绑定）
const selectedModel = computed({
  get: () => props.selected || [],
  set: (value) => {
    console.log('[TimesheetTable] Selection model updated:', value.length);
    emit('selection-change', value);
  },
});

// 内部分页状态
const internalPagination = ref({
  page: props.pagination.page,
  rowsPerPage: props.pagination.rowsPerPage,
  rowsNumber: props.pagination.rowsNumber,
});

// 监听 props.pagination 的变化，同步到内部状态
watch(
  () => props.pagination,
  (newPagination) => {
    internalPagination.value = {
      page: newPagination.page,
      rowsPerPage: newPagination.rowsPerPage,
      rowsNumber: newPagination.rowsNumber,
    };
  },
  { deep: true }
);

// 分页标签函数
const getPaginationLabel = (firstRowIndex: number, endRowIndex: number, totalRowsNumber: number) => {
  return t('common.paginationLabel', {
    from: firstRowIndex,
    to: endRowIndex,
    total: totalRowsNumber,
  });
};

// 表格列定义
const columns = computed<QTableProps['columns']>(() => {
  const baseColumns: QTableProps['columns'] = [
    {
      name: 'timesheetCode',
      label: t('timesheet.table.timesheetCode'),
      field: 'timesheetCode',
      align: 'left',
      sortable: true,
    },
    {
      name: 'projectName',
      label: t('timesheet.table.projectName'),
      field: 'projectName',
      align: 'left',
      sortable: true,
    },
  ];

  // 如果是审核页面或查看页面，显示用户姓名
  if (props.actionType === 'review' || props.actionType === 'view') {
    baseColumns.push({
      name: 'userName',
      label: t('timesheet.table.userName'),
      field: 'userName',
      align: 'left',
      sortable: true,
    });
  }

  baseColumns.push(
    {
      name: 'workDate',
      label: t('timesheet.table.workDate'),
      field: 'workDate',
      align: 'center',
      sortable: true,
      format: (val: string) => formatDate(val),
    },
    {
      name: 'hours',
      label: t('timesheet.table.hours'),
      field: 'hours',
      align: 'center',
      sortable: true,
    },
    {
      name: 'description',
      label: t('timesheet.table.description'),
      field: 'description',
      align: 'left',
    },
    {
      name: 'status',
      label: t('timesheet.table.status'),
      field: 'status',
      align: 'center',
      sortable: true,
    },
  );

  // 如果是审核页面或查看页面，显示提交日期
  if (props.actionType === 'review' || props.actionType === 'view') {
    baseColumns.push({
      name: 'submitDate',
      label: t('timesheet.table.submitDate'),
      field: 'submitDate',
      align: 'center',
      sortable: true,
      format: (val: string) => formatDateTime(val),
    });
  }

  // 显示操作列
  if (props.showActions) {
    baseColumns.push({
      name: 'actions',
      label: t('timesheet.table.actions'),
      field: 'actions',
      align: 'center',
    });
  }

  return baseColumns;
});

// 获取状态颜色
const getStatusColor = (status: number): string => {
  switch (status) {
    case 1:
      return 'grey';
    case 2:
      return 'warning';
    case 3:
      return 'positive';
    case 4:
      return 'negative';
    default:
      return 'grey';
  }
};

// 处理分页请求
const handleRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  emit('request', evt);
};
</script>

<style scoped lang="scss">
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
