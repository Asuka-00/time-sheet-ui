<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 600px">
      <!-- 对话框标题 -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('timesheet.formTitle.detail') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="handleClose" />
      </q-card-section>

      <!-- 工时详情 -->
      <q-card-section v-if="timesheet">
        <div class="q-gutter-sm">
          <!-- 工时编码 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.timesheetCode') }}:
            </div>
            <div class="col-8">{{ timesheet.timesheetCode }}</div>
          </div>
          <q-separator />

          <!-- 用户姓名 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">{{ $t('timesheet.userName') }}:</div>
            <div class="col-8">{{ timesheet.userName }}</div>
          </div>
          <q-separator />

          <!-- 项目名称 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.projectName') }}:
            </div>
            <div class="col-8">{{ timesheet.projectName }}</div>
          </div>
          <q-separator />

          <!-- 工作日期 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">{{ $t('timesheet.workDate') }}:</div>
            <div class="col-8">{{ formatDate(timesheet.workDate) }}</div>
          </div>
          <q-separator />

          <!-- 工时数 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">{{ $t('timesheet.hours') }}:</div>
            <div class="col-8">{{ timesheet.hours }} {{ $t('timesheet.hours') }}</div>
          </div>
          <q-separator />

          <!-- 工作描述 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.description') }}:
            </div>
            <div class="col-8">
              <div style="white-space: pre-wrap">{{ timesheet.description }}</div>
            </div>
          </div>
          <q-separator />

          <!-- 状态 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">{{ $t('timesheet.status') }}:</div>
            <div class="col-8">
              <q-badge :color="getStatusColor(timesheet.status)" :label="getStatusText(timesheet.status)" />
            </div>
          </div>
          <q-separator />

          <!-- 提交日期 -->
          <div v-if="timesheet.submitDate" class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.submitDate') }}:
            </div>
            <div class="col-8">{{ formatDateTime(timesheet.submitDate) }}</div>
          </div>
          <q-separator v-if="timesheet.submitDate" />

          <!-- 审核人 -->
          <div v-if="timesheet.reviewerUserName" class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.reviewerUserName') }}:
            </div>
            <div class="col-8">{{ timesheet.reviewerUserName }}</div>
          </div>
          <q-separator v-if="timesheet.reviewerUserName" />

          <!-- 审核日期 -->
          <div v-if="timesheet.reviewDate" class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.reviewDate') }}:
            </div>
            <div class="col-8">{{ formatDateTime(timesheet.reviewDate) }}</div>
          </div>
          <q-separator v-if="timesheet.reviewDate" />

          <!-- 审核意见 -->
          <div v-if="timesheet.reviewComment" class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.reviewComment') }}:
            </div>
            <div class="col-8">
              <div style="white-space: pre-wrap">{{ timesheet.reviewComment }}</div>
            </div>
          </div>
          <q-separator v-if="timesheet.reviewComment" />

          <!-- 创建时间 -->
          <div class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.createdAt') }}:
            </div>
            <div class="col-8">{{ formatDateTime(timesheet.createdAt) }}</div>
          </div>
          <q-separator />

          <!-- 更新时间 -->
          <div v-if="timesheet.updatedAt" class="row">
            <div class="col-4 text-weight-medium text-grey-7">
              {{ $t('timesheet.updatedAt') }}:
            </div>
            <div class="col-8">{{ formatDateTime(timesheet.updatedAt) }}</div>
          </div>
        </div>
      </q-card-section>

      <!-- 对话框按钮 -->
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat :label="$t('timesheet.close')" color="primary" @click="handleClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Timesheet } from 'src/types/timesheet';
import { formatDate, formatDateTime } from 'src/utils/date-formatter';

// Props
interface Props {
  modelValue: boolean;
  timesheet?: Timesheet | null;
}

withDefaults(defineProps<Props>(), {
  timesheet: null,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { t } = useI18n();

// 获取状态颜色
const getStatusColor = (status: number): string => {
  switch (status) {
    case 1:
      return 'grey';
    case 2:
      return 'warning';
    case 3:
      return 'positive';
    case 4:
      return 'negative';
    default:
      return 'grey';
  }
};

// 获取状态文本
const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return t('timesheet.statusOptions.draft');
    case 2:
      return t('timesheet.statusOptions.pendingReview');
    case 3:
      return t('timesheet.statusOptions.approved');
    case 4:
      return t('timesheet.statusOptions.rejected');
    default:
      return '';
  }
};


// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped lang="scss">
.q-separator {
  margin: 8px 0;
}
</style>
