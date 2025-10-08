<template>
  <div class="flex flex-center login-page">
    <q-card flat class="login-card">
      <q-card-section class="q-pb-sm">
        <div class="text-h6 text-weight-medium q-mb-xs">
          {{ $t('auth.login') }}
        </div>
        <div class="text-caption text-grey-7">
          {{ $t('auth.noAccount') }}
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            color="primary"
            :label="$t('auth.goToRegister')"
            padding="none"
            @click="goToRegister"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleLogin" class="q-gutter-sm">
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
            @keyup.enter="handleLogin"
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

          <div class="row items-center justify-between q-mt-sm">
            <q-checkbox v-model="rememberMe" dense size="xs" :label="$t('auth.rememberMe')" />
            <q-btn flat dense no-caps size="sm" color="grey-7" :label="$t('auth.forgotPassword')" padding="xs" />
          </div>

          <q-btn
            type="submit"
            unelevated
            no-caps
            color="primary"
            :label="$t('auth.login')"
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
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import type { LoginRequest } from 'src/types/auth';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();

// 表单数据
const formData = ref<LoginRequest>({
  userCode: '',
  password: '',
});

// 状态
const loading = ref(false);
const isPwd = ref(true);
const rememberMe = ref(false);

// 处理登录
const handleLogin = async () => {
  loading.value = true;
  try {
    const success = await authStore.login(formData.value);

    if (success) {
      Notify.create({
        type: 'positive',
        message: t('auth.loginSuccess'),
      });

      // 跳转到原页面或首页
      const redirect = route.query.redirect as string;
      await router.push(redirect || '/');
    }
  } finally {
    loading.value = false;
  }
};

// 跳转到注册页面
const goToRegister = () => {
  void router.push('/register');
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: #fafafa;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

@media (max-width: $breakpoint-sm-max) {
  .login-card {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
}
</style>
