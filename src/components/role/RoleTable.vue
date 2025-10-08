<template>
  <q-table
    :rows="roles"
    :columns="columns"
    :loading="loading"
    v-model:pagination="internalPagination"
    :rows-per-page-options="[5, 10, 20, 50]"
    :pagination-label="getPaginationLabel"
    row-key="uuid"
    flat
    @request="onRequest"
  >
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
          <q-tooltip>{{ $t('role.edit') }}</q-tooltip>
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
          <q-tooltip>{{ $t('role.delete') }}</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps } from 'quasar';
import type { Role } from 'src/types/role';
import { formatDateTime } from 'src/utils/date-formatter';

interface Props {
  roles: Role[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', role: Role): void;
  (e: 'delete', role: Role): void;
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

// 表格列定义
const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('role.table.roleName'),
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: t('role.table.description'),
    field: 'description',
    align: 'left',
    sortable: false,
  },
  {
    name: 'createdAt',
    label: t('role.table.createdAt'),
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('role.table.actions'),
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
