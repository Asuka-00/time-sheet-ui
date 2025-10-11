// 报表配置管理模块中文翻译
export default {
  // 页面标题
  reportConfigManagement: '报表配置管理',

  // 表格列
  reportType: '报表类型',
  reportName: '报表名称',
  cronExpression: 'Cron表达式',
  recipientEmails: '接收邮箱',
  filterConditions: '筛选条件',
  projectCodes: '项目编号',
  isEnabled: '启用状态',
  description: '描述',
  createdAt: '创建时间',
  createdBy: '创建人',
  updatedAt: '更新时间',
  updatedBy: '更新人',

  // 状态值
  statusEnabled: '已启用',
  statusDisabled: '已禁用',

  // 操作按钮
  actions: '操作',
  create: '新建配置',
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  reset: '重置',
  enable: '启用',
  disable: '禁用',

  // 表单标题
  formTitle: {
    create: '创建报表配置',
    edit: '编辑报表配置',
  },

  // 表单提示
  placeholder: {
    reportType: '请输入报表类型（如：MONTHLY_PROJECT_SUMMARY）',
    reportName: '请输入报表名称',
    cronExpression: '请输入Cron表达式（如：0 0 9 1 * *）',
    recipientEmails: '请输入或选择接收邮箱',
    filterConditions: '请输入筛选条件',
    projectCodes: '请输入或选择项目编号（如：P001）',
    description: '请输入配置描述',
    searchKey: '请输入报表名称或描述',
  },

  // 表单验证
  validation: {
    reportTypeRequired: '报表类型不能为空',
    reportNameRequired: '报表名称不能为空',
    cronExpressionRequired: 'Cron表达式不能为空',
    recipientEmailsRequired: '接收邮箱不能为空',
    emailFormat: '邮箱格式不正确',
    atLeastOneEmail: '至少需要一个接收邮箱',
  },

  // 操作提示
  message: {
    deleteConfirm: '确认删除该报表配置吗？',
    deleteTitle: '删除确认',
    deleteWarning: '删除后将无法恢复，请谨慎操作',
    enableConfirm: '确认启用该报表配置吗？',
    disableConfirm: '确认禁用该报表配置吗？',
    createSuccess: '创建报表配置成功',
    updateSuccess: '更新报表配置成功',
    deleteSuccess: '删除报表配置成功',
    toggleSuccess: '状态切换成功',
    createFailed: '创建报表配置失败',
    updateFailed: '更新报表配置失败',
    deleteFailed: '删除报表配置失败',
    toggleFailed: '状态切换失败',
    loadFailed: '加载报表配置列表失败',
    loadProjectsFailed: '加载项目列表失败',
  },

  // 无数据提示
  noProjectsFound: '未找到匹配的项目',

  // 提示信息
  hints: {
    cronExpression: 'Cron表达式示例：0 0 9 1 * * 表示每月1号上午9点执行',
    filterConditions: '筛选条件',
    projectCodes: '可以添加多个项目编号，用于筛选报表数据。留空表示包含所有项目',
    reportTypeUnique: '报表类型需要唯一，创建后不可修改',
  },
};
