<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 800px; max-width: 1000px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('project.formTitle.members') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- 项目信息 -->
        <div class="q-mb-md">
          <div class="text-subtitle1 text-weight-bold">
            {{ project?.projectName }}
            <q-chip size="sm" color="primary" text-color="white">
              {{ project?.projectCode }}
            </q-chip>
          </div>
          <div class="text-caption text-grey-7">
            {{ $t('project.manager') }}: {{ project?.managerUserName }}
          </div>
        </div>

        <q-separator />

        <div class="row q-col-gutter-md q-mt-md">
          <!-- 左侧：成员列表 -->
          <div class="col-7">
            <div class="text-subtitle2 q-mb-sm">
              {{ $t('project.members') }} ({{ members.length }})
            </div>
            <q-card flat bordered style="max-height: 400px; overflow-y: auto">
              <q-card-section v-if="membersLoading" class="text-center">
                <q-spinner color="primary" size="40px" />
                <div class="q-mt-sm text-grey-6">{{ $t('project.message.loadingMembers') }}</div>
              </q-card-section>
              <q-card-section v-else-if="members.length === 0" class="text-center text-grey-6">
                {{ $t('project.message.noMembers') }}
              </q-card-section>
              <q-list v-else separator>
                <q-item v-for="member in members" :key="member.uuid || member.userCode">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ member.userName }}</q-item-label>
                    <q-item-label caption>{{ member.email }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ member.role || '-' }}</q-item-label>
                    <q-item-label caption class="text-grey-6">
                      {{ formatDateTime(member.joinDate) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click="handleRemoveMember(member)"
                    >
                      <q-tooltip>{{ $t('project.removeMember') }}</q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- 右侧：添加成员表单 -->
          <div class="col-5">
            <div class="text-subtitle2 q-mb-sm">{{ $t('project.addMember') }}</div>
            <q-card flat bordered>
              <q-card-section>
                <q-form @submit="handleAddMember" class="q-gutter-md">
                  <!-- 选择用户 -->
                  <q-select
                    v-model="newMember.userCode"
                    :label="$t('project.memberTable.userName')"
                    :placeholder="$t('project.placeholder.selectUser')"
                    :options="availableUsers"
                    :loading="usersLoading"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('project.validation.userRequired'),
                    ]"
                    option-value="userCode"
                    option-label="userName"
                    multiple
                    use-chips
                    outlined
                    dense
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          {{ $t('project.message.loadingUsers') }}
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <!-- 角色 -->
                  <q-input
                    v-model="newMember.role"
                    :label="$t('project.memberTable.role')"
                    :placeholder="$t('project.placeholder.memberRole')"
                    outlined
                    dense
                  />

                  <!-- 加入日期 -->
                  <q-input
                    v-model="newMember.joinDate"
                    :label="$t('project.memberTable.joinDate')"
                    :placeholder="$t('project.placeholder.joinDate')"
                    outlined
                    dense
                  >
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="newMember.joinDate" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                :label="$t('project.close')"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <!-- 添加按钮 -->
                  <q-btn
                    :label="$t('project.addMember')"
                    type="submit"
                    color="primary"
                    class="full-width"
                    :loading="addingMember"
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="row justify-end q-mt-md">
          <q-btn :label="$t('project.close')" color="grey" flat v-close-popup />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Project, ProjectMember, BatchAddProjectMembersDto } from 'src/types/project';
import type { User } from 'src/types/user';
import { userApi } from 'src/api/user';
import { formatDateTime } from 'src/utils/date-formatter';

interface Props {
  modelValue: boolean;
  project?: Project | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'add-member', data: BatchAddProjectMembersDto): void;
  (e: 'remove-member', memberUuid: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  project: null,
});

const emit = defineEmits<Emits>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 成员列表
const members = ref<ProjectMember[]>([]);
const membersLoading = ref(false);

// 用户列表
const userOptions = ref<User[]>([]);
const usersLoading = ref(false);

// 添加成员状态
const addingMember = ref(false);

// 新成员表单
const newMember = ref<{
  projectCode: string;
  userCode: string[];
  role?: string;
  joinDate: string;
}>({
  projectCode: '',
  userCode: [],
  joinDate: new Date().toISOString().split('T')[0] as string,
});

// 可选用户（排除已添加的成员）
const availableUsers = computed(() => {
  const memberUserCodes = members.value.map((m) => m.userCode);
  return userOptions.value.filter((u) => !memberUserCodes.includes(u.userCode));
});

// 加载用户列表
const loadUsers = async () => {
  usersLoading.value = true;
  try {
    const response = await userApi.getUser();
    if (response.code === 200 && response.data) {
      userOptions.value = response.data;
    }
  } catch (error) {
    console.error('Load users error:', error);
  } finally {
    usersLoading.value = false;
  }
};

// 设置成员列表（从父组件传入）
const setMembers = (memberList: ProjectMember[]) => {
  members.value = memberList;
};

// 添加成员
const handleAddMember = () => {
  if (!props.project?.projectCode) return;
  if (!newMember.value.userCode || newMember.value.userCode.length === 0) return;

  const batchData: BatchAddProjectMembersDto = {
    projectCode: props.project.projectCode,
    userCodes: newMember.value.userCode,
    ...(newMember.value.role && { role: newMember.value.role }),
    ...(newMember.value.joinDate && { joinDate: newMember.value.joinDate }),
  };

  emit('add-member', batchData);

  // 重置表单
  newMember.value = {
    projectCode: props.project.projectCode,
    userCode: [],
    joinDate: new Date().toISOString().split('T')[0] as string,
  };
};

// 移除成员
const handleRemoveMember = (member: ProjectMember) => {
  if (member.uuid) {
    emit('remove-member', member.uuid);
  }
};

// 监听对话框打开
watch(dialogVisible, async (newVal) => {
  if (newVal) {
    // 加载用户列表
    await loadUsers();

    // 重置新成员表单
    if (props.project?.projectCode) {
      newMember.value = {
        projectCode: props.project.projectCode,
        userCode: [],
        joinDate: new Date().toISOString().split('T')[0] as string,
      };
    }
  }
});

// 暴露方法给父组件
defineExpose({
  setMembers,
  setLoading: (loading: boolean) => {
    membersLoading.value = loading;
  },
  setAddingMember: (loading: boolean) => {
    addingMember.value = loading;
  },
});
</script>

<style scoped lang="scss">
.q-list {
  .q-item {
    min-height: 60px;
  }
}
</style>
