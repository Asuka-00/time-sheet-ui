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
          <!-- 报表类型 -->
          <q-input
            v-model="formData.reportType"
            :label="$t('reportConfig.reportType')"
            :placeholder="$t('reportConfig.placeholder.reportType')"
            :rules="[(val) => !!val || $t('reportConfig.validation.reportTypeRequired')]"
            :readonly="isEdit"
            outlined
            dense
          >
            <template #append v-if="isEdit">
              <q-icon name="lock" color="grey">
                <q-tooltip>{{ $t('reportConfig.hints.reportTypeUnique') }}</q-tooltip>
              </q-icon>
            </template>
          </q-input>

          <!-- 报表名称 -->
          <q-input
            v-model="formData.reportName"
            :label="$t('reportConfig.reportName')"
            :placeholder="$t('reportConfig.placeholder.reportName')"
            :rules="[(val) => !!val || $t('reportConfig.validation.reportNameRequired')]"
            outlined
            dense
          />

          <!-- Cron表达式 -->
          <q-input
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
  reportType: '',
  reportName: '',
  cronExpression: '',
  recipientEmails: '',
  recipientEmailsArray: [],
  projectCodes: [],
  isEnabled: true,
  description: '',
});

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
          projectCodes: props.reportConfig.projectCodes || [],
        };
      } else {
        // 创建模式：重置表单
        formData.value = {
          reportType: '',
          reportName: '',
          cronExpression: '',
          recipientEmails: '',
          recipientEmailsArray: [],
          projectCodes: [],
          isEnabled: true,
          description: '',
        };
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
    projectCodes: formData.value.projectCodes || [],
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
