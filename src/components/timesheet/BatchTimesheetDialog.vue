<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 900px; max-width: 95vw">
      <!-- 对话框标题 -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('timesheet.batchCreateForm.title') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="handleClose" />
      </q-card-section>

      <!-- 表单内容 -->
      <q-card-section>
        <q-scroll-area style="height: 500px">
          <q-form ref="formRef">
            <!-- 表头 -->
            <div class="row q-gutter-sm q-mb-sm">
              <div class="col-3 text-weight-medium">{{ $t('timesheet.projectName') }}</div>
              <div class="col-2 text-weight-medium">{{ $t('timesheet.workDate') }}</div>
              <div class="col-2 text-weight-medium">{{ $t('timesheet.hours') }}</div>
              <div class="col-3 text-weight-medium">{{ $t('timesheet.description') }}</div>
              <div class="col-auto text-weight-medium">{{ $t('timesheet.table.actions') }}</div>
            </div>

            <!-- 工时行 -->
            <div
              v-for="(row, index) in rows"
              :key="row.key"
              class="row q-gutter-sm q-mb-md items-start"
            >
              <!-- 项目选择 -->
              <div class="col-3">
                <q-select
                  v-model="row.projectCode"
                  :options="projectOptions"
                  :label="index === 0 ? '' : undefined"
                  :placeholder="$t('timesheet.placeholder.projectCode')"
                  option-value="projectCode"
                  option-label="projectName"
                  emit-value
                  map-options
                  outlined
                  dense
                  :rules="[(val) => !!val || $t('timesheet.validation.projectCodeRequired')]"
                  :loading="loadingProjects"
                >
                  <template #prepend>
                    <q-icon name="folder" size="xs" />
                  </template>
                </q-select>
              </div>

              <!-- 工作日期 -->
              <div class="col-2">
                <q-input
                  v-model="row.workDate"
                  :label="index === 0 ? '' : undefined"
                  :placeholder="$t('timesheet.placeholder.workDate')"
                  outlined
                  dense
                  :rules="[
                    (val) => !!val || $t('timesheet.validation.workDateRequired'),
                    (val) => !isFutureDate(val) || $t('timesheet.validation.workDateFuture'),
                  ]"
                >
                  <template #prepend>
                    <q-icon name="event" class="cursor-pointer" size="xs">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="row.workDate" :max="todayString" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <!-- 工时数 -->
              <div class="col-2">
                <q-input
                  v-model.number="row.hours"
                  type="number"
                  :label="index === 0 ? '' : undefined"
                  :placeholder="$t('timesheet.placeholder.hours')"
                  outlined
                  dense
                  step="0.5"
                  min="0.5"
                  max="24"
                  :rules="[
                    (val) =>
                      (val !== null && val !== undefined && val !== '') ||
                      $t('timesheet.validation.hoursRequired'),
                    (val) => (val >= 0.5 && val <= 24) || $t('timesheet.validation.hoursRange'),
                  ]"
                >
                  <template #prepend>
                    <q-icon name="schedule" size="xs" />
                  </template>
                </q-input>
              </div>

              <!-- 工作描述 -->
              <div class="col-3">
                <q-input
                  v-model="row.description"
                  :label="index === 0 ? '' : undefined"
                  :placeholder="$t('timesheet.placeholder.description')"
                  outlined
                  dense
                >
                  <template #prepend>
                    <q-icon name="description" size="xs" />
                  </template>
                </q-input>
              </div>

              <!-- 操作按钮 -->
              <div class="col-auto">
                <!-- 复制按钮 -->
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="content_copy"
                  size="sm"
                  @click="copyRow(row)"
                >
                  <q-tooltip>{{ $t('timesheet.batchCreateForm.copyRow') }}</q-tooltip>
                </q-btn>

                <!-- 删除按钮 -->
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete"
                  size="sm"
                  :disable="rows.length === 1"
                  @click="removeRow(row.key)"
                >
                  <q-tooltip v-if="rows.length > 1">{{
                    $t('timesheet.batchCreateForm.removeRow')
                  }}</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-form>
        </q-scroll-area>

        <!-- 添加新行按钮 -->
        <div class="q-mt-md">
          <q-btn
            flat
            color="primary"
            icon="add"
            :label="$t('timesheet.batchCreateForm.addRow')"
            @click="addRow"
          />
        </div>
      </q-card-section>

      <!-- 对话框按钮 -->
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat :label="$t('timesheet.cancel')" color="grey" @click="handleClose" />
        <q-btn
          :label="$t('timesheet.save')"
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import type { QForm } from 'quasar';
import type { CreateTimesheetDto, BatchCreateTimesheetDto } from 'src/types/timesheet';
import type { Project } from 'src/types/project';
import { projectApi } from 'src/api/project';

// Props
interface Props {
  modelValue: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: BatchCreateTimesheetDto];
}>();

const { t } = useI18n();

// 批量工时行数据结构
interface BatchTimesheetRow extends CreateTimesheetDto {
  key: string;
}

// 表单引用
const formRef = ref<QForm | null>(null);

// 工时行数据
const rows = ref<BatchTimesheetRow[]>([]);

// 项目列表
const projectOptions = ref<Project[]>([]);
const loadingProjects = ref(false);

// 今天的日期字符串
const todayString = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// 生成唯一key
const generateKey = (): string => {
  return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 初始化空行
const createEmptyRow = (): BatchTimesheetRow => {
  return {
    key: generateKey(),
    projectCode: '',
    workDate: todayString.value || '',
    hours: 8,
    description: '',
  };
};

// 加载我的项目列表
const loadMyProjects = async () => {
  loadingProjects.value = true;
  try {
    const response = await projectApi.getMyProjects();
    if (response.code === 200 && response.data) {
      // 只显示进行中的项目
      projectOptions.value = response.data.filter((p: Project) => p.status === 1);
    }
  } catch (error) {
    console.error('Load projects error:', error);
    Notify.create({
      type: 'negative',
      message: t('project.message.loadError'),
    });
  } finally {
    loadingProjects.value = false;
  }
};

// 判断是否为未来日期
const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = todayString.value;
  if (!today) return false;
  return dateStr > today;
};

// 日期加一天
const addOneDay = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  const result = date.toISOString().split('T')[0];
  return result || '';
};

// 添加新行
const addRow = () => {
  rows.value.push(createEmptyRow());
};

// 删除行
const removeRow = (key: string) => {
  if (rows.value.length <= 1) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.validation.atLeastOneRow'),
    });
    return;
  }
  const index = rows.value.findIndex((row) => row.key === key);
  if (index > -1) {
    rows.value.splice(index, 1);
  }
};

// 复制行
const copyRow = (sourceRow: BatchTimesheetRow) => {
  // 计算新日期：原日期加一天
  let newDate = addOneDay(sourceRow.workDate);

  // 检查新日期是否超过今天
  const today = todayString.value;
  if (today && newDate > today) {
    newDate = sourceRow.workDate; // 如果超过今天，使用原日期
  }

  const newRow: BatchTimesheetRow = {
    key: generateKey(),
    projectCode: sourceRow.projectCode,
    workDate: newDate,
    hours: sourceRow.hours,
    description: sourceRow.description,
  };

  // 在源行后面插入新行
  const sourceIndex = rows.value.findIndex((row) => row.key === sourceRow.key);
  if (sourceIndex > -1) {
    rows.value.splice(sourceIndex + 1, 0, newRow);
  } else {
    rows.value.push(newRow);
  }
};

// 监听对话框打开
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // 初始化一行空数据
      rows.value = [createEmptyRow()];
      void loadMyProjects();
    }
  },
);

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false);
  // 重置表单
  formRef.value?.resetValidation();
  rows.value = [];
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.validation.formError'),
    });
    return;
  }

  if (rows.value.length === 0) {
    Notify.create({
      type: 'warning',
      message: t('timesheet.validation.atLeastOneRow'),
    });
    return;
  }

  // 检查是否有重复的项目+日期组合
  const duplicateIndexes: number[] = [];
  const seen = new Map<string, number>();

  rows.value.forEach((row, index) => {
    if (row.projectCode && row.workDate) {
      const key = `${row.projectCode}_${row.workDate}`;
      if (seen.has(key)) {
        const firstIndex = seen.get(key)!;
        if (!duplicateIndexes.includes(firstIndex)) {
          duplicateIndexes.push(firstIndex);
        }
        duplicateIndexes.push(index);
      } else {
        seen.set(key, index);
      }
    }
  });

  if (duplicateIndexes.length > 0) {
    Notify.create({
      type: 'negative',
      message: t('timesheet.validation.hasDuplicateRows', { count: duplicateIndexes.length }),
    });
    return;
  }

  // 发送保存事件
  const timesheets = rows.value.map((row) => ({
    projectCode: row.projectCode,
    workDate: row.workDate,
    hours: row.hours,
    description: row.description,
  }));

  emit('save', { timesheets });
};

// 页面加载时初始化
onMounted(() => {
  if (props.modelValue) {
    rows.value = [createEmptyRow()];
    void loadMyProjects();
  }
});
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
