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

          <!-- 数据范围 -->
          <q-select
            v-model="dataScopeArray"
            :label="$t('role.dataScope')"
            :placeholder="$t('role.placeholder.dataScope')"
            :options="dataScopeOptions"
            :loading="projectsLoading"
            outlined
            dense
            emit-value
            map-options
            multiple
            use-chips
            clearable
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
                tick-strategy="strict"
                default-expand-all
              >
                <template #default-header="prop">
                  <div class="row items-center">
                    <q-icon :name="prop.node.icon || 'folder'" size="20px" class="q-mr-sm" />
                    <span>{{ getNodeDisplayName(prop.node) }}</span>
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
import type { Project } from 'src/types/project';
import { permissionApi } from 'src/api/permission';
import { roleApi } from 'src/api/role';
import { projectApi } from 'src/api/project';

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

// 获取节点显示名称
const getNodeDisplayName = (node: Permission): string => {
  // 如果有 menuName，尝试从 i18n 获取翻译
  if (node.menuName) {
    const key = `permission.menus.${node.menuName}`;
    const translated = t(key);
    // 如果翻译成功（返回值不等于键本身），返回翻译
    if (translated !== key) {
      return translated;
    }
  }

  // 处理按钮权限：code 格式为 button:module:action
  if (node.type === 'button' && node.code && node.code.startsWith('button:')) {
    const codeParts = node.code.split(':');
    if (codeParts.length === 3) {
      const [, module, action] = codeParts;
      const key = `permission.buttons.${module}.${action}`;
      const translated = t(key);
      // 如果翻译成功（返回值不等于键本身），返回翻译
      if (translated !== key) {
        return translated;
      }
    }
  }

  // 否则返回原始 name
  return node.name;
};

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

// 项目数据
const projects = ref<Project[]>([]);
const projectsLoading = ref(false);

// 数据范围选项
const dataScopeOptions = computed(() => {
  const options = [
    {
      label: t('role.dataScopeAll'),
      value: 'ALL',
    },
  ];

  // 添加项目选项
  projects.value.forEach((project) => {
    options.push({
      label: `${project.projectCode} - ${project.projectName}`,
      value: project.projectCode,
    });
  });

  return options;
});

// 表单数据
const formData = ref<Role>({
  name: '',
  description: '',
  permissionCodes: [],
});

// 数据范围数组（用于多选）
const dataScopeArray = ref<string[]>([]);

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

// 加载项目列表
const loadProjects = async () => {
  projectsLoading.value = true;
  try {
    const response = await projectApi.getProject();
    if (response.code === 200 && response.data) {
      projects.value = response.data;
    }
  } catch (error) {
    console.error('Load projects error:', error);
  } finally {
    projectsLoading.value = false;
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
    // 每次打开对话框都重新加载权限树和项目列表
    await Promise.all([loadPermissions(), loadProjects()]);

    // 如果是编辑模式，加载角色权限
    if (props.role) {
      formData.value = {
        ...props.role,
        permissionCodes: props.role.permissionCodes || [],
      };
      // 将逗号分隔的字符串转换为数组
      dataScopeArray.value = props.role.dataScope
        ? props.role.dataScope
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
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
      dataScopeArray.value = [];
    }
  }
});

// 提交表单
const onSubmit = () => {
  const roleData = {
    ...formData.value,
    ...(dataScopeArray.value.length > 0 && { dataScope: dataScopeArray.value.join(',') }),
  };
  emit('save', roleData);
};
</script>

<style scoped lang="scss">
.q-tree {
  :deep(.q-tree__node-header) {
    padding: 4px 8px;
  }
}
</style>
