<template>
  <div class="permission-table">
    <q-table
      :rows="permissions"
      :columns="columns"
      row-key="uuid"
      :loading="loading"
      v-model:pagination="internalPagination"
      :rows-per-page-options="[5, 10, 20, 50]"
      :pagination-label="getPaginationLabel"
      @request="onRequest"
      flat
      bordered
    >
      <!-- 状态列自定义渲染 -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 1 ? 'positive' : 'grey'"
            :label="
              props.row.status === 1
                ? $t('permission.statusActive')
                : $t('permission.statusInactive')
            "
          />
        </q-td>
      </template>

      <!-- 操作列 -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="primary"
            icon="edit"
            v-permission="['button:permission:edit']"
            :title="$t('permission.edit')"
            @click="$emit('edit', props.row)"
          >
            <q-tooltip>{{ $t('permission.edit') }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete"
            v-permission="['button:permission:delete']"
            :title="$t('permission.delete')"
            @click="$emit('delete', props.row)"
          >
            <q-tooltip>{{ $t('permission.delete') }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Permission } from 'src/types/permission';
import type { QTableColumn, QTableProps } from 'quasar';

interface Props {
  permissions: Permission[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', permission: Permission): void;
  (e: 'delete', permission: Permission): void;
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
    name: 'name',
    label: t('permission.name'),
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'code',
    label: t('permission.code'),
    field: 'code',
    align: 'left',
    sortable: true,
  },
  {
    name: 'module',
    label: t('permission.module'),
    field: 'module',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: t('permission.type'),
    field: 'type',
    align: 'left',
  },
  {
    name: 'description',
    label: t('permission.description'),
    field: 'description',
    align: 'left',
  },
  {
    name: 'sort',
    label: t('permission.sort'),
    field: 'sort',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: t('permission.status'),
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: t('permission.actions'),
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
.permission-table {
  width: 100%;
}
</style>
