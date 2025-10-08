<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- 权限名称 -->
          <q-input
            v-model="formData.name"
            :label="$t('permission.name')"
            :placeholder="$t('permission.placeholder.name')"
            :rules="[
              (val) => !!val || $t('permission.validation.nameRequired'),
            ]"
            outlined
            dense
          />

          <!-- 菜单显示名称 -->
          <q-input
            v-model="formData.menuName"
            :label="$t('permission.menuName')"
            :placeholder="$t('permission.placeholder.menuName')"
            :hint="$t('permission.hint.menuName')"
            outlined
            dense
          />

          <!-- 权限代码 -->
          <q-input
            v-model="formData.code"
            :label="$t('permission.code')"
            :placeholder="$t('permission.placeholder.code')"
            :readonly="isEdit"
            :rules="[
              (val) => !!val || $t('permission.validation.codeRequired'),
            ]"
            outlined
            dense
          />

          <!-- 所属模块 -->
          <q-input
            v-model="formData.module"
            :label="$t('permission.module')"
            :placeholder="$t('permission.placeholder.module')"
            :rules="[
              (val) => !!val || $t('permission.validation.moduleRequired'),
            ]"
            outlined
            dense
          />

          <!-- 权限类型 -->
          <q-select
            v-model="formData.type"
            :label="$t('permission.type')"
            :placeholder="$t('permission.placeholder.type')"
            :options="typeOptions"
            outlined
            dense
            emit-value
            map-options
          />

          <!-- 权限描述 -->
          <q-input
            v-model="formData.description"
            :label="$t('permission.description')"
            :placeholder="$t('permission.placeholder.description')"
            :rules="[
              (val) => !!val || $t('permission.validation.descriptionRequired'),
            ]"
            outlined
            dense
            type="textarea"
            rows="3"
          />

          <!-- 父级权限代码 -->
          <q-input
            v-model="formData.parentCode"
            :label="$t('permission.parentCode')"
            :placeholder="$t('permission.placeholder.parentCode')"
            outlined
            dense
          />

          <!-- 路由路径 -->
          <q-input
            v-model="formData.path"
            :label="$t('permission.path')"
            :placeholder="$t('permission.placeholder.path')"
            outlined
            dense
          />

          <!-- 图标 -->
          <q-input
            v-model="formData.icon"
            :label="$t('permission.icon')"
            :placeholder="$t('permission.placeholder.icon')"
            outlined
            dense
          >
            <template #prepend>
              <q-icon v-if="formData.icon" :name="formData.icon" />
            </template>
          </q-input>

          <!-- 组件路径 -->
          <q-input
            v-model="formData.component"
            :label="$t('permission.component')"
            :placeholder="$t('permission.placeholder.component')"
            outlined
            dense
          />

          <!-- 排序值 -->
          <q-input
            v-model.number="formData.sort"
            :label="$t('permission.sort')"
            :placeholder="$t('permission.placeholder.sort')"
            type="number"
            outlined
            dense
          />

          <!-- 状态 -->
          <div class="row items-center">
            <div class="col-3 text-body2">{{ $t('permission.status') }}</div>
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
              :label="$t('permission.cancel')"
              color="grey"
              flat
              v-close-popup
            />
            <q-btn
              :label="$t('permission.save')"
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
import type { Permission } from 'src/types/permission';

interface Props {
  modelValue: boolean;
  permission?: Permission | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', permission: Permission): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  permission: null,
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
const isEdit = computed(() => !!props.permission?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('permission.formTitle.edit') : t('permission.formTitle.create')
);

// 表单数据
const formData = ref<Permission>({
  name: '',
  menuName: '',
  code: '',
  module: '',
  type: '',
  description: '',
  parentCode: '',
  path: '',
  icon: '',
  component: '',
  sort: 0,
  status: 1,
});

// 权限类型选项
const typeOptions = computed(() => [
  { label: t('permission.typeMenu'), value: 'menu' },
  { label: t('permission.typeButton'), value: 'button' },
  { label: t('permission.typeApi'), value: 'api' },
]);

// 状态选项
const statusOptions = computed(() => [
  { label: t('permission.statusActive'), value: 1 },
  { label: t('permission.statusInactive'), value: 0 },
]);

// 监听权限数据变化，初始化表单
watch(
  () => props.permission,
  (newPermission) => {
    if (newPermission) {
      formData.value = { ...newPermission };
    } else {
      // 重置表单
      formData.value = {
        name: '',
        menuName: '',
        code: '',
        module: '',
        type: '',
        description: '',
        parentCode: '',
        path: '',
        icon: '',
        component: '',
        sort: 0,
        status: 1,
      };
    }
  },
  { immediate: true }
);

// 提交表单
const onSubmit = () => {
  emit('save', { ...formData.value });
};
</script>

<style scoped lang="scss">
.q-card {
  max-width: 800px;
}
</style>
