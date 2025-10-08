<template>
  <q-page padding>
    <div class="timesheet-review">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('timesheet.timesheetReview') }}</div>
        <q-space />
        <q-chip
          v-if="pagination.rowsNumber > 0"
          color="warning"
          text-color="white"
          icon="pending"
        >
          {{ $t('timesheet.review.pendingCount') }}: {{ pagination.rowsNumber }}
        </q-chip>
      </div>

      <!-- 筛选栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-3">
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

      <!-- 批量操作栏 -->
      <q-card v-if="selectedRows.length > 0" flat bordered class="q-mb-md">
        <q-card-section class="row items-center">
          <q-btn
            color="positive"
            :label="$t('timesheet.batchApprove')"
            icon="check"
            @click="handleBatchApprove"
          />
          <q-btn
            color="negative"
            :label="$t('timesheet.batchReject')"
            icon="close"
            class="q-ml-sm"
            @click="handleBatchReject"
          />
          <q-space />
          <div class="text-caption text-grey">
            {{ $t('timesheet.batch.selected') }} {{ selectedRows.length }} {{ $t('timesheet.batch.items') }}
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
          action-type="review"
          @request="handleTableRequest"
          @review="handleReview"
          @view-detail="handleViewDetail"
          @selection-change="handleSelectionChange"
        />
      </q-card>

      <!-- 审核对话框 -->
      <TimesheetReviewDialog
        v-model="reviewDialogVisible"
        :timesheet="currentTimesheet"
        :action="reviewAction"
        :loading="reviewLoading"
        @confirm="handleReviewConfirm"
      />

      <!-- 工时详情对话框 -->
      <TimesheetDetailDialog
        v-model="detailDialogVisible"
        :timesheet="detailTimesheet"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { timesheetApi } from 'src/api/timesheet';
import { projectApi } from 'src/api/project';
import type {
  Timesheet,
  TimesheetQuery,
  ReviewTimesheetDto,
} from 'src/types/timesheet';
import type { Project } from 'src/types/project';
import { TimesheetStatus } from 'src/types/timesheet';
import TimesheetTable from 'src/components/timesheet/TimesheetTable.vue';
import TimesheetReviewDialog from 'src/components/timesheet/TimesheetReviewDialog.vue';
import TimesheetDetailDialog from 'src/components/timesheet/TimesheetDetailDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 工时列表
const timesheets = ref<Timesheet[]>([]);

// 加载状态
const loading = ref(false);
const reviewLoading = ref(false);
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
  startDate: '',
  endDate: '',
});

// 项目列表
const projectOptions = ref<Project[]>([]);

// 对话框状态
const reviewDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const reviewAction = ref<'approve' | 'reject'>('approve');

// 当前操作的工时
const currentTimesheet = ref<Timesheet | null>(null);
const detailTimesheet = ref<Timesheet | null>(null);

// 选中的行
const selectedRows = ref<Timesheet[]>([]);

// 加载项目列表（我作为经理的项目）
const loadManagedProjects = async () => {
  loadingProjects.value = true;
  try {
    const response = await projectApi.getProject();
    if (response.code === 200 && response.data) {
      // 这里应该过滤出当前用户作为项目经理的项目
      // 后端getProject()会返回所有项目，前端过滤或者后端提供专门的接口
      projectOptions.value = response.data;
    }
  } catch (error) {
    console.error('Load projects error:', error);
  } finally {
    loadingProjects.value = false;
  }
};

// 加载待审核工时列表
const loadPendingTimesheets = async () => {
  loading.value = true;
  try {
    const query: TimesheetQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (filters.value.projectCode) {
      query.projectCode = filters.value.projectCode;
    }
    if (filters.value.startDate) {
      query.startDate = filters.value.startDate;
    }
    if (filters.value.endDate) {
      query.endDate = filters.value.endDate;
    }

    const response = await timesheetApi.getPendingReviewTimesheets(query);

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
    console.error('Load pending timesheets error:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  void loadPendingTimesheets();
};

// 重置
const handleReset = () => {
  filters.value = {
    projectCode: '',
    startDate: '',
    endDate: '',
  };
  pagination.value.page = 1;
  void loadPendingTimesheets();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadPendingTimesheets();
};

// 审核工时
const handleReview = (data: { timesheet: Timesheet; action: 'approve' | 'reject' }) => {
  currentTimesheet.value = data.timesheet;
  reviewAction.value = data.action;
  reviewDialogVisible.value = true;
};

// 确认审核
const handleReviewConfirm = async (data: { uuid: string; action: 'approve' | 'reject'; comment?: string }) => {
  reviewLoading.value = true;
  try {
    const reviewData: ReviewTimesheetDto = {
      uuid: data.uuid,
      status: data.action === 'approve' ? TimesheetStatus.APPROVED : TimesheetStatus.REJECTED,
      ...(data.comment && { reviewComment: data.comment }),
    };

    await timesheetApi.reviewTimesheet(reviewData);
    Notify.create({
      type: 'positive',
      message: t('timesheet.message.reviewSuccess'),
    });

    reviewDialogVisible.value = false;
    void loadPendingTimesheets();
  } catch (error) {
    console.error('Review timesheet error:', error);
  } finally {
    reviewLoading.value = false;
  }
};

// 批量通过
const handleBatchApprove = () => {
  if (selectedRows.value.length === 0) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.selectAtLeastOne'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.batchApprove'),
    message: t('timesheet.review.batchApproveMessage', { count: selectedRows.value.length }),
    ok: {
      label: t('timesheet.approve'),
      color: 'positive',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void (async () => {
      try {
        const reviews: ReviewTimesheetDto[] = selectedRows.value.map((row) => ({
          uuid: row.uuid!,
          status: TimesheetStatus.APPROVED,
        }));

        await timesheetApi.batchReviewTimesheets({ reviews });
        Notify.create({
          type: 'positive',
          message: t('timesheet.message.reviewSuccess'),
        });
        selectedRows.value = [];
        void loadPendingTimesheets();
      } catch (error) {
        console.error('Batch approve error:', error);
      }
    })();
  });
};

// 批量驳回
const handleBatchReject = () => {
  if (selectedRows.value.length === 0) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.message.selectAtLeastOne'),
    });
    return;
  }

  $q.dialog({
    title: t('timesheet.batchReject'),
    message: t('timesheet.review.batchRejectMessage', { count: selectedRows.value.length }),
    prompt: {
      model: '',
      type: 'text',
      label: t('timesheet.reviewComment'),
      outlined: true,
    },
    ok: {
      label: t('timesheet.reject'),
      color: 'negative',
    },
    cancel: {
      label: t('timesheet.cancel'),
      flat: true,
    },
  }).onOk((comment: string) => {
    void (async () => {
      try {
        const reviews: ReviewTimesheetDto[] = selectedRows.value.map((row) => {
          const review: ReviewTimesheetDto = {
            uuid: row.uuid!,
            status: TimesheetStatus.REJECTED,
          };
          if (comment) {
            review.reviewComment = comment;
          }
          return review;
        });

        await timesheetApi.batchReviewTimesheets({ reviews });
        Notify.create({
          type: 'positive',
          message: t('timesheet.message.reviewSuccess'),
        });
        selectedRows.value = [];
        void loadPendingTimesheets();
      } catch (error) {
        console.error('Batch reject error:', error);
      }
    })();
  });
};

// 选择变化
const handleSelectionChange = (selected: Timesheet[]) => {
  selectedRows.value = selected;
};

// 查看详情
const handleViewDetail = (timesheet: Timesheet) => {
  detailTimesheet.value = { ...timesheet };
  detailDialogVisible.value = true;
};

// 页面加载时获取数据
onMounted(() => {
  void loadManagedProjects();
  void loadPendingTimesheets();
});
</script>

<style scoped lang="scss">
.timesheet-review {
  width: 100%;
  margin: 0 auto;
}
</style>
