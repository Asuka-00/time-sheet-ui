<template>
  <q-table
    :rows="projects"
    :columns="columns"
    :loading="loading"
    v-model:pagination="internalPagination"
    :rows-per-page-options="[5, 10, 20, 50]"
    :pagination-label="getPaginationLabel"
    row-key="uuid"
    flat
    @request="onRequest"
  >
    <!-- 状态列 -->
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge
          :color="getStatusColor(props.row.status)"
          :label="getStatusLabel(props.row.status)"
        />
      </q-td>
    </template>

    <!-- 日期列格式化 -->
    <template #body-cell-startDate="props">
      <q-td :props="props">
        {{ formatDate(props.row.startDate) }}
      </q-td>
    </template>

    <template #body-cell-endDate="props">
      <q-td :props="props">
        {{ formatDate(props.row.endDate) }}
      </q-td>
    </template>

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
          @click="$emit('edit', props.row)"
        >
          <q-tooltip>{{ $t('project.edit') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="group"
          color="info"
          size="sm"
          @click="$emit('members', props.row)"
        >
          <q-tooltip>{{ $t('project.manageMembers') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="delete"
          color="negative"
          size="sm"
          @click="$emit('delete', props.row)"
        >
          <q-tooltip>{{ $t('project.delete') }}</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps } from 'quasar';
import type { Project } from 'src/types/project';
import { ProjectStatus } from 'src/types/project';
import { formatDate, formatDateTime } from 'src/utils/date-formatter';

interface Props {
  projects: Project[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', project: Project): void;
  (e: 'delete', project: Project): void;
  (e: 'members', project: Project): void;
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

// 获取状态颜色
const getStatusColor = (status?: number) => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return 'primary';
    case ProjectStatus.COMPLETED:
      return 'positive';
    case ProjectStatus.CANCELLED:
      return 'grey';
    default:
      return 'grey';
  }
};

// 获取状态标签
const getStatusLabel = (status?: number) => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return t('project.statusOptions.inProgress');
    case ProjectStatus.COMPLETED:
      return t('project.statusOptions.completed');
    case ProjectStatus.CANCELLED:
      return t('project.statusOptions.cancelled');
    default:
      return '';
  }
};


// 表格列定义
const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'projectCode',
    label: t('project.table.projectCode'),
    field: 'projectCode',
    align: 'left',
    sortable: true,
  },
  {
    name: 'projectName',
    label: t('project.table.projectName'),
    field: 'projectName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'managerUserName',
    label: t('project.table.manager'),
    field: 'managerUserName',
    align: 'left',
    sortable: false,
  },
  {
    name: 'memberCount',
    label: t('project.table.memberCount'),
    field: 'memberCount',
    align: 'center',
    sortable: false,
  },
  {
    name: 'status',
    label: t('project.table.status'),
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'startDate',
    label: t('project.table.startDate'),
    field: 'startDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'endDate',
    label: t('project.table.endDate'),
    field: 'endDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: t('project.table.createdAt'),
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('project.table.actions'),
    field: 'actions',
    align: 'center',
    sortable: false,
  },
]);

// 分页请求事件
const onRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  emit('request', evt);
};
</script>
