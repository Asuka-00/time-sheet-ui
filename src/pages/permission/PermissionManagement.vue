<template>
  <q-page padding>
    <div class="permission-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('permission.permissionManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('permission.placeholder.searchKey')"
                outlined
                dense
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                :label="$t('permission.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('permission.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn color="positive" :label="$t('permission.create')" icon="add" @click="handleCreate" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 权限表格 -->
      <q-card flat bordered>
        <PermissionTable
          :permissions="permissions"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
        />
      </q-card>

      <!-- 权限对话框 -->
      <PermissionDialog
        v-model="dialogVisible"
        :permission="currentPermission"
        :loading="saveLoading"
        @save="handleSave"
      />

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { permissionApi } from 'src/api/permission';
import type { Permission, PermissionQuery } from 'src/types/permission';
import { omitFields } from 'src/utils/data-helper';
import PermissionTable from 'src/components/permission/PermissionTable.vue';
import PermissionDialog from 'src/components/permission/PermissionDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 权限列表
const permissions = ref<Permission[]>([]);

// 加载状态
const loading = ref(false);
const saveLoading = ref(false);

// 分页配置
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// 对话框状态
const dialogVisible = ref(false);

// 当前操作的权限
const currentPermission = ref<Permission | null>(null);

// 加载权限列表
const loadPermissions = async () => {
  loading.value = true;
  try {
    const query: PermissionQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await permissionApi.getPermissionList(query);

    if (response.code === 200 && response.data) {
      permissions.value = response.data.records;
      pagination.value.rowsNumber = response.data.total;
    } else {
      Notify.create({
        type: 'negative',
        message: response.message,
      });
    }
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  void loadPermissions();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadPermissions();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadPermissions();
};

// 新建权限
const handleCreate = () => {
  currentPermission.value = null;
  dialogVisible.value = true;
};

// 编辑权限
const handleEdit = (permission: Permission) => {
  currentPermission.value = { ...permission };
  dialogVisible.value = true;
};

// 保存权限
const handleSave = async (permission: Permission) => {
  saveLoading.value = true;
  try {
    if (permission.uuid) {
      // 更新 - 排除审计字段和children
      await permissionApi.updatePermission(omitFields(permission, ['children']));
      Notify.create({
        type: 'positive',
        message: t('permission.message.updateSuccess'),
      });
    } else {
      // 创建 - 排除审计字段、uuid和children
      const { uuid, ...createData } = omitFields(permission, ['children']);
      void uuid; // 显式标记已处理
      await permissionApi.createPermission(createData);
      Notify.create({
        type: 'positive',
        message: t('permission.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadPermissions();
  } catch {
    // 错误已在拦截器中处理
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (permission: Permission) => {
  $q.dialog({
    title: t('permission.message.deleteConfirm'),
    message: t('permission.message.deleteWarning'),
    ok: {
      label: t('permission.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('permission.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(permission);
  });
};

// 删除权限
const handleDelete = async (permission: Permission) => {
  if (!permission.uuid) return;

  try {
    await permissionApi.deletePermission(permission.uuid);
    Notify.create({
      type: 'positive',
      message: t('permission.message.deleteSuccess'),
    });
    void loadPermissions();
  } catch {
    // 错误已在拦截器中处理
  }
};

// 页面加载时获取权限列表
onMounted(() => {
  void loadPermissions();
});
</script>

<style scoped lang="scss">
.permission-management {
  width: 100%;
  margin: 0 auto;
}
</style>
