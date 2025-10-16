<template>
  <q-page padding>
    <div class="my-timesheet">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('timesheet.myTimesheets') }}</div>
      </div>

      <!-- 筛选栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
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
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                :label="$t('timesheet.filter.status')"
                emit-value
                map-options
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="label" />
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
              <q-btn
                color="positive"
                :label="$t('timesheet.create')"
                icon="add"
                class="q-ml-sm"
                v-permission="['button:timesheet:create']"
                @click="handleCreate"
              />
              <q-btn
                color="positive"
                :label="$t('timesheet.batchCreate')"
                icon="playlist_add"
                outline
                class="q-ml-sm"
                v-permission="['button:timesheet:batchCreate']"
                @click="handleBatchCreate"
              />
              <q-btn
                color="primary"
                :label="$t('timesheet.batchSubmit')"
                icon="send"
                class="q-ml-sm"
                v-if="selectedRows.length > 0"
                v-permission="['button:timesheet:batchSubmit']"
                @click="handleBatchSubmit"
              />
              <q-space />
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
          :selectable="true"
          :selected="selectedRows"
          action-type="manage"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
          @submit="handleSubmitConfirm"
          @withdraw="handleWithdrawConfirm"
          @view-detail="handleViewDetail"
          @selection-change="handleSelectionChange"
        />
      </q-card>

      <!-- 工时编辑对话框 -->
      <TimesheetDialog
        v-model="dialogVisible"
        :timesheet="currentTimesheet"
        :loading="saveLoading"
        @save="handleSave"
      />

      <!-- 批量新增工时对话框 -->
      <BatchTimesheetDialog
        v-model="batchDialogVisible"
        :loading="saveLoading"
        @save="handleBatchSave"
      />

      <!-- 工时详情对话框 -->
      <TimesheetDetailDialog v-model="detailDialogVisible" :timesheet="detailTimesheet" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { timesheetApi } from 'src/api/timesheet';
import { projectApi } from 'src/api/project';
import type {
  Timesheet,
  TimesheetQuery,
  CreateTimesheetDto,
  UpdateTimesheetDto,
  BatchCreateTimesheetDto,
} from 'src/types/timesheet';
import type { Project } from 'src/types/project';
import TimesheetTable from 'src/components/timesheet/TimesheetTable.vue';
import TimesheetDialog from 'src/components/timesheet/TimesheetDialog.vue';
import TimesheetDetailDialog from 'src/components/timesheet/TimesheetDetailDialog.vue';
import BatchTimesheetDialog from 'src/components/timesheet/BatchTimesheetDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 工时列表
const timesheets = ref<Timesheet[]>([]);

// 加载状态
const loading = ref(false);
const saveLoading = ref(false);
const loadingProjects = ref(false);

// 分页配置
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// 筛选条件
const filters = ref({
  projectCode: '',
  status: undefined as number | undefined,
  startDate: '',
  endDate: '',
});

// 项目列表
const projectOptions = ref<Project[]>([]);

// 状态选项
const statusOptions = computed(() => [
  { label: t('timesheet.statusOptions.all'), value: undefined },
  { label: t('timesheet.statusOptions.draft'), value: 1 },
  { label: t('timesheet.statusOptions.pendingReview'), value: 2 },
  { label: t('timesheet.statusOptions.approved'), value: 3 },
  { label: t('timesheet.statusOptions.rejected'), value: 4 },
]);

// 对话框状态
const dialogVisible = ref(false);
const batchDialogVisible = ref(false);
const detailDialogVisible = ref(false);

// 当前操作的工时
const currentTimesheet = ref<Timesheet | null>(null);
const detailTimesheet = ref<Timesheet | null>(null);

// 选中的行
const selectedRows = ref<Timesheet[]>([]);

// 加载我的项目列表
const loadMyProjects = async () => {
  loadingProjects.value = true;
  try {
    const response = await projectApi.getMyProjects();
    if (response.code === 200 && response.data) {
      projectOptions.value = response.data;
    }
  } catch (error) {
    console.error('Load projects error:', error);
  } finally {
    loadingProjects.value = false;
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

    const response = await timesheetApi.getMyTimesheets(query);

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

// 新建工时
const handleCreate = () => {
  currentTimesheet.value = null;
  dialogVisible.value = true;
};

// 批量新建工时
const handleBatchCreate = () => {
  batchDialogVisible.value = true;
};

// 批量保存工时
const handleBatchSave = async (data: BatchCreateTimesheetDto) => {
  saveLoading.value = true;
  try {
    const response = await timesheetApi.batchCreateTimesheets(data);
    if (response.code === 200 && response.data) {
      Notify.create({
        type: 'positive',
        message: t('timesheet.message.batchCreateSuccess', {
          success: response.data.successCount,
          failed: response.data.failedCount,
        }),
      });
      batchDialogVisible.value = false;
      void loadTimesheets();
    } else {
      Notify.create({
        type: 'negative',
        message: response.message || t('timesheet.message.batchCreateError'),
      });
    }
  } catch (error) {
    console.error('Batch create timesheet error:', error);
    Notify.create({
      type: 'negative',
      message: t('timesheet.message.batchCreateError'),
    });
  } finally {
    saveLoading.value = false;
  }
};

// 编辑工时
const handleEdit = (timesheet: Timesheet) => {
  if (timesheet.status !== 1) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.onlyDraftCanEdit'),
    });
    return;
  }
  currentTimesheet.value = { ...timesheet };
  dialogVisible.value = true;
};

// 保存工时
const handleSave = async (data: CreateTimesheetDto | UpdateTimesheetDto) => {
  saveLoading.value = true;
  try {
    if ('uuid' in data && data.uuid) {
      // 更新
      await timesheetApi.updateTimesheet(data);
      Notify.create({
        type: 'positive',
        message: t('timesheet.message.updateSuccess'),
      });
    } else {
      // 创建
      await timesheetApi.createTimesheet(data as CreateTimesheetDto);
      Notify.create({
        type: 'positive',
        message: t('timesheet.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadTimesheets();
  } catch (error) {
    console.error('Save timesheet error:', error);
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (timesheet: Timesheet) => {
  if (timesheet.status !== 1) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.onlyDraftCanDelete'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.message.deleteConfirm'),
    message: t('timesheet.message.deleteWarning'),
    ok: {
      label: t('timesheet.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(timesheet);
  });
};

// 删除工时
const handleDelete = async (timesheet: Timesheet) => {
  if (!timesheet.uuid) return;

  try {
    await timesheetApi.deleteTimesheet(timesheet.uuid);
    Notify.create({
      type: 'positive',
      message: t('timesheet.message.deleteSuccess'),
    });
    void loadTimesheets();
  } catch (error) {
    console.error('Delete timesheet error:', error);
  }
};

// 提交确认
const handleSubmitConfirm = (timesheet: Timesheet) => {
  if (timesheet.status !== 1) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.onlyDraftCanSubmit'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.submit'),
    message: t('timesheet.message.submitSuccess'),
    ok: {
      label: t('timesheet.submit'),
      color: 'primary',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleSubmit(timesheet);
  });
};

// 提交工时
const handleSubmit = async (timesheet: Timesheet) => {
  if (!timesheet.uuid) return;

  try {
    await timesheetApi.submitTimesheet(timesheet.uuid);
    Notify.create({
      type: 'positive',
      message: t('timesheet.message.submitSuccess'),
    });
    void loadTimesheets();
  } catch (error) {
    console.error('Submit timesheet error:', error);
  }
};

// 批量提交
const handleBatchSubmit = () => {
  const draftRows = selectedRows.value.filter((row) => row.status === 1);
  if (draftRows.length === 0) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.onlyDraftCanSubmit'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.batchSubmit'),
    message: `${t('timesheet.message.submitSuccess')} ${draftRows.length} ${t('timesheet.batch.items')}`,
    ok: {
      label: t('timesheet.submit'),
      color: 'primary',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void (async () => {
      try {
        const uuids = draftRows.map((row) => row.uuid).filter((uuid): uuid is string => !!uuid);
        await timesheetApi.batchSubmitTimesheets(uuids);
        Notify.create({
          type: 'positive',
          message: t('timesheet.message.batchSubmitSuccess'),
        });
        selectedRows.value = [];
        void loadTimesheets();
      } catch (error) {
        console.error('Batch submit error:', error);
      }
    })();
  });
};

// 撤回确认
const handleWithdrawConfirm = (timesheet: Timesheet) => {
  if (timesheet.status !== 2) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.onlyPendingCanWithdraw'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.withdraw'),
    ok: {
      label: t('timesheet.withdraw'),
      color: 'warning',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleWithdraw(timesheet);
  });
};

// 撤回工时
const handleWithdraw = async (timesheet: Timesheet) => {
  if (!timesheet.uuid) return;

  try {
    await timesheetApi.withdrawTimesheet(timesheet.uuid);
    Notify.create({
      type: 'positive',
      message: t('timesheet.message.withdrawSuccess'),
    });
    void loadTimesheets();
  } catch (error) {
    console.error('Withdraw timesheet error:', error);
  }
};

// 选择变化
const handleSelectionChange = (selected: Timesheet[]) => {
  console.log('[MyTimesheetPage] Received selection change:', {
    newCount: selected.length,
    oldCount: selectedRows.value.length,
    uuids: selected.map((s) => s.uuid),
  });
  selectedRows.value = selected;
  console.log('[MyTimesheetPage] After update:', selectedRows.value.length);
};

// 查看详情
const handleViewDetail = (timesheet: Timesheet) => {
  detailTimesheet.value = { ...timesheet };
  detailDialogVisible.value = true;
};

// 页面加载时获取数据
onMounted(() => {
  void loadMyProjects();
  void loadTimesheets();
});
</script>

<style scoped lang="scss">
.my-timesheet {
  width: 100%;
  margin: 0 auto;
}
</style>
