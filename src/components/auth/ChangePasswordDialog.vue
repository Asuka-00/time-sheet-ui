<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-icon name="lock" size="md" color="primary" class="q-mr-sm" />
        <span class="text-h6">{{ $t('auth.changePassword') }}</span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleChangePassword" class="q-gutter-md">
          <!-- 旧密码 -->
          <q-input
            v-model="form.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            :label="$t('auth.oldPassword')"
            :placeholder="$t('auth.placeholder.oldPassword')"
            :rules="[
              val => !!val || $t('auth.validation.oldPasswordRequired')
            ]"
            lazy-rules
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="showOldPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showOldPassword = !showOldPassword"
              />
            </template>
          </q-input>

          <!-- 新密码 -->
          <q-input
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            :label="$t('auth.newPassword')"
            :placeholder="$t('auth.placeholder.newPassword')"
            :rules="[
              val => !!val || $t('auth.validation.newPasswordRequired'),
              val => val.length >= 6 || $t('auth.validation.passwordMinLength')
            ]"
            lazy-rules
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="showNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>

          <!-- 确认新密码 -->
          <q-input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :label="$t('auth.confirmPassword')"
            :placeholder="$t('auth.placeholder.confirmPassword')"
            :rules="[
              val => !!val || $t('auth.validation.confirmPasswordRequired'),
              val => val === form.newPassword || $t('auth.validation.passwordMismatch')
            ]"
            lazy-rules
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn 
          flat 
          :label="$t('common.cancel')" 
          v-close-popup 
          @click="resetForm"
        />
        <q-btn
          color="primary"
          :label="$t('common.confirm')"
          :loading="loading"
          @click="handleChangePassword"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { userApi } from 'src/api/user';
import type { ChangePasswordDto } from 'src/types/user';

// Props & Emits
interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const { t } = useI18n();

// Reactive data
const dialogVisible = ref(props.modelValue);
const loading = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive<ChangePasswordDto>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal;
});

watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal);
});

// Methods
const resetForm = () => {
  form.oldPassword = '';
  form.newPassword = '';
  form.confirmPassword = '';
  showOldPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

const validateForm = (): boolean => {
  if (!form.oldPassword) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.oldPasswordRequired'),
      position: 'top',
    });
    return false;
  }

  if (!form.newPassword) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.newPasswordRequired'),
      position: 'top',
    });
    return false;
  }

  if (form.newPassword.length < 6) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.passwordMinLength'),
      position: 'top',
    });
    return false;
  }

  if (!form.confirmPassword) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.confirmPasswordRequired'),
      position: 'top',
    });
    return false;
  }

  if (form.newPassword !== form.confirmPassword) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.passwordMismatch'),
      position: 'top',
    });
    return false;
  }

  return true;
};

const handleChangePassword = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  
  try {
    await userApi.changePassword(form);
    
    Notify.create({
      type: 'positive',
      message: t('auth.changePasswordSuccess'),
      position: 'top',
    });

    resetForm();
    dialogVisible.value = false;
  } catch (error) {
    console.error('Change password failed:', error);
    Notify.create({
      type: 'negative',
      message: t('auth.changePasswordFailed'),
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};
</script>
