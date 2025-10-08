<template>
  <q-table
    :rows="departments"
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
          :color="props.row.status === 1 ? 'positive' : 'grey'"
          :label="props.row.status === 1 ? $t('department.statusActive') : $t('department.statusInactive')"
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
          @click="$emit('edit', props.row)"
        >
          <q-tooltip>{{ $t('department.edit') }}</q-tooltip>
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
          <q-tooltip>{{ $t('department.delete') }}</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps, QTableColumn } from 'quasar';
import type { Department } from 'src/types/department';
import { formatDateTime } from 'src/utils/date-formatter';

interface Props {
  departments: Department[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', department: Department): void;
  (e: 'delete', department: Department): void;
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

// 表格列配置
const columns = computed<QTableColumn[]>(() => [
  {
    name: 'name',
    label: t('department.name'),
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: t('department.description'),
    field: 'description',
    align: 'left',
  },
  {
    name: 'parentDepartmentName',
    label: t('department.parentDepartmentName'),
    field: 'parentDepartmentName',
    align: 'left',
  },
  {
    name: 'status',
    label: t('department.status'),
    field: 'status',
    align: 'center',
  },
  {
    name: 'createdAt',
    label: t('department.createdAt'),
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('department.actions'),
    field: 'actions',
    align: 'center',
  },
]);

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

