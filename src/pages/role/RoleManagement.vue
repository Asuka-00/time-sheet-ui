<template>
  <q-page padding>
    <div class="role-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('role.roleManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('role.placeholder.searchKey')"
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
                :label="$t('role.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('role.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn color="positive" :label="$t('role.create')" icon="add" @click="handleCreate" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 角色表格 -->
      <q-card flat bordered>
        <RoleTable
          :roles="roles"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
        />
      </q-card>

      <!-- 角色对话框 -->
      <RoleDialog
        v-model="dialogVisible"
        :role="currentRole"
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
import { roleApi } from 'src/api/role';
import type { Role, RoleQuery, RoleCreateDto, RoleUpdateDto } from 'src/types/role';
import RoleTable from 'src/components/role/RoleTable.vue';
import RoleDialog from 'src/components/role/RoleDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 角色列表
const roles = ref<Role[]>([]);

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

// 当前操作的角色
const currentRole = ref<Role | null>(null);

// 加载角色列表
const loadRoles = async () => {
  loading.value = true;
  try {
    const query: RoleQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await roleApi.getRoleList(query);

    if (response.code === 200 && response.data) {
      roles.value = response.data.records;
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
  void loadRoles();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadRoles();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadRoles();
};

// 新建角色
const handleCreate = () => {
  currentRole.value = null;
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (role: Role) => {
  currentRole.value = { ...role };
  dialogVisible.value = true;
};

// 保存角色
const handleSave = async (role: Role) => {
  saveLoading.value = true;
  try {
    if (role.uuid) {
      // 更新 - 构造 RoleUpdateDto
      const updateData: RoleUpdateDto = {
        uuid: role.uuid,
        name: role.name,
        description: role.description,
        permissionCodes: role.permissionCodes || [],
      };
      await roleApi.updateRole(updateData);
      Notify.create({
        type: 'positive',
        message: t('role.message.updateSuccess'),
      });
    } else {
      // 创建 - 构造 RoleCreateDto
      const createData: RoleCreateDto = {
        name: role.name,
        description: role.description,
        permissionCodes: role.permissionCodes || [],
      };
      await roleApi.createRole(createData);
      Notify.create({
        type: 'positive',
        message: t('role.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadRoles();
  } catch {
    // 错误已在拦截器中处理
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (role: Role) => {
  $q.dialog({
    title: t('role.message.deleteConfirm'),
    message: t('role.message.deleteWarning'),
    ok: {
      label: t('role.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('role.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(role);
  });
};

// 删除角色
const handleDelete = async (role: Role) => {
  if (!role.uuid) return;

  try {
    await roleApi.deleteRole(role.uuid);
    Notify.create({
      type: 'positive',
      message: t('role.message.deleteSuccess'),
    });
    void loadRoles();
  } catch {
    // 错误已在拦截器中处理
  }
};

// 页面加载时获取角色列表
onMounted(() => {
  void loadRoles();
});
</script>

<style scoped lang="scss">
.role-management {
  width: 100%;
  margin: 0 auto;
}
</style>
