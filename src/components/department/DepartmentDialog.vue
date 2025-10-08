<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- 部门名称 -->
          <q-input
            v-model="formData.name"
            :label="$t('department.name')"
            :placeholder="$t('department.placeholder.name')"
            :rules="[
              (val) => !!val || $t('department.validation.nameRequired'),
            ]"
            outlined
            dense
          />

          <!-- 部门描述 -->
          <q-input
            v-model="formData.description"
            :label="$t('department.description')"
            :placeholder="$t('department.placeholder.description')"
            :rules="[
              (val) => !!val || $t('department.validation.descriptionRequired'),
            ]"
            type="textarea"
            outlined
            dense
            rows="3"
          />

          <!-- 上级部门 -->
          <q-select
            v-model="formData.parentDepartmentName"
            :label="$t('department.parentDepartmentName')"
            :placeholder="$t('department.placeholder.parentDepartmentName')"
            :options="departmentOptions"
            :loading="departmentsLoading"
            emit-value
            map-options
            outlined
            dense
            clearable
          />

          <!-- 状态 -->
          <div class="row items-center">
            <div class="col-3 text-body2">{{ $t('department.status') }}</div>
            <div class="col-9">
              <q-option-group
                v-model="formData.status"
                :options="statusOptions"
                inline
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              :label="$t('department.cancel')"
              color="grey"
              flat
              v-close-popup
            />
            <q-btn
              :label="$t('department.save')"
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
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Department } from 'src/types/department';
import { departmentApi } from 'src/api/department';

interface Props {
  modelValue: boolean;
  department?: Department | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', department: Department): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  department: null,
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
const isEdit = computed(() => !!props.department?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('department.formTitle.edit') : t('department.formTitle.create')
);

// 部门选项和加载状态
const departmentOptions = ref<Array<{ label: string; value: string }>>([]);
const departmentsLoading = ref(false);

// 表单数据
const formData = ref<Department>({
  name: '',
  description: '',
  status: 1,
});

// 加载部门列表（用于上级部门选择）
const loadDepartments = async () => {
  departmentsLoading.value = true;
  try {
    const response = await departmentApi.getDepartmentList({ current: 1, size: 100 });
    if (response.code === 200 && response.data) {
      // 过滤掉当前编辑的部门（避免自己作为自己的上级）
      const departments = response.data.records.filter(
        (d) => !isEdit.value || d.name !== props.department?.name
      );
      departmentOptions.value = departments.map((d) => ({
        label: d.name,
        value: d.name,
      }));
    }
  } catch (error) {
    console.error('Load departments error:', error);
  } finally {
    departmentsLoading.value = false;
  }
};

// 状态选项
const statusOptions = computed(() => [
  { label: t('department.statusActive'), value: 1 },
  { label: t('department.statusInactive'), value: 0 },
]);

// 监听对话框打开，加载部门列表并初始化表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // 每次打开对话框都重新加载最新部门列表
      void loadDepartments();

      // 初始化表单数据
      if (props.department) {
        formData.value = { ...props.department };
      } else {
        // 重置表单
        formData.value = {
          name: '',
          description: '',
          status: 1,
        };
      }
    }
  }
);

// 提交表单
const onSubmit = () => {
  emit('save', { ...formData.value });
};
</script>

<style scoped lang="scss">
.q-card {
  max-width: 600px;
}
</style>

