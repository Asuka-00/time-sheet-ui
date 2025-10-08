<template>
  <q-page class="dashboard-page">
    <!-- 欢迎区域 -->
    <section class="welcome-section q-mb-sm">
      <div class="row items-center justify-between">
        <div>
          <h5 class="q-ma-none text-h5 text-weight-medium">
            {{ $t('dashboard.welcomeBack') }}, {{ authStore.userInfo?.userName }}
          </h5>
          <p class="q-ma-none q-mt-xs text-grey-7">{{ $t('dashboard.today') }} {{ currentDate }}</p>
        </div>
      </div>
    </section>

    <!-- 项目概览区域 -->
    <section class="projects-section q-mb-sm">
      <div class="row q-col-gutter-md">
        <!-- 我管理的项目 -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="bg-primary text-white">
              <div class="row items-center">
                <q-icon name="admin_panel_settings" size="24px" class="q-mr-sm" />
                <div class="text-h6">{{ $t('dashboard.myManagedProjects') }}</div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section v-if="loadingProjects" class="text-center q-py-xl">
              <q-spinner color="primary" size="50px" />
              <div class="q-mt-md text-grey-7">{{ $t('dashboard.message.loadingProjects') }}</div>
            </q-card-section>
            <q-card-section v-else-if="managedProjects.length > 0" class="q-pa-md project-list-container">
              <project-card
                v-for="project in managedProjects"
                :key="project.uuid || project.projectCode"
                :project="project"
                :is-manager="true"
              />
            </q-card-section>
            <q-card-section v-else class="text-center q-py-xl">
              <q-icon name="folder_off" size="64px" color="grey-5" />
              <div class="q-mt-md text-grey-7">{{ $t('dashboard.noManagedProjects') }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 我参与的项目 -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="bg-secondary text-white">
              <div class="row items-center">
                <q-icon name="groups" size="24px" class="q-mr-sm" />
                <div class="text-h6">{{ $t('dashboard.myParticipatedProjects') }}</div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section v-if="loadingProjects" class="text-center q-py-xl">
              <q-spinner color="secondary" size="50px" />
              <div class="q-mt-md text-grey-7">{{ $t('dashboard.message.loadingProjects') }}</div>
            </q-card-section>
            <q-card-section v-else-if="participatedProjects.length > 0" class="q-pa-md project-list-container">
              <project-card
                v-for="project in participatedProjects"
                :key="project.uuid || project.projectCode"
                :project="project"
                :is-manager="false"
              />
            </q-card-section>
            <q-card-section v-else class="text-center q-py-xl">
              <q-icon name="folder_off" size="64px" color="grey-5" />
              <div class="q-mt-md text-grey-7">{{ $t('dashboard.noParticipatedProjects') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- 待审核工时统计区域 -->
    <section v-if="notificationStore.pendingReviewCount > 0" class="statistics-section q-mb-sm">
      <q-card flat bordered class="pending-review-banner cursor-pointer" @click="goToReviewPage">
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-md">
              <q-icon name="pending_actions" size="48px" color="warning" />
              <div>
                <div class="text-h6 text-weight-medium">
                  {{ $t('dashboard.statistics.pendingReview') }}
                </div>
                <div class="text-body2 text-grey-7">
                  {{ $t('dashboard.pendingReviewDescription') }}
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-h3 text-weight-bold text-warning">
                {{ notificationStore.pendingReviewCount }}
              </div>
              <div class="text-caption text-grey-6">
                {{ $t('dashboard.clickToView') }}
              </div>
            </div>
            <q-icon name="chevron_right" size="32px" color="grey-5" />
          </div>
        </q-card-section>
      </q-card>
    </section>

    <!-- 工时日历区域 -->
    <section class="calendar-section">
      <q-card flat bordered>
        <q-card-section class="bg-gradient text-white">
          <div class="row items-center">
            <q-icon name="event" size="24px" class="q-mr-sm" />
            <div class="text-h6">{{ $t('dashboard.timesheetCalendar') }}</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="loadingTimesheets" class="text-center q-py-xl">
          <q-spinner color="primary" size="50px" />
          <div class="q-mt-md text-grey-7">{{ $t('dashboard.message.loadingTimesheets') }}</div>
        </q-card-section>
        <q-card-section v-else class="q-pa-md">
          <work-calendar
            :timesheets="timesheets"
            :selected-date="selectedDate"
            :year="currentYear"
            :month="currentMonth"
            @date-click="handleDateClick"
            @month-change="handleMonthChange"
          />
        </q-card-section>
      </q-card>
    </section>

    <!-- 工时快速操作对话框 -->
    <quick-timesheet-dialog
      v-model="showTimesheetDialog"
      :date="selectedDate"
      :timesheets="selectedDateTimesheets"
      @refresh="loadTimesheets"
    />

    <!-- 快速新建工时对话框 -->
    <timesheet-dialog v-model="showCreateDialog" :timesheet="null" @saved="handleTimesheetSaved" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useNotificationStore } from 'src/stores/notification';
import type { Project } from 'src/types/project';
import type { Timesheet } from 'src/types/timesheet';
import { projectApi } from 'src/api/project';
import { timesheetApi } from 'src/api/timesheet';
import { formatDate } from 'src/utils/date-formatter';
import ProjectCard from 'src/components/dashboard/ProjectCard.vue';
import WorkCalendar from 'src/components/dashboard/WorkCalendar.vue';
import QuickTimesheetDialog from 'src/components/dashboard/QuickTimesheetDialog.vue';
import TimesheetDialog from 'src/components/timesheet/TimesheetDialog.vue';

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// 当前日期
const currentDate = computed(() => {
  return formatDate(new Date().toISOString());
});

// 项目数据
const projects = ref<Project[]>([]);
const loadingProjects = ref(false);

// 我管理的项目
const managedProjects = computed(() => {
  return projects.value.filter((p) => p.managerUserCode === authStore.userInfo?.userCode);
});

// 我参与的项目（不包括管理的项目）
const participatedProjects = computed(() => {
  return projects.value.filter((p) => p.managerUserCode !== authStore.userInfo?.userCode);
});

// 工时数据
const timesheets = ref<Timesheet[]>([]);
const loadingTimesheets = ref(false);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 选中的日期
const selectedDate = ref('');
const showTimesheetDialog = ref(false);

// 选中日期的工时列表
const selectedDateTimesheets = computed(() => {
  if (!selectedDate.value) return [];
  return timesheets.value.filter((t) => t.workDate.startsWith(selectedDate.value));
});

// 快速新建对话框
const showCreateDialog = ref(false);

// 加载项目列表
const loadProjects = async () => {
  loadingProjects.value = true;
  try {
    const response = await projectApi.getMyProjects();
    if (response.code === 200 && response.data) {
      projects.value = response.data;
    }
  } catch (error) {
    console.error('Load projects error:', error);
    $q.notify({
      type: 'negative',
      message: t('dashboard.message.loadError'),
    });
  } finally {
    loadingProjects.value = false;
  }
};

// 加载工时列表
const loadTimesheets = async () => {
  loadingTimesheets.value = true;
  try {
    // 获取当前月份的第一天和最后一天
    const startDate = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-01`;
    const lastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const endDate = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const response = await timesheetApi.getMyTimesheets({
      current: 1,
      size: 1000,
      startDate,
      endDate,
    });

    if (response.code === 200 && response.data) {
      timesheets.value = response.data.records || [];
    }
  } catch (error) {
    console.error('Load timesheets error:', error);
    $q.notify({
      type: 'negative',
      message: t('dashboard.message.loadError'),
    });
  } finally {
    loadingTimesheets.value = false;
  }
};

// 点击日期
const handleDateClick = (date: string) => {
  selectedDate.value = date;
  showTimesheetDialog.value = true;
};

// 切换月份
const handleMonthChange = (year: number, month: number) => {
  currentYear.value = year;
  currentMonth.value = month;
  void loadTimesheets();
};

// 工时保存成功
const handleTimesheetSaved = () => {
  showCreateDialog.value = false;
  void loadTimesheets();
};

// 跳转到工时审核页面
const goToReviewPage = () => {
  void router.push('/timesheet/review');
};

// 初始化加载
onMounted(() => {
  void loadProjects();
  void loadTimesheets();
  // 启动待审核工时轮询
  notificationStore.startPolling();
});

// 组件卸载时停止轮询
onUnmounted(() => {
  notificationStore.stopPolling();
});
</script>

<style scoped lang="scss">
.dashboard-page {
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-section {
  flex-shrink: 0;

  h5 {
    line-height: 1.1;
    font-size: 1.2rem;
  }

  p {
    margin-top: 2px;
  }
}

.statistics-section {
  flex-shrink: 0;

  .q-card-section {
    padding: 6px 10px;
  }
}

.pending-review-banner {
  transition: all 0.3s ease;
  border-left: 4px solid var(--q-warning);
  background: linear-gradient(to right, rgba(255, 152, 0, 0.05), transparent);
  
  &:hover {
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.2);
    transform: translateY(-2px);
    border-left-width: 6px;
  }
}

.projects-section {
  flex: 0.6;
  min-height: 0;
  overflow: hidden;

  .row {
    height: 100%;
  }

  .col-12 {
    display: flex;
    flex-direction: column;
  }

  .q-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-list-container {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    
    // 美化滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
      
      &:hover {
        background: #555;
      }
    }
  }
}

.calendar-section {
  flex: 1.4;
  min-height: 0;
  display: flex;
  flex-direction: column;

  .q-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .q-card-section {
    &:last-child {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
  }
}

.bg-gradient {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

// 响应式调整
@media (max-width: 1023px) {
  .dashboard-page {
    padding: 12px;
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 12px;
    gap: 8px;
  }
}
</style>
