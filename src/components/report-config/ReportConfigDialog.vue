<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- 报表名称 -->
          <q-input
            v-model="formData.reportName"
            :label="$t('reportConfig.reportName')"
            :placeholder="$t('reportConfig.placeholder.reportName')"
            :rules="[(val) => !!val || $t('reportConfig.validation.reportNameRequired')]"
            outlined
            dense
          />

          <!-- 定时配置 -->
          <div class="q-gutter-sm">
            <div class="text-subtitle2">{{ $t('reportConfig.scheduleConfig') }}</div>

            <!-- 配置模式切换 -->
            <q-toggle
              v-model="useAdvancedCron"
              :label="$t('reportConfig.useAdvancedCron')"
              color="primary"
              size="sm"
            />

            <!-- 简单模式 -->
            <div v-if="!useAdvancedCron" class="q-gutter-sm">
              <!-- 执行频率 -->
              <q-select
                v-model="scheduleConfig.frequency"
                :options="frequencyOptions"
                :label="$t('reportConfig.frequency')"
                emit-value
                map-options
                outlined
                dense
                @update:model-value="updateCronExpression"
              />

              <!-- 执行日期（每月模式） -->
              <q-select
                v-if="scheduleConfig.frequency === 'monthly'"
                v-model="scheduleConfig.dayOfMonth"
                :options="dayOfMonthOptions"
                :label="$t('reportConfig.dayOfMonth')"
                emit-value
                map-options
                outlined
                dense
                @update:model-value="updateCronExpression"
              />

              <!-- 执行星期（每周模式） -->
              <q-select
                v-if="scheduleConfig.frequency === 'weekly'"
                v-model="scheduleConfig.dayOfWeek"
                :options="dayOfWeekOptions"
                :label="$t('reportConfig.dayOfWeek')"
                emit-value
                map-options
                outlined
                dense
                @update:model-value="updateCronExpression"
              />

              <!-- 执行时间 -->
              <div class="row q-gutter-sm">
                <div class="col">
                  <q-select
                    v-model="scheduleConfig.hour"
                    :options="hourOptions"
                    :label="$t('reportConfig.hour')"
                    emit-value
                    map-options
                    outlined
                    dense
                    @update:model-value="updateCronExpression"
                  />
                </div>
                <div class="col">
                  <q-select
                    v-model="scheduleConfig.minute"
                    :options="minuteOptions"
                    :label="$t('reportConfig.minute')"
                    emit-value
                    map-options
                    outlined
                    dense
                    @update:model-value="updateCronExpression"
                  />
                </div>
              </div>

              <!-- 显示生成的CRON表达式 -->
              <q-banner dense class="bg-grey-2 text-grey-8">
                <template #avatar>
                  <q-icon name="schedule" color="primary" />
                </template>
                <div class="text-caption">
                  {{ $t('reportConfig.generatedCron') }}:
                  <strong>{{ formData.cronExpression }}</strong>
                </div>
                <div class="text-caption text-grey-7">
                  {{ getCronDescription() }}
                </div>
              </q-banner>
            </div>

            <!-- 高级模式 - 直接输入CRON表达式 -->
            <q-input
              v-else
              v-model="formData.cronExpression"
              :label="$t('reportConfig.cronExpression')"
              :placeholder="$t('reportConfig.placeholder.cronExpression')"
              :rules="[(val) => !!val || $t('reportConfig.validation.cronExpressionRequired')]"
              outlined
              dense
            >
              <template #hint>
                {{ $t('reportConfig.hints.cronExpression') }}
              </template>
            </q-input>
          </div>

          <!-- 接收邮箱列表 -->
          <q-select
            v-model="formData.recipientEmailsArray"
            :label="$t('reportConfig.recipientEmails')"
            :placeholder="$t('reportConfig.placeholder.recipientEmails')"
            :rules="[
              (val) =>
                (val && val.length > 0) || $t('reportConfig.validation.recipientEmailsRequired'),
              (val) => validateEmails(val) || $t('reportConfig.validation.emailFormat'),
            ]"
            use-input
            use-chips
            multiple
            input-debounce="0"
            new-value-mode="add-unique"
            outlined
            dense
            @new-value="createEmail"
          />

          <!-- 抄送邮箱列表 -->
          <q-select
            v-model="formData.ccEmailsArray"
            :label="$t('reportConfig.ccEmails')"
            :placeholder="$t('reportConfig.placeholder.ccEmails')"
            :rules="[
              (val) =>
                !val ||
                val.length === 0 ||
                validateEmails(val) ||
                $t('reportConfig.validation.emailFormat'),
            ]"
            use-input
            use-chips
            multiple
            input-debounce="0"
            new-value-mode="add-unique"
            outlined
            dense
            @new-value="createEmail"
          >
            <template #hint>
              {{ $t('reportConfig.hints.ccEmails') }}
            </template>
          </q-select>

          <!-- 项目编号列表 -->
          <q-select
            v-model="formData.projectCodes"
            :options="projectOptions"
            :label="$t('reportConfig.projectCodes')"
            :placeholder="$t('reportConfig.placeholder.projectCodes')"
            :loading="projectLoading"
            emit-value
            map-options
            use-input
            use-chips
            multiple
            input-debounce="300"
            outlined
            dense
            @filter="filterProjects"
          >
            <template #hint>
              {{ $t('reportConfig.hints.projectCodes') }}
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('reportConfig.noProjectsFound') }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- 月份偏移量 -->
          <q-select
            v-model="formData.monthOffset"
            :options="monthOffsetOptions"
            :label="$t('reportConfig.monthOffset')"
            :rules="[
              (val) =>
                (val !== null && val !== undefined) ||
                $t('reportConfig.validation.monthOffsetRequired'),
            ]"
            emit-value
            map-options
            outlined
            dense
          >
            <template #hint>
              {{ $t('reportConfig.hints.monthOffset') }}
            </template>
          </q-select>

          <!-- 描述 -->
          <q-input
            v-model="formData.description"
            :label="$t('reportConfig.description')"
            :placeholder="$t('reportConfig.placeholder.description')"
            type="textarea"
            outlined
            dense
            rows="3"
          />

          <!-- 是否启用 -->
          <div class="row items-center">
            <div class="col-3 text-body2">{{ $t('reportConfig.isEnabled') }}</div>
            <div class="col-9">
              <q-toggle
                v-model="formData.isEnabled"
                :label="
                  formData.isEnabled
                    ? $t('reportConfig.statusEnabled')
                    : $t('reportConfig.statusDisabled')
                "
                color="positive"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="row justify-end q-gutter-sm">
            <q-btn :label="$t('reportConfig.cancel')" color="grey" flat v-close-popup />
            <q-btn
              :label="$t('reportConfig.save')"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import type { ReportConfig } from 'src/types/report-config';
import type { Project } from 'src/types/project';
import { projectApi } from 'src/api/project';

interface Props {
  modelValue: boolean;
  reportConfig?: ReportConfig | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', reportConfig: ReportConfig): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  reportConfig: null,
  loading: false,
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

// 是否使用高级CRON模式
const useAdvancedCron = ref(false);

// 简单模式的调度配置
const scheduleConfig = ref({
  frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
  dayOfMonth: 1,
  dayOfWeek: 1,
  hour: 9,
  minute: 0,
});

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 是否为编辑模式
const isEdit = computed(() => !!props.reportConfig?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('reportConfig.formTitle.edit') : t('reportConfig.formTitle.create'),
);

// 表单数据
const formData = ref<ReportConfig>({
  reportName: '',
  cronExpression: '',
  recipientEmails: '',
  recipientEmailsArray: [],
  ccEmails: '',
  ccEmailsArray: [],
  projectCodes: [],
  monthOffset: -1,
  isEnabled: true,
  description: '',
});

// 月份偏移量选项
const monthOffsetOptions = computed(() => [
  { label: t('reportConfig.monthOffsetOptions.currentMonth'), value: 0 },
  { label: t('reportConfig.monthOffsetOptions.lastMonth'), value: -1 },
  { label: t('reportConfig.monthOffsetOptions.twoMonthsAgo'), value: -2 },
  { label: t('reportConfig.monthOffsetOptions.threeMonthsAgo'), value: -3 },
  { label: t('reportConfig.monthOffsetOptions.fourMonthsAgo'), value: -4 },
  { label: t('reportConfig.monthOffsetOptions.fiveMonthsAgo'), value: -5 },
  { label: t('reportConfig.monthOffsetOptions.sixMonthsAgo'), value: -6 },
]);

// 频率选项
const frequencyOptions = computed(() => [
  { label: t('reportConfig.frequencyOptions.daily'), value: 'daily' },
  { label: t('reportConfig.frequencyOptions.weekly'), value: 'weekly' },
  { label: t('reportConfig.frequencyOptions.monthly'), value: 'monthly' },
]);

// 月份的某一天选项 (1-31)
const dayOfMonthOptions = computed(() =>
  Array.from({ length: 31 }, (_, i) => ({
    label: t('reportConfig.dayLabel', { day: i + 1 }),
    value: i + 1,
  })),
);

// 星期选项 (1-7: 周一到周日)
const dayOfWeekOptions = computed(() => [
  { label: t('reportConfig.weekDays.monday'), value: 1 },
  { label: t('reportConfig.weekDays.tuesday'), value: 2 },
  { label: t('reportConfig.weekDays.wednesday'), value: 3 },
  { label: t('reportConfig.weekDays.thursday'), value: 4 },
  { label: t('reportConfig.weekDays.friday'), value: 5 },
  { label: t('reportConfig.weekDays.saturday'), value: 6 },
  { label: t('reportConfig.weekDays.sunday'), value: 0 },
]);

// 小时选项 (0-23)
const hourOptions = computed(() =>
  Array.from({ length: 24 }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}:00`,
    value: i,
  })),
);

// 分钟选项 (0, 15, 30, 45)
const minuteOptions = computed(() => [
  { label: '00', value: 0 },
  { label: '15', value: 15 },
  { label: '30', value: 30 },
  { label: '45', value: 45 },
]);

// 根据简单配置生成CRON表达式
const updateCronExpression = () => {
  const { frequency, dayOfMonth, dayOfWeek, hour, minute } = scheduleConfig.value;

  switch (frequency) {
    case 'daily':
      // 每天执行: 分 时 * * *
      formData.value.cronExpression = `0 ${minute} ${hour} * * *`;
      break;
    case 'weekly':
      // 每周执行: 分 时 * * 星期
      formData.value.cronExpression = `0 ${minute} ${hour} * * ${dayOfWeek}`;
      break;
    case 'monthly':
      // 每月执行: 分 时 日 * *
      formData.value.cronExpression = `0 ${minute} ${hour} ${dayOfMonth} * *`;
      break;
  }
};

// 从CRON表达式解析配置（简单解析，支持常见格式）
const parseCronExpression = (cronExpr: string) => {
  if (!cronExpr) return;

  const parts = cronExpr.trim().split(/\s+/);
  if (parts.length !== 6) return; // 不是标准的6段式CRON

  const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // 只解析简单的数字形式
  if (second !== '0') return; // 秒必须是0

  const minuteNum = parseInt(minute || '0', 10);
  const hourNum = parseInt(hour || '0', 10);

  if (isNaN(minuteNum) || isNaN(hourNum)) return;

  scheduleConfig.value.minute = minuteNum;
  scheduleConfig.value.hour = hourNum;

  // 判断频率
  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    scheduleConfig.value.frequency = 'daily';
  } else if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    scheduleConfig.value.frequency = 'weekly';
    const dayNum = parseInt(dayOfWeek || '0', 10);
    if (!isNaN(dayNum)) {
      scheduleConfig.value.dayOfWeek = dayNum;
    }
  } else if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
    scheduleConfig.value.frequency = 'monthly';
    const dayNum = parseInt(dayOfMonth || '1', 10);
    if (!isNaN(dayNum)) {
      scheduleConfig.value.dayOfMonth = dayNum;
    }
  } else {
    // 复杂的CRON表达式，切换到高级模式
    useAdvancedCron.value = true;
  }
};

// 获取CRON描述
const getCronDescription = () => {
  const { frequency, dayOfMonth, dayOfWeek, hour, minute } = scheduleConfig.value;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  switch (frequency) {
    case 'daily': {
      return t('reportConfig.cronDescription.daily', { time: timeStr });
    }
    case 'weekly': {
      const weekDayName = dayOfWeekOptions.value.find((d) => d.value === dayOfWeek)?.label || '';
      return t('reportConfig.cronDescription.weekly', { day: weekDayName, time: timeStr });
    }
    case 'monthly': {
      return t('reportConfig.cronDescription.monthly', { day: dayOfMonth, time: timeStr });
    }
    default:
      return '';
  }
};

// 项目列表
const projectList = ref<Project[]>([]);
const projectLoading = ref(false);

// 项目选项（用于选择器）
const projectOptions = ref<Array<{ label: string; value: string }>>([]);

// 更新项目选项
const updateProjectOptions = (filter = '') => {
  const filterLower = filter.toLowerCase();
  projectOptions.value = projectList.value
    .filter(
      (project) =>
        project.projectCode.toLowerCase().includes(filterLower) ||
        project.projectName.toLowerCase().includes(filterLower),
    )
    .map((project) => ({
      label: `${project.projectCode} - ${project.projectName}`,
      value: project.projectCode,
    }));
};

// 过滤项目
const filterProjects = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    updateProjectOptions(val);
  });
};

// 加载项目列表
const loadProjects = async () => {
  projectLoading.value = true;
  try {
    const response = await projectApi.getProject();
    if (response.code === 200 && response.data) {
      projectList.value = response.data;
      // 初始化项目选项
      updateProjectOptions();
    } else {
      Notify.create({
        type: 'negative',
        message: t('reportConfig.message.loadProjectsFailed'),
      });
    }
  } catch (error) {
    console.error('Load projects error:', error);
    Notify.create({
      type: 'negative',
      message: t('reportConfig.message.loadProjectsFailed'),
    });
  } finally {
    projectLoading.value = false;
  }
};

// 邮箱验证正则
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 验证邮箱数组
const validateEmails = (emails: string[]) => {
  if (!emails || emails.length === 0) return true;
  return emails.every((email) => emailRegex.test(email));
};

// 创建新邮箱
const createEmail = (val: string, done: (item?: string) => void) => {
  if (val.length > 0) {
    if (!emailRegex.test(val)) {
      // 邮箱格式不正确，不添加
      done();
      return;
    }
    // 邮箱格式正确，添加到列表
    done(val);
  }
};

// 监听对话框打开，初始化表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.reportConfig) {
        // 编辑模式：复制数据
        formData.value = {
          ...props.reportConfig,
          // 确保数组字段正确初始化
          recipientEmailsArray: props.reportConfig.recipientEmailsArray || [],
          ccEmailsArray: props.reportConfig.ccEmailsArray || [],
          projectCodes: props.reportConfig.projectCodes || [],
          monthOffset:
            props.reportConfig.monthOffset !== undefined ? props.reportConfig.monthOffset : -1,
        };

        // 尝试解析现有的CRON表达式
        if (props.reportConfig.cronExpression) {
          parseCronExpression(props.reportConfig.cronExpression);
        }
      } else {
        // 创建模式：重置表单
        formData.value = {
          reportName: '',
          cronExpression: '0 0 9 1 * *', // 默认：每月1号上午9点
          recipientEmails: '',
          recipientEmailsArray: [],
          ccEmails: '',
          ccEmailsArray: [],
          projectCodes: [],
          monthOffset: -1,
          isEnabled: true,
          description: '',
        };

        // 重置简单配置为默认值
        scheduleConfig.value = {
          frequency: 'monthly',
          dayOfMonth: 1,
          dayOfWeek: 1,
          hour: 9,
          minute: 0,
        };
        useAdvancedCron.value = false;
      }
    }
  },
);

// 提交表单
const onSubmit = () => {
  const submitData: ReportConfig = {
    ...formData.value,
    // 保留数组字段用于API转换
    recipientEmailsArray: formData.value.recipientEmailsArray || [],
    ccEmailsArray: formData.value.ccEmailsArray || [],
    projectCodes: formData.value.projectCodes || [],
    monthOffset: formData.value.monthOffset !== undefined ? formData.value.monthOffset : -1,
  };

  emit('save', submitData);
};

// 组件挂载时加载项目列表
onMounted(() => {
  void loadProjects();
});
</script>

<style scoped lang="scss">
.q-card {
  max-width: 800px;
}
</style>
