<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 450px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('user.formTitle.resetPassword') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- 用户信息显示 -->
        <div class="q-mb-md">
          <div class="text-body2 text-grey-7">
            {{ $t('user.userName') }}:
            <span class="text-weight-medium text-grey-9">{{ user?.userName }}</span>
          </div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            {{ $t('user.userCode') }}:
            <span class="text-weight-medium text-grey-9">{{ user?.userCode }}</span>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <!-- 重置密码表单 -->
        <q-form ref="formRef" @submit="onSubmit">
          <q-input
            v-model="formData.newPassword"
            type="password"
            :label="$t('user.placeholder.newPassword')"
            outlined
            dense
            :rules="[
              (val) => !!val || $t('user.validation.newPasswordRequired'),
              (val) => val.length >= 6 || $t('user.validation.newPasswordMinLength'),
            ]"
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input
            v-model="formData.confirmPassword"
            type="password"
            :label="$t('user.placeholder.confirmPassword')"
            outlined
            dense
            :rules="[
              (val) => !!val || $t('user.validation.confirmPasswordRequired'),
              (val) => val === formData.newPassword || $t('user.validation.passwordMismatch'),
            ]"
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat :label="$t('user.cancel')" color="grey" v-close-popup :disable="loading" />
        <q-btn
          unelevated
          :label="$t('user.confirm')"
          color="primary"
          :loading="loading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { User } from 'src/types/user';
import type { QForm } from 'quasar';

interface Props {
  modelValue: boolean;
  user: User | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', uuid: string, newPassword: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// 表单引用
const formRef = ref<QForm>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 表单数据
const formData = ref({
  newPassword: '',
  confirmPassword: '',
});

// 重置表单
const resetForm = () => {
  formData.value = {
    newPassword: '',
    confirmPassword: '',
  };
  formRef.value?.resetValidation();
};

// 监听对话框打开，重置表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  },
);

// 提交表单
const onSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  if (!props.user?.uuid) return;

  emit('save', props.user.uuid, formData.value.newPassword);
};
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
