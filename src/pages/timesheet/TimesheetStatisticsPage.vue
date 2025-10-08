<template>
  <q-page padding>
    <div class="timesheet-statistics">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('timesheet.timesheetStatistics') }}</div>
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
                :loading="loading"
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

      <!-- 统计卡片 -->
      <div class="row q-gutter-md q-mb-md">
        <div class="col">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <div class="text-h6 text-primary">{{ statistics.totalHours }}</div>
              <div class="text-caption text-grey">{{ $t('timesheet.statistics.totalHours') }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <div class="text-h6 text-positive">{{ statistics.totalRecords }}</div>
              <div class="text-caption text-grey">{{ $t('timesheet.statistics.totalRecords') }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <div class="text-h6 text-info">{{ approvalRate }}%</div>
              <div class="text-caption text-grey">{{ $t('timesheet.statistics.approvalRate') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 按状态统计 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">{{ $t('timesheet.statistics.byStatus') }}</div>
          <div class="row q-gutter-md">
            <div class="col">
              <q-linear-progress
                :value="statusPercentage.draft"
                color="grey"
                size="20px"
                class="q-mb-xs"
              />
              <div class="text-caption">
                {{ $t('timesheet.statusOptions.draft') }}: {{ statistics.statusStats.draft }}
              </div>
            </div>
            <div class="col">
              <q-linear-progress
                :value="statusPercentage.pending"
                color="warning"
                size="20px"
                class="q-mb-xs"
              />
              <div class="text-caption">
                {{ $t('timesheet.statusOptions.pendingReview') }}: {{ statistics.statusStats.pending }}
              </div>
            </div>
            <div class="col">
              <q-linear-progress
                :value="statusPercentage.approved"
                color="positive"
                size="20px"
                class="q-mb-xs"
              />
              <div class="text-caption">
                {{ $t('timesheet.statusOptions.approved') }}: {{ statistics.statusStats.approved }}
              </div>
            </div>
            <div class="col">
              <q-linear-progress
                :value="statusPercentage.rejected"
                color="negative"
                size="20px"
                class="q-mb-xs"
              />
              <div class="text-caption">
                {{ $t('timesheet.statusOptions.rejected') }}: {{ statistics.statusStats.rejected }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 按项目统计 -->
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md">{{ $t('timesheet.statistics.byProject') }}</div>
          <q-table
            :rows="projectStatsRows"
            :columns="projectStatsColumns"
            :loading="loading"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
            hide-pagination
          >
            <template #body-cell-percentage="props">
              <q-td :props="props">
                <q-linear-progress
                  :value="props.row.percentage / 100"
                  color="primary"
                  size="20px"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" :label="`${props.row.percentage}%`" />
                  </div>
                </q-linear-progress>
              </q-td>
            </template>

            <template #no-data>
              <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
                <q-icon name="info" size="2em" />
                <span>{{ $t('timesheet.message.noData') }}</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import type { QTableProps } from 'quasar';
import { timesheetApi } from 'src/api/timesheet';
import { projectApi } from 'src/api/project';
import type {
  TimesheetStatistics,
  TimesheetStatisticsQuery,
} from 'src/types/timesheet';
import type { Project } from 'src/types/project';

const { t } = useI18n();

// 加载状态
const loading = ref(false);
const loadingProjects = ref(false);

// 筛选条件
const filters = ref<TimesheetStatisticsQuery>({
  projectCode: '',
  startDate: '',
  endDate: '',
});

// 项目列表
const projectOptions = ref<Project[]>([]);

// 统计数据
const statistics = ref<TimesheetStatistics>({
  totalHours: 0,
  totalRecords: 0,
  projectStats: {},
  statusStats: {
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
});

// 通过率
const approvalRate = computed(() => {
  const total = statistics.value.statusStats.approved + statistics.value.statusStats.rejected;
  if (total === 0) return 0;
  return Math.round((statistics.value.statusStats.approved / total) * 100);
});

// 状态百分比
const statusPercentage = computed(() => {
  const total =
    statistics.value.statusStats.draft +
    statistics.value.statusStats.pending +
    statistics.value.statusStats.approved +
    statistics.value.statusStats.rejected;

  if (total === 0) {
    return { draft: 0, pending: 0, approved: 0, rejected: 0 };
  }

  return {
    draft: statistics.value.statusStats.draft / total,
    pending: statistics.value.statusStats.pending / total,
    approved: statistics.value.statusStats.approved / total,
    rejected: statistics.value.statusStats.rejected / total,
  };
});

// 项目统计表格数据
const projectStatsRows = computed(() => {
  const rows = Object.entries(statistics.value.projectStats).map(([projectCode, hours]) => {
    const project = projectOptions.value.find((p) => p.projectCode === projectCode);
    const percentage = statistics.value.totalHours > 0 
      ? Math.round((hours / statistics.value.totalHours) * 100)
      : 0;
    
    return {
      projectCode,
      projectName: project?.projectName || projectCode,
      hours,
      percentage,
    };
  });

  // 按工时数降序排序
  return rows.sort((a, b) => b.hours - a.hours);
});

// 项目统计表格列
const projectStatsColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'projectName',
    label: t('timesheet.statistics.projectName'),
    field: 'projectName',
    align: 'left',
  },
  {
    name: 'hours',
    label: t('timesheet.statistics.hoursCount'),
    field: 'hours',
    align: 'center',
  },
  {
    name: 'percentage',
    label: t('timesheet.statistics.percentage'),
    field: 'percentage',
    align: 'center',
  },
]);

// 加载项目列表
const loadProjects = async () => {
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

// 加载统计数据
const loadStatistics = async () => {
  loading.value = true;
  try {
    const params: TimesheetStatisticsQuery = {};

    if (filters.value.projectCode) {
      params.projectCode = filters.value.projectCode;
    }
    if (filters.value.startDate) {
      params.startDate = filters.value.startDate;
    }
    if (filters.value.endDate) {
      params.endDate = filters.value.endDate;
    }

    const response = await timesheetApi.getTimesheetStatistics(params);

    if (response.code === 200 && response.data) {
      statistics.value = response.data;
    } else {
      Notify.create({
        type: 'negative',
        message: response.message,
      });
    }
  } catch (error) {
    console.error('Load statistics error:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  void loadStatistics();
};

// 重置
const handleReset = () => {
  filters.value = {
    projectCode: '',
    startDate: '',
    endDate: '',
  };
  void loadStatistics();
};

// 页面加载时获取数据
onMounted(() => {
  void loadProjects();
  void loadStatistics();
});
</script>

<style scoped lang="scss">
.timesheet-statistics {
  width: 100%;
  margin: 0 auto;
}
</style>
