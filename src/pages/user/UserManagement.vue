<template>
  <q-page padding>
    <div class="user-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('user.userManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('user.placeholder.searchKey')"
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
                :label="$t('user.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('user.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn color="positive" :label="$t('user.create')" icon="add" @click="handleCreate" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 用户表格 -->
      <q-card flat bordered>
        <UserTable
          :users="users"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
          @reset-password="handleResetPasswordConfirm"
        />
      </q-card>

      <!-- 用户对话框 -->
      <UserDialog
        v-model="dialogVisible"
        :user="currentUser"
        :loading="saveLoading"
        @save="handleSave"
      />

      <!-- 重置密码对话框 -->
      <ResetPasswordDialog
        v-model="resetPasswordDialogVisible"
        :user="resetPasswordUser"
        :loading="resetPasswordLoading"
        @save="handleResetPasswordSave"
      />

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { userApi } from 'src/api/user';
import type { User, UserQuery } from 'src/types/user';
import { omitAuditFields, omitFields } from 'src/utils/data-helper';
import UserTable from 'src/components/user/UserTable.vue';
import UserDialog from 'src/components/user/UserDialog.vue';
import ResetPasswordDialog from 'src/components/user/ResetPasswordDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 用户列表
const users = ref<User[]>([]);

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

// 当前操作的用户
const currentUser = ref<User | null>(null);

// 重置密码对话框状态
const resetPasswordDialogVisible = ref(false);

// 当前要重置密码的用户
const resetPasswordUser = ref<User | null>(null);

// 重置密码加载状态
const resetPasswordLoading = ref(false);

// 加载用户列表
const loadUsers = async () => {
  loading.value = true;
  try {
    const query: UserQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await userApi.getUserList(query);

    if (response.code === 200 && response.data) {
      users.value = response.data.records;
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
  void loadUsers();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadUsers();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadUsers();
};

// 新建用户
const handleCreate = () => {
  currentUser.value = null;
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (user: User) => {
  currentUser.value = { ...user };
  dialogVisible.value = true;
};

// 保存用户
const handleSave = async (user: User) => {
  saveLoading.value = true;
  try {
    if (user.uuid) {
      // 更新 - 排除审计字段和密码
      await userApi.updateUser(omitFields(user, ['password']));
      Notify.create({
        type: 'positive',
        message: t('user.message.updateSuccess'),
      });
    } else {
      // 创建 - 排除审计字段和uuid
      const { uuid, ...createData } = omitAuditFields(user);
      void uuid; // 显式标记已处理
      await userApi.createUser(createData);
      Notify.create({
        type: 'positive',
        message: t('user.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadUsers();
  } catch {
    // 错误已在拦截器中处理
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (user: User) => {
  $q.dialog({
    title: t('user.message.deleteConfirm'),
    message: t('user.message.deleteWarning'),
    ok: {
      label: t('user.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('user.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(user);
  });
};

// 删除用户
const handleDelete = async (user: User) => {
  if (!user.uuid) return;

  try {
    await userApi.deleteUser(user.uuid);
    Notify.create({
      type: 'positive',
      message: t('user.message.deleteSuccess'),
    });
    void loadUsers();
  } catch {
    // 错误已在拦截器中处理
  }
};

// 重置密码确认
const handleResetPasswordConfirm = (user: User) => {
  $q.dialog({
    title: t('user.formTitle.resetPassword'),
    message: t('user.message.resetPasswordConfirm'),
    ok: {
      label: t('user.confirm'),
      color: 'primary',
    },
    cancel: {
      label: t('user.cancel'),
      flat: true,
    },
  }).onOk(() => {
    resetPasswordUser.value = { ...user };
    resetPasswordDialogVisible.value = true;
  });
};

// 重置密码保存
const handleResetPasswordSave = async (uuid: string, newPassword: string) => {
  resetPasswordLoading.value = true;
  try {
    await userApi.resetPassword(uuid, newPassword);
    Notify.create({
      type: 'positive',
      message: t('user.message.resetPasswordSuccess'),
    });
    resetPasswordDialogVisible.value = false;
  } catch {
    // 错误已在拦截器中处理
  } finally {
    resetPasswordLoading.value = false;
  }
};

// 页面加载时获取用户列表
onMounted(() => {
  void loadUsers();
});
</script>

<style scoped lang="scss">
.user-management {
  width: 100%;
  margin: 0 auto;
}
</style>
