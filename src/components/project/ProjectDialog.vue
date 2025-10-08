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
          <!-- 项目编码 -->
          <q-input
            v-model="formData.projectCode"
            :label="$t('project.projectCode')"
            :placeholder="$t('project.placeholder.projectCode')"
            :readonly="isEdit"
            :rules="[
              (val) => !!val || $t('project.validation.projectCodeRequired'),
              (val) =>
                (val && val.length >= 2 && val.length <= 50) ||
                $t('project.validation.projectCodeLength'),
            ]"
            outlined
            dense
          />

          <!-- 项目名称 -->
          <q-input
            v-model="formData.projectName"
            :label="$t('project.projectName')"
            :placeholder="$t('project.placeholder.projectName')"
            :rules="[
              (val) => !!val || $t('project.validation.projectNameRequired'),
              (val) =>
                (val && val.length >= 2 && val.length <= 100) ||
                $t('project.validation.projectNameLength'),
            ]"
            outlined
            dense
          />

          <!-- 项目描述 -->
          <q-input
            v-model="formData.description"
            :label="$t('project.description')"
            :placeholder="$t('project.placeholder.description')"
            :rules="[
              (val) => !val || val.length <= 500 || $t('project.validation.descriptionLength'),
            ]"
            type="textarea"
            outlined
            dense
            rows="3"
          />

          <!-- 项目经理 -->
          <q-select
            v-model="formData.managerUserCode"
            :label="$t('project.manager')"
            :placeholder="$t('project.placeholder.manager')"
            :options="userOptions"
            :loading="usersLoading"
            :rules="[(val) => !!val || $t('project.validation.managerRequired')]"
            option-value="userCode"
            option-label="userName"
            emit-value
            map-options
            outlined
            dense
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('project.message.loadingUsers') }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- 日期范围 -->
          <div class="row q-col-gutter-md">
            <!-- 开始日期 -->
            <div class="col-6">
              <q-input
                v-model="formData.startDate"
                :label="$t('project.startDate')"
                :placeholder="$t('project.placeholder.startDate')"
                outlined
                dense
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.startDate" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('project.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- 结束日期 -->
            <div class="col-6">
              <q-input
                v-model="formData.endDate"
                :label="$t('project.endDate')"
                :placeholder="$t('project.placeholder.endDate')"
                :rules="[validateEndDate]"
                outlined
                dense
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.endDate" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('project.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- 项目状态 -->
          <q-select
            v-model="formData.status"
            :label="$t('project.status')"
            :placeholder="$t('project.placeholder.status')"
            :options="statusOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
          />

          <!-- 操作按钮 -->
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn :label="$t('project.cancel')" color="grey" flat v-close-popup />
            <q-btn :label="$t('project.save')" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Project } from 'src/types/project';
import type { User } from 'src/types/user';
import { ProjectStatus } from 'src/types/project';
import { userApi } from 'src/api/user';

interface Props {
  modelValue: boolean;
  project?: Project | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', project: Project): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  project: null,
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
const isEdit = computed(() => !!props.project?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('project.formTitle.edit') : t('project.formTitle.create'),
);

// 用户列表
const userOptions = ref<User[]>([]);
const usersLoading = ref(false);

// 状态选项
const statusOptions = computed(() => [
  { value: ProjectStatus.IN_PROGRESS, label: t('project.statusOptions.inProgress') },
  { value: ProjectStatus.COMPLETED, label: t('project.statusOptions.completed') },
  { value: ProjectStatus.CANCELLED, label: t('project.statusOptions.cancelled') },
]);

// 表单数据
const formData = ref<Project>({
  projectCode: '',
  projectName: '',
  description: '',
  managerUserCode: '',
  startDate: '',
  endDate: '',
  status: ProjectStatus.IN_PROGRESS,
});

// 验证结束日期
const validateEndDate = (val: string) => {
  if (!val || !formData.value.startDate) return true;
  return val >= formData.value.startDate || t('project.validation.endDateAfterStart');
};

// 加载用户列表
const loadUsers = async () => {
  usersLoading.value = true;
  try {
    const response = await userApi.getUser();
    if (response.code === 200 && response.data) {
      userOptions.value = response.data;
    }
  } catch (error) {
    console.error('Load users error:', error);
  } finally {
    usersLoading.value = false;
  }
};

// 监听对话框打开，加载数据
watch(dialogVisible, async (newVal) => {
  if (newVal) {
    // 加载用户列表
    await loadUsers();

    // 如果是编辑模式，填充表单数据
    if (props.project) {
      formData.value = {
        ...props.project,
        startDate: props.project.startDate || '',
        endDate: props.project.endDate || '',
        status: props.project.status || ProjectStatus.IN_PROGRESS,
      };
    } else {
      // 重置表单
      formData.value = {
        projectCode: '',
        projectName: '',
        description: '',
        managerUserCode: '',
        startDate: '',
        endDate: '',
        status: ProjectStatus.IN_PROGRESS,
      };
    }
  }
});

// 提交表单
const onSubmit = () => {
  emit('save', { ...formData.value });
};
</script>

<style scoped lang="scss">
.q-date {
  min-width: 290px;
}
</style>
