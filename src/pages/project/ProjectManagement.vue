<template>
  <q-page padding>
    <div class="project-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('project.projectManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('project.placeholder.searchKey')"
                outlined
                dense
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                :label="$t('project.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('project.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn
                color="positive"
                :label="$t('project.create')"
                icon="add"
                @click="handleCreate"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 项目表格 -->
      <q-card flat bordered>
        <ProjectTable
          :projects="projects"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
          @members="handleMembers"
        />
      </q-card>

      <!-- 项目对话框 -->
      <ProjectDialog
        v-model="dialogVisible"
        :project="currentProject"
        :loading="saveLoading"
        @save="handleSave"
      />

      <!-- 项目成员对话框 -->
      <ProjectMemberDialog
        ref="memberDialogRef"
        v-model="memberDialogVisible"
        :project="currentProject"
        @add-member="handleAddMember"
        @remove-member="handleRemoveMember"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { projectApi } from 'src/api/project';
import type {
  Project,
  ProjectQuery,
  ProjectCreateDto,
  ProjectUpdateDto,
  ProjectMemberDto,
} from 'src/types/project';
import ProjectTable from 'src/components/project/ProjectTable.vue';
import ProjectDialog from 'src/components/project/ProjectDialog.vue';
import ProjectMemberDialog from 'src/components/project/ProjectMemberDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 项目列表
const projects = ref<Project[]>([]);

// 加载状态
const loading = ref(false);
const saveLoading = ref(false);

// 分页配置
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// 对话框状态
const dialogVisible = ref(false);
const memberDialogVisible = ref(false);

// 当前操作的项目
const currentProject = ref<Project | null>(null);

// 成员对话框引用
const memberDialogRef = ref<InstanceType<typeof ProjectMemberDialog> | null>(null);

// 加载项目列表
const loadProjects = async () => {
  loading.value = true;
  try {
    const query: ProjectQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await projectApi.getProjectList(query);

    if (response.code === 200 && response.data) {
      projects.value = response.data.records;
      pagination.value.rowsNumber = response.data.total;
    } else {
      Notify.create({
        type: 'negative',
        message: response.message,
      });
    }
  } catch (error) {
    console.error('Load projects error:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  void loadProjects();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadProjects();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadProjects();
};

// 新建项目
const handleCreate = () => {
  currentProject.value = null;
  dialogVisible.value = true;
};

// 编辑项目
const handleEdit = (project: Project) => {
  currentProject.value = { ...project };
  dialogVisible.value = true;
};

// 保存项目
const handleSave = async (project: Project) => {
  saveLoading.value = true;
  try {
    if (project.uuid) {
      // 更新 - 构造 ProjectUpdateDto
      const updateData: ProjectUpdateDto = {
        uuid: project.uuid,
        projectCode: project.projectCode,
        projectName: project.projectName,
        managerUserCode: project.managerUserCode,
        ...(project.description && { description: project.description }),
        ...(project.startDate && { startDate: project.startDate }),
        ...(project.endDate && { endDate: project.endDate }),
        ...(project.status !== undefined && { status: project.status }),
      };
      await projectApi.updateProject(updateData);
      Notify.create({
        type: 'positive',
        message: t('project.message.updateSuccess'),
      });
    } else {
      // 创建 - 构造 ProjectCreateDto
      const createData: ProjectCreateDto = {
        projectCode: project.projectCode,
        projectName: project.projectName,
        managerUserCode: project.managerUserCode,
        ...(project.description && { description: project.description }),
        ...(project.startDate && { startDate: project.startDate }),
        ...(project.endDate && { endDate: project.endDate }),
        ...(project.status !== undefined && { status: project.status }),
      };
      await projectApi.createProject(createData);
      Notify.create({
        type: 'positive',
        message: t('project.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadProjects();
  } catch (error) {
    console.error('Save project error:', error);
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (project: Project) => {
  $q.dialog({
    title: t('project.message.deleteConfirm'),
    message: t('project.message.deleteWarning'),
    ok: {
      label: t('project.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('project.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(project);
  });
};

// 删除项目
const handleDelete = async (project: Project) => {
  if (!project.uuid) return;

  try {
    await projectApi.deleteProject(project.uuid);
    Notify.create({
      type: 'positive',
      message: t('project.message.deleteSuccess'),
    });
    void loadProjects();
  } catch (error) {
    console.error('Delete project error:', error);
  }
};

// 成员管理
const handleMembers = async (project: Project) => {
  currentProject.value = project;
  memberDialogVisible.value = true;

  // 加载项目成员
  if (memberDialogRef.value) {
    memberDialogRef.value.setLoading(true);
  }

  try {
    const response = await projectApi.getProjectMembers(project.projectCode);
    if (response.code === 200 && response.data && memberDialogRef.value) {
      memberDialogRef.value.setMembers(response.data);
    }
  } catch (error) {
    console.error('Load members error:', error);
  } finally {
    if (memberDialogRef.value) {
      memberDialogRef.value.setLoading(false);
    }
  }
};

// 添加项目成员
const handleAddMember = async (member: ProjectMemberDto) => {
  if (memberDialogRef.value) {
    memberDialogRef.value.setAddingMember(true);
  }

  try {
    await projectApi.addProjectMember(member);
    Notify.create({
      type: 'positive',
      message: t('project.message.addMemberSuccess'),
    });

    // 重新加载成员列表
    if (currentProject.value) {
      const response = await projectApi.getProjectMembers(currentProject.value.projectCode);
      if (response.code === 200 && response.data && memberDialogRef.value) {
        memberDialogRef.value.setMembers(response.data);
      }
    }
  } catch (error) {
    console.error('Add member error:', error);
  } finally {
    if (memberDialogRef.value) {
      memberDialogRef.value.setAddingMember(false);
    }
  }
};

// 移除项目成员
const handleRemoveMember = (memberUuid: string) => {
  $q.dialog({
    title: t('project.message.removeMemberConfirm'),
    cancel: {
      label: t('project.cancel'),
      flat: true,
    },
    ok: {
      label: t('project.removeMember'),
      color: 'negative',
    },
  }).onOk(() => {
    void (async () => {
      try {
        await projectApi.removeProjectMember(memberUuid);
        Notify.create({
          type: 'positive',
          message: t('project.message.removeMemberSuccess'),
        });

        // 重新加载成员列表
        if (currentProject.value) {
          const response = await projectApi.getProjectMembers(currentProject.value.projectCode);
          if (response.code === 200 && response.data && memberDialogRef.value) {
            memberDialogRef.value.setMembers(response.data);
            void loadProjects();
          }
        }
      } catch (error) {
        console.error('Remove member error:', error);
      }
    })();
  });
};

// 页面加载时获取项目列表
onMounted(() => {
  void loadProjects();
});
</script>

<style scoped lang="scss">
.project-management {
  width: 100%;
  margin: 0 auto;
}
</style>
