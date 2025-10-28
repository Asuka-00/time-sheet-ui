<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/favicon.ico" />
          </q-avatar>
          {{ $t('common.appTitle') }}
        </q-toolbar-title>

        <q-space />

        <!-- 语言切换按钮 -->
        <q-btn-dropdown flat dense :label="currentLocaleLabel" icon="language" class="q-mr-md">
          <q-list>
            <q-item
              v-for="lang in availableLocales"
              :key="lang.value"
              clickable
              v-close-popup
              @click="changeLocale(lang.value)"
              :active="currentLocale === lang.value"
            >
              <q-item-section>
                <q-item-label>{{ lang.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- 用户信息和菜单 -->
        <div v-if="authStore.userInfo" class="q-mr-md">
          <q-btn-dropdown flat dense>
            <template #label>
              <div class="row items-center no-wrap">
                <q-avatar size="32px" color="white" text-color="primary">
                  <q-icon name="person" />
                </q-avatar>
                <div class="q-ml-sm">
                  {{ authStore.userInfo.userName }}
                </div>
              </div>
            </template>

            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="account_circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('auth.profile') }}</q-item-label>
                  <q-item-label caption>{{ authStore.userInfo.userCode }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="showChangePasswordDialog = true">
                <q-item-section avatar>
                  <q-icon name="lock" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('auth.changePassword') }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('auth.logout') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <template v-for="menu in menuItems" :key="menu.code">
          <!-- 有子菜单的情况 -->
          <q-expansion-item
            v-if="menu.children && menu.children.length > 0"
            :icon="menu.icon"
            :label="getMenuLabel(menu)"
            expand-separator
          >
            <q-item
              v-for="child in menu.children"
              :key="child.code"
              clickable
              v-ripple
              :to="child.path"
              :inset-level="1"
            >
              <q-item-section avatar>
                <q-icon :name="child.icon || 'circle'" />
              </q-item-section>
              <q-item-section>
                {{ getMenuLabel(child) }}
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- 没有子菜单的情况 -->
          <q-item v-else clickable v-ripple :to="menu.path">
            <q-item-section avatar>
              <q-icon :name="menu.icon || 'circle'" />
            </q-item-section>
            <q-item-section>
              {{ getMenuLabel(menu) }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- 修改密码对话框 -->
    <ChangePasswordDialog v-model="showChangePasswordDialog" />
  </q-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Quasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { useLocaleStore } from 'src/stores/locale';
import type { Permission } from 'src/types/permission';
import ChangePasswordDialog from 'src/components/auth/ChangePasswordDialog.vue';
import { i18n, quasarLangMap } from 'src/boot/i18n';
import { useIdleTimeout } from 'src/composables/useIdleTimeout';

const router = useRouter();
const authStore = useAuthStore();
const localeStore = useLocaleStore();
const { t } = useI18n();
const leftDrawerOpen = ref(false);
const showChangePasswordDialog = ref(false);

// 空闲超时检测 - 可配置时间无操作自动退出（通过环境变量 VITE_IDLE_TIMEOUT_MINUTES 配置）
useIdleTimeout({
  onIdle: async () => {
    // 空闲超时处理
    authStore.logoutDueToIdle();
    await router.push('/login');
  },
  immediate: authStore.isAuthenticated,
});

// 语言相关
const currentLocale = computed(() => localeStore.currentLocale);
const currentLocaleLabel = computed(() => localeStore.currentLocaleLabel);
const availableLocales = computed(() => localeStore.availableLocales);

// 切换语言
const changeLocale = (locale: string) => {
  // 更新 store
  localeStore.setLocale(locale);

  // 更新 i18n
  (i18n.global.locale as unknown as { value: string }).value = locale;

  // 更新 Quasar 语言包
  const quasarLang = quasarLangMap[locale] ?? quasarLangMap['zh-CN'];
  if (quasarLang) {
    Quasar.lang.set(quasarLang);
  }
};

// 从 authStore 获取用户权限菜单
const menuItems = computed(() => {
  // 创建主页菜单项
  const homeMenuItem: Permission = {
    code: 'home',
    name: '主页',
    icon: 'home',
    path: '/',
    menuName: 'menu.home',
    module: 'system',
    description: '系统主页',
    status: 1,
    createdBy: 'system',
    createdAt: new Date(),
    updatedBy: 'system',
    updatedAt: new Date(),
  };

  // 获取用户权限菜单
  const userMenus = authStore.userPermissions || [];

  // 将主页菜单项放在最前面
  return [homeMenuItem, ...userMenus];
});

// 获取菜单显示标签（支持国际化）
const getMenuLabel = (menu: Permission): string => {
  if (menu.menuName) {
    // 尝试使用国际化key，如果不存在则返回menuName
    const i18nKey = menu.menuName;
    const translated = t(i18nKey);
    return translated !== i18nKey ? translated : menu.menuName;
  }
  return menu.name;
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = async () => {
  authStore.logout();
  await router.push('/login');
};
</script>
