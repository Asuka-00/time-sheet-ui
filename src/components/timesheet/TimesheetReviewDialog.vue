<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 600px">
      <!-- 对话框标题 -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ action === 'approve' ? $t('timesheet.review.approveTitle') : $t('timesheet.review.rejectTitle') }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="handleClose" />
      </q-card-section>

      <!-- 工时详情 -->
      <q-card-section v-if="timesheet">
        <div class="q-gutter-sm">
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.timesheetCode') }}:</div>
            <div class="col-8">{{ timesheet.timesheetCode }}</div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.userName') }}:</div>
            <div class="col-8">{{ timesheet.userName }}</div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.projectName') }}:</div>
            <div class="col-8">{{ timesheet.projectName }}</div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.workDate') }}:</div>
            <div class="col-8">{{ formatDate(timesheet.workDate) }}</div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.hours') }}:</div>
            <div class="col-8">{{ timesheet.hours }} {{ $t('timesheet.hours') }}</div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.description') }}:</div>
            <div class="col-8">
              <div style="white-space: pre-wrap">{{ timesheet.description }}</div>
            </div>
          </div>
          <q-separator />
          <div class="row">
            <div class="col-4 text-weight-medium">{{ $t('timesheet.submitDate') }}:</div>
            <div class="col-8">{{ formatDateTime(timesheet.submitDate) }}</div>
          </div>
        </div>

        <!-- 审核意见输入框 -->
        <div class="q-mt-md">
          <q-input
            v-model="reviewComment"
            type="textarea"
            :label="$t('timesheet.reviewComment')"
            :placeholder="$t('timesheet.placeholder.reviewComment')"
            outlined
            rows="4"
            counter
            maxlength="500"
            :rules="action === 'reject' ? [
              (val) => !!val || $t('timesheet.validation.reviewCommentRequired'),
            ] : []"
          >
            <template #prepend>
              <q-icon name="comment" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <!-- 对话框按钮 -->
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          flat
          :label="$t('timesheet.cancel')"
          color="grey"
          @click="handleClose"
        />
        <q-btn
          :label="action === 'approve' ? $t('timesheet.approve') : $t('timesheet.reject')"
          :color="action === 'approve' ? 'positive' : 'negative'"
          :loading="loading"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Timesheet } from 'src/types/timesheet';
import { formatDate, formatDateTime } from 'src/utils/date-formatter';

// Props
interface Props {
  modelValue: boolean;
  timesheet?: Timesheet | null;
  action: 'approve' | 'reject';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  timesheet: null,
  loading: false,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [data: { uuid: string; action: 'approve' | 'reject'; comment?: string }];
}>();

// 审核意见
const reviewComment = ref('');

// 监听对话框打开，重置审核意见
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      reviewComment.value = '';
    }
  }
);

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false);
  reviewComment.value = '';
};

// 确认审核
const handleConfirm = () => {
  // 如果是驳回且没有填写审核意见，则提示
  if (props.action === 'reject' && !reviewComment.value) {
    return;
  }

  if (!props.timesheet?.uuid) {
    return;
  }

  const confirmData: { uuid: string; action: 'approve' | 'reject'; comment?: string } = {
    uuid: props.timesheet.uuid,
    action: props.action,
  };
  
  if (reviewComment.value) {
    confirmData.comment = reviewComment.value;
  }
  
  emit('confirm', confirmData);
};
</script>

<style scoped lang="scss">
.q-separator {
  margin: 8px 0;
}
</style>
