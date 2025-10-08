<template>
  <q-card 
    class="project-card q-mb-sm" 
    :class="{ 'manager-card': isManager }"
  >
    <q-card-section class="compact-section">
      <!-- 第一行：项目名称 + 代码 + 状态 -->
      <div class="row items-center justify-between" style="margin-bottom: 2px;">
        <div class="col-auto">
          <span class="text-subtitle2 text-weight-medium q-mr-xs">{{ project.projectName }}</span>
          <span class="text-caption text-grey-6">{{ project.projectCode }}</span>
        </div>
        <q-badge 
          :color="getStatusColor(project.status)" 
          :label="getStatusLabel(project.status)"
          class="q-px-xs"
        />
      </div>

      <!-- 第二行：管理者 + 成员数 + 日期 -->
      <div class="row items-center q-gutter-sm text-caption text-grey-7">
        <div class="row items-center no-wrap">
          <q-icon name="person" size="14px" class="q-mr-xs" />
          <span class="ellipsis" style="max-width: 80px;">{{ project.managerUserName || project.managerUserCode }}</span>
        </div>
        <div class="row items-center no-wrap">
          <q-icon name="group" size="14px" class="q-mr-xs" />
          <span>{{ project.memberCount || 0 }}</span>
        </div>
        <div v-if="project.startDate || project.endDate" class="row items-center no-wrap">
          <q-icon name="event" size="14px" class="q-mr-xs" />
          <span class="ellipsis" style="max-width: 140px;">{{ formatDateRange(project.startDate, project.endDate) }}</span>
        </div>
      </div>
    </q-card-section>


    <!-- 管理者角色标识 -->
    <div v-if="isManager" class="manager-badge">
      <q-icon name="admin_panel_settings" size="14px" color="white" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Project } from 'src/types/project';
import { ProjectStatus } from 'src/types/project';
import { formatDate } from 'src/utils/date-formatter';

interface Props {
  project: Project;
  isManager?: boolean;
}

withDefaults(defineProps<Props>(), {
  isManager: false,
});

const { t } = useI18n();

// 获取项目状态颜色
const getStatusColor = (status?: number): string => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return 'positive';
    case ProjectStatus.COMPLETED:
      return 'grey';
    case ProjectStatus.CANCELLED:
      return 'negative';
    default:
      return 'grey';
  }
};

// 获取项目状态标签
const getStatusLabel = (status?: number): string => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return t('project.statusOptions.inProgress');
    case ProjectStatus.COMPLETED:
      return t('project.statusOptions.completed');
    case ProjectStatus.CANCELLED:
      return t('project.statusOptions.cancelled');
    default:
      return '-';
  }
};

// 格式化日期范围
const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } else if (startDate) {
    return `${formatDate(startDate)} -`;
  } else if (endDate) {
    return `- ${formatDate(endDate)}`;
  }
  return '-';
};
</script>

<style scoped lang="scss">
.project-card {
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  margin-bottom: 8px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &.manager-card {
    border-left-color: var(--q-primary);
  }

  &:last-child {
    margin-bottom: 0;
  }
  
  .compact-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px 8px !important;
  }
}

.manager-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: var(--q-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  
  .q-icon {
    font-size: 14px;
  }
}
</style>
