<template>
  <div class="user-table">
    <q-table
      :rows="users"
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
            :label="props.row.status === 1 ? $t('user.statusActive') : $t('user.statusInactive')"
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
            :title="$t('user.edit')"
            v-permission="['button:user:edit']"
            @click="$emit('edit', props.row)"
          >
            <q-tooltip>{{ $t('user.edit') }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="warning"
            icon="lock_reset"
            :title="$t('user.resetPassword')"
            v-permission="['button:user:resetPassword']"
            @click="$emit('resetPassword', props.row)"
          >
            <q-tooltip>{{ $t('user.resetPassword') }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete"
            :title="$t('user.delete')"
            v-permission="['button:user:delete']"
            @click="$emit('delete', props.row)"
          >
            <q-tooltip>{{ $t('user.delete') }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from 'src/types/user';
import type { QTableColumn, QTableProps } from 'quasar';

interface Props {
  users: User[];
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  };
}

interface Emits {
  (e: 'request', evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]): void;
  (e: 'edit', user: User): void;
  (e: 'delete', user: User): void;
  (e: 'resetPassword', user: User): void;
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
    name: 'userCode',
    label: t('user.userCode'),
    field: 'userCode',
    align: 'left',
    sortable: true,
  },
  {
    name: 'userName',
    label: t('user.userName'),
    field: 'userName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: t('user.email'),
    field: 'email',
    align: 'left',
    format: (val: string | undefined) => val || '-',
  },
  {
    name: 'phoneNumber',
    label: t('user.phoneNumber'),
    field: 'phoneNumber',
    align: 'left',
    format: (val: string | undefined) => val || '-',
  },
  {
    name: 'roleName',
    label: t('user.roleName'),
    field: 'roleName',
    align: 'left',
    format: (val: string | undefined) => val || '-',
  },
  {
    name: 'departmentName',
    label: t('user.departmentName'),
    field: 'departmentName',
    align: 'left',
    format: (val: string | undefined) => val || '-',
  },
  {
    name: 'status',
    label: t('user.status'),
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: t('user.actions'),
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
.user-table {
  width: 100%;
}
</style>
