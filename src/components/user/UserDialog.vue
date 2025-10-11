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
          <!-- 用户代码 -->
          <q-input
            v-model="formData.userCode"
            :label="$t('user.userCode')"
            :placeholder="$t('user.placeholder.userCode')"
            :readonly="isEdit"
            :rules="[(val) => !!val || $t('user.validation.userCodeRequired')]"
            outlined
            dense
          />

          <!-- 用户名称 -->
          <q-input
            v-model="formData.userName"
            :label="$t('user.userName')"
            :placeholder="$t('user.placeholder.userName')"
            :rules="[(val) => !!val || $t('user.validation.userNameRequired')]"
            outlined
            dense
          />

          <!-- 邮箱 -->
          <q-input
            v-model="formData.email"
            type="email"
            :label="$t('user.email')"
            :placeholder="$t('user.placeholder.email')"
            :rules="[(val) => !val || /.+@.+\..+/.test(val) || $t('user.validation.emailInvalid')]"
            outlined
            dense
          />

          <!-- 手机号 -->
          <q-input
            v-model="formData.phoneNumber"
            :label="$t('user.phoneNumber')"
            :placeholder="$t('user.placeholder.phoneNumber')"
            :rules="[
              (val) => !val || /^1[3-9]\d{9}$/.test(val) || $t('user.validation.phoneInvalid'),
            ]"
            outlined
            dense
          />

          <!-- 密码 (仅新建时显示) -->
          <q-input
            v-if="!isEdit"
            v-model="formData.password"
            :type="isPwd ? 'password' : 'text'"
            :label="$t('user.password')"
            :placeholder="$t('user.placeholder.password')"
            :rules="[
              (val) => !!val || $t('user.validation.passwordRequired'),
              (val) => {
                if (!val) return true;
                return val.length >= 6 || $t('user.validation.passwordMinLength');
              },
            ]"
            outlined
            dense
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- 角色（多选下拉框） -->
          <q-select
            v-model="selectedRoles"
            :label="$t('user.roleName')"
            :placeholder="$t('user.placeholder.roleName')"
            :options="roleOptions"
            :loading="rolesLoading"
            :rules="[(val) => (val && val.length > 0) || $t('user.validation.roleRequired')]"
            multiple
            use-chips
            emit-value
            map-options
            outlined
            dense
          />

          <!-- 部门（多选下拉框） -->
          <q-select
            v-model="selectedDepartments"
            :label="$t('user.departmentName')"
            :placeholder="$t('user.placeholder.departmentName')"
            :options="departmentOptions"
            :loading="departmentsLoading"
            multiple
            use-chips
            emit-value
            map-options
            outlined
            dense
          />

          <!-- 时区 -->
          <q-select
            v-model="formData.timezone"
            :label="$t('user.timezone')"
            :placeholder="$t('user.placeholder.timezone')"
            :options="timezoneOptions"
            emit-value
            map-options
            outlined
            dense
            clearable
          />

          <!-- 状态 -->
          <div class="row items-center">
            <div class="col-3 text-body2">{{ $t('user.status') }}</div>
            <div class="col-9">
              <q-option-group v-model="formData.status" :options="statusOptions" inline />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="row justify-end q-gutter-sm">
            <q-btn :label="$t('user.cancel')" color="grey" flat v-close-popup />
            <q-btn :label="$t('user.save')" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from 'src/types/user';
import { roleApi } from 'src/api/role';
import { departmentApi } from 'src/api/department';

interface Props {
  modelValue: boolean;
  user?: User | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', user: User): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  user: null,
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
const isEdit = computed(() => !!props.user?.uuid);

// 对话框标题
const dialogTitle = computed(() =>
  isEdit.value ? t('user.formTitle.edit') : t('user.formTitle.create'),
);

// 密码显示/隐藏
const isPwd = ref(true);

// 角色选项和加载状态
const roleOptions = ref<Array<{ label: string; value: string }>>([]);
const rolesLoading = ref(false);

// 选中的角色（数组形式）
const selectedRoles = ref<string[]>([]);

// 部门选项和加载状态
const departmentOptions = ref<Array<{ label: string; value: string }>>([]);
const departmentsLoading = ref(false);

// 选中的部门（数组形式）
const selectedDepartments = ref<string[]>([]);

// 表单数据
const formData = ref<User>({
  userCode: '',
  userName: '',
  email: '',
  phoneNumber: '',
  password: '',
  roleName: '',
  departmentName: '',
  timezone: '',
  status: 1,
});

// 加载角色列表（每次打开对话框都重新加载最新数据）
const loadRoles = async () => {
  rolesLoading.value = true;
  try {
    const response = await roleApi.getRoleList({ current: 1, size: 100 });
    if (response.code === 200 && response.data) {
      roleOptions.value = response.data.records.map((r) => ({
        label: r.name,
        value: r.name,
      }));
    }
  } catch (error) {
    console.error('Load roles error:', error);
  } finally {
    rolesLoading.value = false;
  }
};

// 加载部门列表（每次打开对话框都重新加载最新数据）
const loadDepartments = async () => {
  departmentsLoading.value = true;
  try {
    const response = await departmentApi.getDepartmentList({ current: 1, size: 100 });
    if (response.code === 200 && response.data) {
      departmentOptions.value = response.data.records.map((d) => ({
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

// 时区选项
const timezoneOptions = computed(() => [
  { label: t('user.timezones.utc'), value: 'UTC' },
  // 亚洲
  { label: t('user.timezones.shanghai'), value: 'Asia/Shanghai' },
  { label: t('user.timezones.tokyo'), value: 'Asia/Tokyo' },
  { label: t('user.timezones.seoul'), value: 'Asia/Seoul' },
  { label: t('user.timezones.hongkong'), value: 'Asia/Hong_Kong' },
  { label: t('user.timezones.taipei'), value: 'Asia/Taipei' },
  { label: t('user.timezones.singapore'), value: 'Asia/Singapore' },
  { label: t('user.timezones.bangkok'), value: 'Asia/Bangkok' },
  { label: t('user.timezones.dubai'), value: 'Asia/Dubai' },
  { label: t('user.timezones.kolkata'), value: 'Asia/Kolkata' },
  { label: t('user.timezones.karachi'), value: 'Asia/Karachi' },
  { label: t('user.timezones.tashkent'), value: 'Asia/Tashkent' },
  // 欧洲
  { label: t('user.timezones.london'), value: 'Europe/London' },
  { label: t('user.timezones.paris'), value: 'Europe/Paris' },
  { label: t('user.timezones.berlin'), value: 'Europe/Berlin' },
  { label: t('user.timezones.rome'), value: 'Europe/Rome' },
  { label: t('user.timezones.madrid'), value: 'Europe/Madrid' },
  { label: t('user.timezones.amsterdam'), value: 'Europe/Amsterdam' },
  { label: t('user.timezones.moscow'), value: 'Europe/Moscow' },
  { label: t('user.timezones.istanbul'), value: 'Europe/Istanbul' },
  // 美洲
  { label: t('user.timezones.newYork'), value: 'America/New_York' },
  { label: t('user.timezones.chicago'), value: 'America/Chicago' },
  { label: t('user.timezones.denver'), value: 'America/Denver' },
  { label: t('user.timezones.losAngeles'), value: 'America/Los_Angeles' },
  { label: t('user.timezones.toronto'), value: 'America/Toronto' },
  { label: t('user.timezones.mexicoCity'), value: 'America/Mexico_City' },
  { label: t('user.timezones.saoPaulo'), value: 'America/Sao_Paulo' },
  { label: t('user.timezones.buenosAires'), value: 'America/Argentina/Buenos_Aires' },
  // 大洋洲
  { label: t('user.timezones.sydney'), value: 'Australia/Sydney' },
  { label: t('user.timezones.melbourne'), value: 'Australia/Melbourne' },
  { label: t('user.timezones.auckland'), value: 'Pacific/Auckland' },
  // 非洲
  { label: t('user.timezones.cairo'), value: 'Africa/Cairo' },
  { label: t('user.timezones.johannesburg'), value: 'Africa/Johannesburg' },
]);

// 状态选项
const statusOptions = computed(() => [
  { label: t('user.statusActive'), value: 1 },
  { label: t('user.statusInactive'), value: 0 },
]);

// 监听对话框打开，加载角色和部门列表并初始化表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // 每次打开对话框都重新加载最新角色和部门列表
      void loadRoles();
      void loadDepartments();

      // 初始化表单数据
      if (props.user) {
        formData.value = { ...props.user };
        // 将逗号分割的角色字符串转为数组
        selectedRoles.value = props.user.roleName
          ? props.user.roleName.split(',').map((r) => r.trim())
          : [];
        // 将逗号分割的部门字符串转为数组
        selectedDepartments.value = props.user.departmentName
          ? props.user.departmentName.split(',').map((d) => d.trim())
          : [];
      } else {
        // 重置表单
        formData.value = {
          userCode: '',
          userName: '',
          email: '',
          phoneNumber: '',
          password: '',
          roleName: '',
          departmentName: '',
          timezone: '',
          status: 1,
        };
        selectedRoles.value = [];
        selectedDepartments.value = [];
      }
    }
  },
);

// 监听选中的角色变化，同步到 formData.roleName（逗号分割）
watch(selectedRoles, (newRoles) => {
  formData.value.roleName = newRoles.join(',');
});

// 监听选中的部门变化，同步到 formData.departmentName（逗号分割）
watch(selectedDepartments, (newDepartments) => {
  formData.value.departmentName = newDepartments.join(',');
});

// 提交表单
const onSubmit = () => {
  // 确保 roleName 和 departmentName 是逗号分割的字符串
  formData.value.roleName = selectedRoles.value.join(',');
  formData.value.departmentName = selectedDepartments.value.join(',');
  emit('save', { ...formData.value });
};
</script>

<style scoped lang="scss">
.q-card {
  max-width: 600px;
}
</style>
