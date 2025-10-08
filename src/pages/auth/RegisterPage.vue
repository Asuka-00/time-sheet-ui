<template>
  <div class="flex flex-center register-page">
    <q-card flat class="register-card">
      <q-card-section class="q-pb-sm">
        <div class="text-h6 text-weight-medium q-mb-xs">
          {{ $t('auth.register') }}
        </div>
        <div class="text-caption text-grey-7">
          {{ $t('auth.hasAccount') }}
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            color="primary"
            :label="$t('auth.goToLogin')"
            padding="none"
            @click="goToLogin"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleRegister" class="q-gutter-sm">
          <q-input
            v-model="formData.userCode"
            :label="$t('auth.userCode')"
            :placeholder="$t('auth.placeholder.userCode')"
            dense
            outlined
            hide-bottom-space
            :rules="[
              (val) => !!val || $t('auth.validation.userCodeRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="badge" size="xs" />
            </template>
          </q-input>

          <q-input
            v-model="formData.userName"
            :label="$t('auth.userName')"
            :placeholder="$t('auth.placeholder.userName')"
            dense
            outlined
            hide-bottom-space
            :rules="[
              (val) => !!val || $t('auth.validation.userNameRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="person" size="xs" />
            </template>
          </q-input>

          <q-input
            v-model="formData.password"
            :label="$t('auth.password')"
            :placeholder="$t('auth.placeholder.password')"
            :type="isPwd ? 'password' : 'text'"
            dense
            outlined
            hide-bottom-space
            :rules="[
              (val) => !!val || $t('auth.validation.passwordRequired'),
              (val) =>
                val.length >= 6 || $t('auth.validation.passwordMinLength'),
            ]"
          >
            <template #prepend>
              <q-icon name="lock" size="xs" />
            </template>
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                size="xs"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            :label="$t('auth.confirmPassword')"
            :placeholder="$t('auth.placeholder.confirmPassword')"
            :type="isConfirmPwd ? 'password' : 'text'"
            dense
            outlined
            hide-bottom-space
            :rules="[
              (val) => !!val || $t('auth.validation.confirmPasswordRequired'),
              (val) =>
                val === formData.password || $t('auth.validation.passwordMismatch'),
            ]"
            @keyup.enter="handleRegister"
          >
            <template #prepend>
              <q-icon name="lock" size="xs" />
            </template>
            <template #append>
              <q-icon
                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                size="xs"
                class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            unelevated
            no-caps
            color="primary"
            :label="$t('auth.register')"
            :loading="loading"
            size="md"
            class="full-width q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import type { RegisterRequest } from 'src/types/auth';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// 表单数据
const formData = ref<RegisterRequest>({
  userCode: '',
  userName: '',
  password: '',
});

// 状态
const confirmPassword = ref('');
const loading = ref(false);
const isPwd = ref(true);
const isConfirmPwd = ref(true);

// 处理注册
const handleRegister = async () => {
  // 验证密码匹配
  if (formData.value.password !== confirmPassword.value) {
    Notify.create({
      type: 'negative',
      message: t('auth.validation.passwordMismatch'),
    });
    return;
  }

  loading.value = true;
  try {
    const success = await authStore.register(formData.value);

    if (success) {
      Notify.create({
        type: 'positive',
        message: t('auth.registerSuccess'),
      });

      // 注册成功后跳转到首页
      await router.push('/');
    }
  } finally {
    loading.value = false;
  }
};

// 跳转到登录页面
const goToLogin = () => {
  void router.push('/login');
};
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: #fafafa;
}

.register-card {
  width: 100%;
  max-width: 380px;
  padding: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

@media (max-width: $breakpoint-sm-max) {
  .register-card {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
}
</style>
