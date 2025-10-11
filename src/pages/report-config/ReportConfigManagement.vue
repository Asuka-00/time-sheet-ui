<template>
  <q-page padding>
    <div class="report-config-management">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h5">{{ $t('reportConfig.reportConfigManagement') }}</div>
      </div>

      <!-- 搜索栏 -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchKey"
                :placeholder="$t('reportConfig.placeholder.searchKey')"
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
                :label="$t('reportConfig.search')"
                icon="search"
                @click="handleSearch"
              />
              <q-btn
                flat
                color="grey"
                :label="$t('reportConfig.reset')"
                icon="refresh"
                class="q-ml-sm"
                @click="handleReset"
              />
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn
                color="positive"
                :label="$t('reportConfig.create')"
                icon="add"
                @click="handleCreate"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 报表配置表格 -->
      <q-card flat bordered>
        <ReportConfigTable
          :report-configs="reportConfigs"
          :loading="loading"
          :pagination="pagination"
          @request="handleTableRequest"
          @edit="handleEdit"
          @delete="handleDeleteConfirm"
          @toggle="handleToggleConfirm"
        />
      </q-card>

      <!-- 报表配置对话框 -->
      <ReportConfigDialog
        v-model="dialogVisible"
        :report-config="currentReportConfig"
        :loading="saveLoading"
        @save="handleSave"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { reportConfigApi, type ReportConfigFormData } from 'src/api/report-config';
import type { ReportConfig, ReportConfigQuery } from 'src/types/report-config';
import ReportConfigTable from 'src/components/report-config/ReportConfigTable.vue';
import ReportConfigDialog from 'src/components/report-config/ReportConfigDialog.vue';

const { t } = useI18n();
const $q = useQuasar();

// 搜索关键字
const searchKey = ref('');

// 报表配置列表
const reportConfigs = ref<ReportConfig[]>([]);

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

// 当前操作的报表配置
const currentReportConfig = ref<ReportConfig | null>(null);

// 加载报表配置列表
const loadReportConfigs = async () => {
  loading.value = true;
  try {
    const query: ReportConfigQuery = {
      current: pagination.value.page,
      size: pagination.value.rowsPerPage,
    };

    if (searchKey.value) {
      query.searchKey = searchKey.value;
    }

    const response = await reportConfigApi.getReportConfigList(query);

    if (response.code === 200 && response.data) {
      reportConfigs.value = response.data.records;
      pagination.value.rowsNumber = response.data.total;
    } else {
      Notify.create({
        type: 'negative',
        message: response.message || t('reportConfig.message.loadFailed'),
      });
    }
  } catch (error) {
    console.error('Load report configs error:', error);
    Notify.create({
      type: 'negative',
      message: t('reportConfig.message.loadFailed'),
    });
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  void loadReportConfigs();
};

// 重置
const handleReset = () => {
  searchKey.value = '';
  pagination.value.page = 1;
  void loadReportConfigs();
};

// 表格请求事件
const handleTableRequest = (evt: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
  pagination.value.page = evt.pagination.page;
  pagination.value.rowsPerPage = evt.pagination.rowsPerPage;
  void loadReportConfigs();
};

// 新建报表配置
const handleCreate = () => {
  currentReportConfig.value = null;
  dialogVisible.value = true;
};

// 编辑报表配置
const handleEdit = (reportConfig: ReportConfig) => {
  currentReportConfig.value = { ...reportConfig };
  dialogVisible.value = true;
};

// 保存报表配置
const handleSave = async (reportConfig: ReportConfig) => {
  saveLoading.value = true;
  try {
    if (reportConfig.uuid) {
      // 更新 - 构造表单数据（API层会处理数组到字符串的转换）
      const updateData: ReportConfigFormData = {
        uuid: reportConfig.uuid,
        reportType: reportConfig.reportType,
        reportName: reportConfig.reportName,
        cronExpression: reportConfig.cronExpression,
        recipientEmailsArray: reportConfig.recipientEmailsArray || [],
        projectCodes: reportConfig.projectCodes || [],
        isEnabled: reportConfig.isEnabled,
        ...(reportConfig.description ? { description: reportConfig.description } : {}),
      };
      await reportConfigApi.updateReportConfig(updateData);
      Notify.create({
        type: 'positive',
        message: t('reportConfig.message.updateSuccess'),
      });
    } else {
      // 创建 - 构造表单数据（API层会处理数组到字符串的转换）
      const createData: ReportConfigFormData = {
        reportType: reportConfig.reportType,
        reportName: reportConfig.reportName,
        cronExpression: reportConfig.cronExpression,
        recipientEmailsArray: reportConfig.recipientEmailsArray || [],
        projectCodes: reportConfig.projectCodes || [],
        isEnabled: reportConfig.isEnabled,
        ...(reportConfig.description ? { description: reportConfig.description } : {}),
      };
      await reportConfigApi.createReportConfig(createData);
      Notify.create({
        type: 'positive',
        message: t('reportConfig.message.createSuccess'),
      });
    }

    dialogVisible.value = false;
    void loadReportConfigs();
  } catch (error) {
    console.error('Save report config error:', error);
  } finally {
    saveLoading.value = false;
  }
};

// 删除确认
const handleDeleteConfirm = (reportConfig: ReportConfig) => {
  $q.dialog({
    title: t('reportConfig.message.deleteTitle'),
    message: t('reportConfig.message.deleteConfirm'),
    ok: {
      label: t('reportConfig.delete'),
      color: 'negative',
    },
    cancel: {
      label: t('reportConfig.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleDelete(reportConfig);
  });
};

// 删除报表配置
const handleDelete = async (reportConfig: ReportConfig) => {
  if (!reportConfig.uuid) return;

  try {
    await reportConfigApi.deleteReportConfig(reportConfig.uuid);
    Notify.create({
      type: 'positive',
      message: t('reportConfig.message.deleteSuccess'),
    });
    void loadReportConfigs();
  } catch (error) {
    console.error('Delete report config error:', error);
  }
};

// 切换启用状态确认
const handleToggleConfirm = (reportConfig: ReportConfig) => {
  const message = reportConfig.isEnabled
    ? t('reportConfig.message.disableConfirm')
    : t('reportConfig.message.enableConfirm');

  $q.dialog({
    title: t('common.confirm'),
    message,
    ok: {
      label: t('common.confirm'),
      color: 'primary',
    },
    cancel: {
      label: t('reportConfig.cancel'),
      flat: true,
    },
  }).onOk(() => {
    void handleToggle(reportConfig);
  });
};

// 切换启用状态
const handleToggle = async (reportConfig: ReportConfig) => {
  if (!reportConfig.uuid) return;

  try {
    await reportConfigApi.toggleReportConfig(reportConfig.uuid, !reportConfig.isEnabled);
    Notify.create({
      type: 'positive',
      message: t('reportConfig.message.toggleSuccess'),
    });
    void loadReportConfigs();
  } catch (error) {
    console.error('Toggle report config error:', error);
  }
};

// 页面加载时获取报表配置列表
onMounted(() => {
  void loadReportConfigs();
});
</script>

<style scoped lang="scss">
.report-config-management {
  width: 100%;
  margin: 0 auto;
}
</style>
