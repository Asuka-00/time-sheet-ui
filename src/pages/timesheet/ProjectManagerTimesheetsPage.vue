<template>
  <q-page padding>
    <div class="project-manager-timesheets">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('timesheet.projectManagerTimesheets') }}</div>
        <q-space />
        <q-chip
          v-if="pagination.rowsNumber > 0"
          color="primary"
          text-color="white"
          icon="assignment"
        >
          {{ $t('timesheet.statistics.totalRecords') }}: {{ pagination.rowsNumber }}
        </q-chip>
      </div>

      <!-- 筛选栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.userCode"
                :options="userOptions"
                :label="$t('timesheet.filter.user')"
                option-value="userCode"
                option-label="userName"
                emit-value
                map-options
                outlined
                dense
                clearable
                :loading="loadingUsers"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.projectCode"
                :options="projectOptions"
                :label="$t('timesheet.filter.project')"
                option-value="projectCode"
                option-label="projectName"
                emit-value
                map-options
                outlined
                dense
                clearable
                :loading="loadingProjects"
              >
                <template #prepend>
                  <q-icon name="folder" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                :label="$t('timesheet.filter.status')"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="info" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-2">
              <q-input
                v-model="filters.startDate"
                :label="$t('timesheet.placeholder.startDate')"
                outlined
                dense
              >
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filters.startDate" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-input
                v-model="filters.endDate"
                :label="$t('timesheet.placeholder.endDate')"
                outlined
                dense
              >
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filters.endDate" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                :label="$t('timesheet.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('timesheet.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 工时表格 -->
      <q-card flat bordered>
        <TimesheetTable
          :timesheets="timesheets"
          :loading="loading"
          :pagination="pagination"
          :selectable="false"
          action-type="view"
          @request="handleTableRequest"
          @view-detail="handleViewDetail"
        />
      </q-card>

      <!-- 工时详情对话框 -->
      <TimesheetDetailDialog
        v-model="detailDialogVisible"
        :timesheet="detailTimesheet"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import type { QTableProps } from 'quasar';
import { timesheetApi } from 'src/api/timesheet';
import { projectApi } from 'src/api/project';
import { userApi } from 'src/api/user';
import type {
  Timesheet,
  TimesheetQuery,
} from 'src/types/timesheet';
import type { Project } from 'src/types/project';
import type { User } from 'src/types/user';
import { TimesheetStatus } from 'src/types/timesheet';
import TimesheetTable from 'src/components/timesheet/TimesheetTable.vue';
import TimesheetDetailDialog from 'src/components/timesheet/TimesheetDetailDialog.vue';

const { t } = useI18n();

// 工时列表
const timesheets = ref<Timesheet[]>([]);

// 加载状态
const loading = ref(false);
const loadingProjects = ref(false);
const loadingUsers = ref(false);

// 分页配置
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// 筛选条件
const filters = ref({
  userCode: '',
  projectCode: '',
  status: undefined as number | undefined,
  startDate: '',
  endDate: '',
});

// 项目列表
const projectOptions = ref<Project[]>([]);

// 用户列表
const userOptions = ref<User[]>([]);

// 状态选项
const statusOptions = computed(() => [
  { value: undefined, label: t('timesheet.statusOptions.all') },
  { value: TimesheetStatus.DRAFT, label: t('timesheet.statusOptions.draft') },
  { value: TimesheetStatus.PENDING_REVIEW, label: t('timesheet.statusOptions.pendingReview') },
  { value: TimesheetStatus.APPROVED, label: t('timesheet.statusOptions.approved') },
  { value: TimesheetStatus.REJECTED, label: t('timesheet.statusOptions.rejected') },
]);

// 对话框状态
const detailDialogVisible = ref(false);

// 当前查看的工时
const detailTimesheet = ref<Timesheet | null>(null);

// 加载项目列表
const loadProjects = async () => {
  loadingProjects.value = true;
  try {
    const response = await projectApi.getProject();
    if (response.code === 200 && response.data) {
      projectOptions.value = response.data;
    }
  } catch (error) {
    console.error('Load projects error:', error);
  } finally {
    loadingProjects.value = false;
  }
};

// 加载用户列表
const loadUsers = async () => {
  loadingUsers.value = true;
  try {
    const response = await userApi.getUserList({ current: 1, size: 1000 });
    if (response.code === 200 && response.data) {
      userOptions.value = response.data.records;
    }
  } catch (error) {
    console.error('Load users error:', error);
  } finally {
    loadingUsers.value = false;
  }
};

// 加载工时列表
const loadTimesheets = async () => {
  loading.value = true;
  try {
    const query: TimesheetQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (filters.value.userCode) {
      query.userCode = filters.value.userCode;
    }
    if (filters.value.projectCode) {
      query.projectCode = filters.value.projectCode;
    }
    if (filters.value.status !== undefined) {
      query.status = filters.value.status;
    }
    if (filters.value.startDate) {
      query.startDate = filters.value.startDate;
    }
    if (filters.value.endDate) {
      query.endDate = filters.value.endDate;
    }

    const response = await timesheetApi.getProjectManagerTimesheets(query);

    if (response.code === 200 && response.data) {
      timesheets.value = response.data.records;
      pagination.value.rowsNumber = response.data.total;
    } else {
      Notify.create({
        type: 'negative',
        message: response.message,
      });
    }
  } catch (error) {
    console.error('Load timesheets error:', error);
    Notify.create({
      type: 'negative',
      message: t('timesheet.message.loading'),
    });
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  void loadTimesheets();
};

// 重置
const handleReset = () => {
  filters.value = {
    userCode: '',
    projectCode: '',
    status: undefined,
    startDate: '',
    endDate: '',
  };
  pagination.value.page = 1;
  void loadTimesheets();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadTimesheets();
};

// 查看详情
const handleViewDetail = (timesheet: Timesheet) => {
  detailTimesheet.value = { ...timesheet };
  detailDialogVisible.value = true;
};

// 页面加载时获取数据
onMounted(() => {
  void loadProjects();
  void loadUsers();
  void loadTimesheets();
});
</script>

<style scoped lang="scss">
.project-manager-timesheets {
  width: 100%;
  margin: 0 auto;
}
</style>

