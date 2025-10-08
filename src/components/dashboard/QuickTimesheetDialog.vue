<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 700px; max-width: 900px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ $t('dashboard.quickTimesheet.title') }} - {{ formatDate(date) }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- 如果有工时记录，显示列表 -->
        <div v-if="timesheets.length > 0">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1">
              {{ $t('dashboard.quickTimesheet.totalHours') }}: 
              <span class="text-primary text-weight-bold">{{ totalHours }}</span> 
              {{ $t('dashboard.quickTimesheet.hours') }}
            </div>
            <q-btn 
              color="primary" 
              icon="add" 
              :label="$t('dashboard.quickTimesheet.createTimesheet')"
              @click="handleCreate"
            />
          </div>

          <!-- 工时记录列表 -->
          <div class="timesheet-list q-gutter-sm">
            <q-card 
              v-for="timesheet in timesheets" 
              :key="timesheet.uuid || timesheet.timesheetCode || ''"
              flat
              bordered
              class="timesheet-item"
            >
              <q-card-section class="q-pa-md">
                <div class="row items-start">
                  <div class="col">
                    <div class="row items-center q-mb-xs">
                      <q-badge 
                        :color="getStatusColor(timesheet.status)" 
                        :label="getStatusText(timesheet.status)"
                        class="q-mr-sm"
                      />
                      <span class="text-weight-medium">{{ timesheet.projectName }}</span>
                    </div>
                    <div class="text-body2 text-grey-8 q-mb-xs">
                      {{ timesheet.description }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ timesheet.hours }} {{ $t('timesheet.hours') }}
                    </div>
                  </div>
                  <div class="col-auto q-ml-md">
                    <div class="row q-gutter-xs">
                      <!-- 查看详情 -->
                      <q-btn
                        flat
                        dense
                        round
                        color="info"
                        icon="visibility"
                        size="sm"
                        @click="handleViewDetail(timesheet)"
                      >
                        <q-tooltip>{{ $t('timesheet.viewDetail') }}</q-tooltip>
                      </q-btn>

                      <!-- 编辑（仅草稿状态） -->
                      <q-btn
                        v-if="timesheet.status === 1"
                        flat
                        dense
                        round
                        color="primary"
                        icon="edit"
                        size="sm"
                        @click="handleEdit(timesheet)"
                      >
                        <q-tooltip>{{ $t('timesheet.edit') }}</q-tooltip>
                      </q-btn>

                      <!-- 删除（仅草稿状态） -->
                      <q-btn
                        v-if="timesheet.status === 1"
                        flat
                        dense
                        round
                        color="negative"
                        icon="delete"
                        size="sm"
                        @click="handleDelete(timesheet)"
                      >
                        <q-tooltip>{{ $t('timesheet.delete') }}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- 如果没有工时记录，显示空状态 -->
        <div v-else class="text-center q-py-xl">
          <q-icon name="event_busy" size="64px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7 q-mb-md">
            {{ $t('dashboard.quickTimesheet.noTimesheets') }}
          </div>
          <q-btn 
            color="primary" 
            icon="add" 
            :label="$t('dashboard.quickTimesheet.createTimesheet')"
            @click="handleCreate"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- 工时详情对话框 -->
  <timesheet-detail-dialog
    v-model="showDetailDialog"
    :timesheet="selectedTimesheet"
  />

  <!-- 工时编辑对话框 -->
  <timesheet-dialog
    v-model="showFormDialog"
    :timesheet="editingTimesheet"
    :initial-date="date"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import type { Timesheet, CreateTimesheetDto, UpdateTimesheetDto } from 'src/types/timesheet';
import { formatDate } from 'src/utils/date-formatter';
import { timesheetApi } from 'src/api/timesheet';
import TimesheetDetailDialog from 'src/components/timesheet/TimesheetDetailDialog.vue';
import TimesheetDialog from 'src/components/timesheet/TimesheetDialog.vue';

interface Props {
  modelValue: boolean;
  date: string;
  timesheets: Timesheet[];
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'refresh'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  date: '',
  timesheets: () => [],
});

const emit = defineEmits<Emits>();

const { t } = useI18n();
const $q = useQuasar();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 工时详情对话框
const showDetailDialog = ref(false);
const selectedTimesheet = ref<Timesheet | null>(null);

// 工时表单对话框
const showFormDialog = ref(false);
const editingTimesheet = ref<Timesheet | null>(null);

// 总工时
const totalHours = computed(() => {
  return props.timesheets.reduce((sum, t) => sum + t.hours, 0);
});

// 获取状态颜色
const getStatusColor = (status: number): string => {
  switch (status) {
    case 1:
      return 'grey';
    case 2:
      return 'warning';
    case 3:
      return 'positive';
    case 4:
      return 'negative';
    default:
      return 'grey';
  }
};

// 获取状态文本
const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return t('timesheet.statusOptions.draft');
    case 2:
      return t('timesheet.statusOptions.pendingReview');
    case 3:
      return t('timesheet.statusOptions.approved');
    case 4:
      return t('timesheet.statusOptions.rejected');
    default:
      return '';
  }
};

// 查看详情
const handleViewDetail = (timesheet: Timesheet) => {
  selectedTimesheet.value = timesheet;
  showDetailDialog.value = true;
};

// 新建工时
const handleCreate = () => {
  editingTimesheet.value = null;
  showFormDialog.value = true;
};

// 编辑工时
const handleEdit = (timesheet: Timesheet) => {
  editingTimesheet.value = timesheet;
  showFormDialog.value = true;
};

// 删除工时
const handleDelete = (timesheet: Timesheet) => {
  $q.dialog({
    title: t('timesheet.delete'),
    message: t('timesheet.message.deleteConfirm'),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        const response = await timesheetApi.deleteTimesheet(timesheet.uuid!);
        if (response.code === 200) {
          $q.notify({
            type: 'positive',
            message: t('timesheet.message.deleteSuccess'),
          });
          emit('refresh');
        }
      } catch (error) {
        console.error('Delete timesheet error:', error);
        $q.notify({
          type: 'negative',
          message: t('failed'),
        });
      }
    })();
  });
};

// 保存工时
const handleSave = async (data: CreateTimesheetDto | UpdateTimesheetDto) => {
  try {
    if ('uuid' in data && data.uuid) {
      // 编辑模式
      await timesheetApi.updateTimesheet(data);
    } else {
      // 新建模式
      await timesheetApi.createTimesheet(data as CreateTimesheetDto);
    }
    $q.notify({
      type: 'positive',
      message: t('timesheet.message.saveSuccess'),
    });
    showFormDialog.value = false;
    emit('refresh');
  } catch (error) {
    console.error('Save timesheet error:', error);
    $q.notify({
      type: 'negative',
      message: t('failed'),
    });
  }
};
</script>

<style scoped lang="scss">
.timesheet-list {
  max-height: 400px;
  overflow-y: auto;
}

.timesheet-item {
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
