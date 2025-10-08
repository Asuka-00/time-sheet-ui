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
          <!-- 角色名称 -->
          <q-input
            v-model="formData.name"
            :label="$t('role.roleName')"
            :placeholder="$t('role.placeholder.roleName')"
            :readonly="isEdit"
            :rules="[
              (val) => !!val || $t('role.validation.roleNameRequired'),
              (val) =>
                (val && val.length >= 2 && val.length <= 50) ||
                $t('role.validation.roleNameLength'),
            ]"
            outlined
            dense
          />

          <!-- 角色描述 -->
          <q-input
            v-model="formData.description"
            :label="$t('role.description')"
            :placeholder="$t('role.placeholder.description')"
            :rules="[
              (val) => !!val || $t('role.validation.descriptionRequired'),
              (val) => (val && val.length <= 200) || $t('role.validation.descriptionLength'),
            ]"
            type="textarea"
            outlined
            dense
            rows="3"
          />

          <!-- 权限树 -->
          <div>
            <div class="text-subtitle2 q-mb-sm">{{ $t('role.permissions') }}</div>
            <q-card flat bordered style="max-height: 400px; overflow-y: auto">
              <q-card-section v-if="permissionsLoading" class="text-center">
                <q-spinner color="primary" size="40px" />
                <div class="q-mt-sm text-grey-6">加载权限数据...</div>
              </q-card-section>
              <q-card-section
                v-else-if="permissionTree.length === 0"
                class="text-center text-grey-6"
              >
                暂无权限数据
              </q-card-section>
              <q-tree
                v-else
                v-model:ticked="formData.permissionCodes"
                :nodes="permissionTree"
                node-key="code"
                tick-strategy="leaf"
                default-expand-all
              >
                <template #default-header="prop">
                  <div class="row items-center">
                    <q-icon :name="prop.node.icon || 'folder'" size="20px" class="q-mr-sm" />
                    <span>{{ t(prop.node.menuName) || t(prop.node.name) }}</span>
                  </div>
                </template>
              </q-tree>
            </q-card>
          </div>

          <!-- 操作按钮 -->
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn :label="$t('role.cancel')" color="grey" flat v-close-popup />
            <q-btn
              :label="$t('role.save')"
              type="submit"
              color="primary"
              :loading="loading"
              :disable="permissionsLoading"
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
import type { Role } from 'src/types/role';
import type { Permission } from 'src/types/permission';
import { permissionApi } from 'src/api/permission';
import { roleApi } from 'src/api/role';

interface Props {
  modelValue: boolean;
  role?: Role | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', role: Role): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  role: null,
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
const isEdit = computed(() => !!props.role?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('role.formTitle.edit') : t('role.formTitle.create'),
);

// 权限树数据
const permissionTree = ref<Permission[]>([]);
const permissionsLoading = ref(false);

// 表单数据
const formData = ref<Role>({
  name: '',
  description: '',
  permissionCodes: [],
});

// 加载权限树（每次打开对话框都重新加载最新数据）
const loadPermissions = async () => {
  permissionsLoading.value = true;
  try {
    const response = await permissionApi.getPermissionTree();
    if (response.code === 200 && response.data) {
      permissionTree.value = response.data;
    }
  } catch (error) {
    console.error('Load permissions error:', error);
  } finally {
    permissionsLoading.value = false;
  }
};

// 加载角色权限
const loadRolePermissions = async (roleName: string) => {
  try {
    const response = await roleApi.getRolePermissions(roleName);
    if (response.code === 200 && response.data) {
      formData.value.permissionCodes = response.data;
    }
  } catch (error) {
    console.error('Load role permissions error:', error);
  }
};

// 监听对话框打开，加载数据
watch(dialogVisible, async (newVal) => {
  if (newVal) {
    // 每次打开对话框都重新加载权限树
    await loadPermissions();

    // 如果是编辑模式，加载角色权限
    if (props.role) {
      formData.value = { 
        ...props.role, 
        permissionCodes: props.role.permissionCodes || [] 
      };
      if (props.role.name) {
        await loadRolePermissions(props.role.name);
      }
    } else {
      // 重置表单
      formData.value = {
        name: '',
        description: '',
        permissionCodes: [],
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
.q-tree {
  :deep(.q-tree__node-header) {
    padding: 4px 8px;
  }
}
</style>
