<template>
  <q-table
    :rows="reportConfigs"
    :columns="columns"
    :loading="loading"
    v-model:pagination="internalPagination"
    :rows-per-page-options="[5, 10, 20, 50]"
    :pagination-label="getPaginationLabel"
    row-key="uuid"
    flat
    @request="onRequest"
  >
    <!-- 接收邮箱列 -->
    <template #body-cell-recipientEmails="props">
      <q-td :props="props">
        <div class="row q-gutter-xs">
          <q-chip
            v-for="(email, index) in (props.row.recipientEmailsArray || []).slice(0, 2)"
            :key="index"
            dense
            size="sm"
            color="primary"
            text-color="white"
          >
            {{ email }}
          </q-chip>
          <q-chip
            v-if="(props.row.recipientEmailsArray || []).length > 2"
            dense
            size="sm"
            color="grey"
            text-color="white"
          >
            +{{ (props.row.recipientEmailsArray || []).length - 2 }}
          </q-chip>
        </div>
      </q-td>
    </template>

    <!-- 抄送邮箱列 -->
    <template #body-cell-ccEmails="props">
      <q-td :props="props">
        <div class="row q-gutter-xs">
          <q-chip
            v-for="(email, index) in (props.row.ccEmailsArray || []).slice(0, 2)"
            :key="index"
            dense
            size="sm"
            color="secondary"
            text-color="white"
          >
            {{ email }}
          </q-chip>
          <q-chip
            v-if="(props.row.ccEmailsArray || []).length > 2"
            dense
            size="sm"
            color="grey"
            text-color="white"
          >
            +{{ (props.row.ccEmailsArray || []).length - 2 }}
          </q-chip>
          <span v-if="!(props.row.ccEmailsArray || []).length" class="text-grey">-</span>
        </div>
      </q-td>
    </template>

    <!-- 月份偏移量列 -->
    <template #body-cell-monthOffset="props">
      <q-td :props="props">
        <q-badge :color="getMonthOffsetColor(props.row.monthOffset)">
          {{ getMonthOffsetLabel(props.row.monthOffset) }}
        </q-badge>
      </q-td>
    </template>

    <!-- 启用状态列 -->
    <template #body-cell-isEnabled="props">
      <q-td :props="props">
        <q-badge
          :color="props.row.isEnabled ? 'positive' : 'grey'"
          :label="
            props.row.isEnabled
              ? $t('reportConfig.statusEnabled')
              : $t('reportConfig.statusDisabled')
          "
        />
      </q-td>
    </template>

    <!-- 创建时间列 -->
    <template #body-cell-createdAt="props">
      <q-td :props="props">
        {{ formatDateTime(props.row.createdAt) }}
      </q-td>
    </template>

    <!-- 操作列 -->
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          dense
          round
          icon="edit"
          color="primary"
          size="sm"
          v-permission="['button:reportConfig:edit']"
          @click="$emit('edit', props.row)"
        >
          <q-tooltip>{{ $t('reportConfig.edit') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="play_arrow"
          color="info"
          size="sm"
          v-permission="['button:reportConfig:test']"
          @click="$emit('test', props.row)"
        >
          <q-tooltip>{{ $t('reportConfig.test') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          :icon="props.row.isEnabled ? 'toggle_on' : 'toggle_off'"
          :color="props.row.isEnabled ? 'positive' : 'grey'"
          size="sm"
          v-permission="['button:reportConfig:toggle']"
          @click="$emit('toggle', props.row)"
        >
          <q-tooltip>{{
            props.row.isEnabled ? $t('reportConfig.disable') : $t('reportConfig.enable')
          }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="delete"
          color="negative"
          size="sm"
          v-permission="['button:reportConfig:delete']"
          @click="$emit('delete', props.row)"
        >
          <q-tooltip>{{ $t('reportConfig.delete') }}</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps, QTableColumn } from 'quasar';
import type { ReportConfig } from 'src/types/report-config';
import { formatDateTime } from 'src/utils/date-formatter';

interface Props {
  reportConfigs: ReportConfig[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', reportConfig: ReportConfig): void;
  (e: 'test', reportConfig: ReportConfig): void;
  (e: 'delete', reportConfig: ReportConfig): void;
  (e: 'toggle', reportConfig: ReportConfig): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

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
  { deep: true },
);

// 分页标签函数
const getPaginationLabel = (
  firstRowIndex: number,
  endRowIndex: number,
  totalRowsNumber: number,
) => {
  return t('common.paginationLabel', {
    from: firstRowIndex,
    to: endRowIndex,
    total: totalRowsNumber,
  });
};

// 表格列配置
const columns = computed<QTableColumn[]>(() => [
  {
    name: 'reportName',
    label: t('reportConfig.reportName'),
    field: 'reportName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cronExpression',
    label: t('reportConfig.cronExpression'),
    field: 'cronExpression',
    align: 'left',
  },
  {
    name: 'recipientEmails',
    label: t('reportConfig.recipientEmails'),
    field: 'recipientEmails',
    align: 'left',
  },
  {
    name: 'ccEmails',
    label: t('reportConfig.ccEmails'),
    field: 'ccEmails',
    align: 'left',
  },
  {
    name: 'monthOffset',
    label: t('reportConfig.monthOffset'),
    field: 'monthOffset',
    align: 'center',
  },
  {
    name: 'isEnabled',
    label: t('reportConfig.isEnabled'),
    field: 'isEnabled',
    align: 'center',
  },
  {
    name: 'createdAt',
    label: t('reportConfig.createdAt'),
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('reportConfig.actions'),
    field: 'actions',
    align: 'center',
  },
]);

// 获取月份偏移量标签
const getMonthOffsetLabel = (offset: number): string => {
  const labels: Record<number, string> = {
    0: t('reportConfig.monthOffsetOptions.currentMonth'),
    '-1': t('reportConfig.monthOffsetOptions.lastMonth'),
    '-2': t('reportConfig.monthOffsetOptions.twoMonthsAgo'),
    '-3': t('reportConfig.monthOffsetOptions.threeMonthsAgo'),
    '-4': t('reportConfig.monthOffsetOptions.fourMonthsAgo'),
    '-5': t('reportConfig.monthOffsetOptions.fiveMonthsAgo'),
    '-6': t('reportConfig.monthOffsetOptions.sixMonthsAgo'),
  };
  return labels[offset] || `${offset}${t('reportConfig.monthsAgo')}`;
};

// 获取月份偏移量颜色
const getMonthOffsetColor = (offset: number): string => {
  if (offset === 0) return 'info';
  if (offset === -1) return 'primary';
  return 'grey';
};

// 处理分页请求
const onRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  emit('request', evt);
};
</script>

<style scoped lang="scss">
.q-table {
  width: 100%;
}
</style>
