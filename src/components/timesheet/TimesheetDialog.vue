<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 600px">
      <!-- 对话框标题 -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ timesheet?.uuid ? $t('timesheet.formTitle.edit') : $t('timesheet.formTitle.create') }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="handleClose" />
      </q-card-section>

      <!-- 表单内容 -->
      <q-card-section>
        <q-form ref="formRef" @submit="handleSubmit">
          <div class="q-gutter-md">
            <!-- 项目选择 -->
            <q-select
              v-model="formData.projectCode"
              :options="projectOptions"
              :label="$t('timesheet.projectName')"
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
                <q-icon name="folder" />
              </template>
            </q-select>

            <!-- 工作日期 -->
            <q-input
              v-model="formData.workDate"
              :label="$t('timesheet.workDate')"
              :placeholder="$t('timesheet.placeholder.workDate')"
              outlined
              dense
              :rules="[
                (val) => !!val || $t('timesheet.validation.workDateRequired'),
                (val) => !isFutureDate(val) || $t('timesheet.validation.workDateFuture'),
              ]"
            >
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.workDate" :max="todayString" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- 工时数 -->
            <q-input
              v-model.number="formData.hours"
              type="number"
              :label="$t('timesheet.hours')"
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
                <q-icon name="schedule" />
              </template>
              <template #append>
                <span class="text-caption text-grey">{{ $t('timesheet.hours') }}</span>
              </template>
            </q-input>

            <!-- 工作描述 -->
            <q-input
              v-model="formData.description"
              type="textarea"
              :label="$t('timesheet.description')"
              :placeholder="$t('timesheet.placeholder.description')"
              outlined
              rows="5"
              counter
              maxlength="500"
            >
              <template #prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </q-form>
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
import type { Timesheet, CreateTimesheetDto, UpdateTimesheetDto } from 'src/types/timesheet';
import type { Project } from 'src/types/project';
import { projectApi } from 'src/api/project';

// Props
interface Props {
  modelValue: boolean;
  timesheet?: Timesheet | null;
  loading?: boolean;
  initialDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  timesheet: null,
  loading: false,
  initialDate: '',
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: CreateTimesheetDto | UpdateTimesheetDto];
}>();

const { t } = useI18n();

// 表单引用
const formRef = ref<QForm | null>(null);

// 表单数据
const formData = ref<CreateTimesheetDto | UpdateTimesheetDto>({
  projectCode: '',
  workDate: '',
  hours: 8,
  description: '',
});

// 项目列表
const projectOptions = ref<Project[]>([]);
const loadingProjects = ref(false);

// 今天的日期字符串
const todayString = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

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

// 监听timesheet变化，更新表单数据
watch(
  () => props.timesheet,
  (newVal) => {
    if (newVal) {
      // 编辑模式
      formData.value = {
        uuid: newVal.uuid,
        projectCode: newVal.projectCode,
        workDate: newVal.workDate?.substring(0, 10) || '',
        hours: newVal.hours,
        description: newVal.description,
      };
    } else {
      // 新建模式
      const createData: CreateTimesheetDto = {
        projectCode: '',
        workDate: props.initialDate || todayString.value || '',
        hours: 8,
        description: '',
      };
      formData.value = createData;
    }
  },
  { immediate: true },
);

// 监听对话框打开，加载项目列表并重置表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      void loadMyProjects();

      // 重置表单数据
      if (props.timesheet) {
        // 编辑模式
        formData.value = {
          uuid: props.timesheet.uuid,
          projectCode: props.timesheet.projectCode,
          workDate: props.timesheet.workDate?.substring(0, 10) || '',
          hours: props.timesheet.hours,
          description: props.timesheet.description,
        };
      } else {
        // 新建模式 - 使用initialDate
        formData.value = {
          projectCode: '',
          workDate: props.initialDate || todayString.value || '',
          hours: 8,
          description: '',
        };
      }
    }
  },
);

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false);
  // 重置表单
  formRef.value?.resetValidation();
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  // 发送保存事件
  if (props.timesheet?.uuid) {
    // 编辑模式
    emit('save', formData.value as UpdateTimesheetDto);
  } else {
    // 新建模式
    const { ...createData } = formData.value as UpdateTimesheetDto;
    emit('save', createData as CreateTimesheetDto);
  }
};

// 页面加载时初始化
onMounted(() => {
  if (props.modelValue) {
    void loadMyProjects();
  }
});
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
