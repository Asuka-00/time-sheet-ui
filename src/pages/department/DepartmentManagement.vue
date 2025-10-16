<template>
  <q-page padding>
    <div class="department-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('department.departmentManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('department.placeholder.searchKey')"
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
                :label="$t('department.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('department.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn
                color="positive"
                v-permission="['button:department:create']"
                :label="$t('department.create')"
                icon="add"
                @click="handleCreate"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 部门表格 -->
      <q-card flat bordered>
        <DepartmentTable
          :departments="departments"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
        />
      </q-card>

      <!-- 部门对话框 -->
      <DepartmentDialog
        v-model="dialogVisible"
        :department="currentDepartment"
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
import { departmentApi } from 'src/api/department';
import type {
  Department,
  DepartmentQuery,
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from 'src/types/department';
import DepartmentTable from 'src/components/department/DepartmentTable.vue';
import DepartmentDialog from 'src/components/department/DepartmentDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 部门列表
const departments = ref<Department[]>([]);

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

// 当前操作的部门
const currentDepartment = ref<Department | null>(null);

// 加载部门列表
const loadDepartments = async () => {
  loading.value = true;
  try {
    const query: DepartmentQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await departmentApi.getDepartmentList(query);

    if (response.code === 200 && response.data) {
      departments.value = response.data.records;
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
  void loadDepartments();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadDepartments();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadDepartments();
};

// 新建部门
const handleCreate = () => {
  currentDepartment.value = null;
  dialogVisible.value = true;
};

// 编辑部门
const handleEdit = (department: Department) => {
  currentDepartment.value = { ...department };
  dialogVisible.value = true;
};

// 保存部门
const handleSave = async (department: Department) => {
  saveLoading.value = true;
  try {
    if (department.uuid) {
      // 更新 - 构造 DepartmentUpdateDto
      const updateData: DepartmentUpdateDto = {
        uuid: department.uuid,
        name: department.name,
        description: department.description,
        status: department.status,
        ...(department.parentDepartmentName && {
          parentDepartmentName: department.parentDepartmentName,
        }),
      };
      await departmentApi.updateDepartment(updateData);
      Notify.create({
        type: 'positive',
        message: t('department.message.updateSuccess'),
      });
    } else {
      // 创建 - 构造 DepartmentCreateDto
      const createData: DepartmentCreateDto = {
        name: department.name,
        description: department.description,
        status: department.status,
        ...(department.parentDepartmentName && {
          parentDepartmentName: department.parentDepartmentName,
        }),
      };
      await departmentApi.createDepartment(createData);
      Notify.create({
        type: 'positive',
        message: t('department.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadDepartments();
  } catch {
    // 错误已在拦截器中处理
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (department: Department) => {
  $q.dialog({
    title: t('department.message.deleteTitle'),
    message: t('department.message.deleteConfirm'),
    ok: {
      label: t('department.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('department.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(department);
  });
};

// 删除部门
const handleDelete = async (department: Department) => {
  if (!department.uuid) return;

  try {
    await departmentApi.deleteDepartment(department.uuid);
    Notify.create({
      type: 'positive',
      message: t('department.message.deleteSuccess'),
    });
    void loadDepartments();
  } catch {
    // 错误已在拦截器中处理
  }
};

// 页面加载时获取部门列表
onMounted(() => {
  void loadDepartments();
});
</script>

<style scoped lang="scss">
.department-management {
  width: 100%;
  margin: 0 auto;
}
</style>
