// 报表配置管理模块中文翻译
export default {
  // 页面标题
  reportConfigManagement: '报表配置管理',

  // 表格列
  reportName: '报表名称',
  cronExpression: 'Cron表达式',
  scheduleConfig: '定时配置',
  recipientEmails: '接收邮箱',
  ccEmails: '抄送邮箱',
  filterConditions: '筛选条件',
  projectCodes: '项目编号',
  monthOffset: '目标月份',
  isEnabled: '启用状态',

  // 调度配置
  useAdvancedCron: '高级模式（直接输入CRON表达式）',
  frequency: '执行频率',
  dayOfMonth: '执行日期（每月）',
  dayOfWeek: '执行星期',
  hour: '小时',
  minute: '分钟',
  generatedCron: '生成的CRON表达式',
  dayLabel: '{day}号',
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
  test: '测试执行',
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
    reportName: '请输入报表名称',
    cronExpression: '请输入Cron表达式（如：0 0 9 1 * *）',
    recipientEmails: '请输入或选择接收邮箱',
    ccEmails: '请输入或选择抄送邮箱（可选）',
    filterConditions: '请输入筛选条件',
    projectCodes: '请输入或选择项目编号（如：P001）',
    monthOffset: '请选择目标月份',
    description: '请输入配置描述',
    searchKey: '请输入报表名称或描述',
  },

  // 表单验证
  validation: {
    reportNameRequired: '报表名称不能为空',
    cronExpressionRequired: 'Cron表达式不能为空',
    recipientEmailsRequired: '接收邮箱不能为空',
    emailFormat: '邮箱格式不正确',
    atLeastOneEmail: '至少需要一个接收邮箱',
    monthOffsetRequired: '目标月份不能为空',
  },

  // 操作提示
  message: {
    deleteConfirm: '确认删除该报表配置吗？',
    deleteTitle: '删除确认',
    deleteWarning: '删除后将无法恢复，请谨慎操作',
    enableConfirm: '确认启用该报表配置吗？',
    disableConfirm: '确认禁用该报表配置吗？',
    testConfirm: '确认立即执行该报表任务吗？将根据配置生成报表并发送邮件。',
    testTitle: '测试执行确认',
    testExecuting: '正在生成并发送报表，请稍候...',
    createSuccess: '创建报表配置成功',
    updateSuccess: '更新报表配置成功',
    deleteSuccess: '删除报表配置成功',
    toggleSuccess: '状态切换成功',
    testSuccess: '报表任务执行成功，请查收邮件',
    createFailed: '创建报表配置失败',
    updateFailed: '更新报表配置失败',
    deleteFailed: '删除报表配置失败',
    toggleFailed: '状态切换失败',
    testFailed: '报表任务执行失败',
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
    ccEmails: '抄送邮箱为可选项，可以添加多个邮箱地址',
    monthOffset: '选择报表数据的目标月份，0表示当月，-1表示上月，依此类推',
  },

  // 月份偏移量选项
  monthOffsetOptions: {
    currentMonth: '当月',
    lastMonth: '上月',
    twoMonthsAgo: '上上月',
    threeMonthsAgo: '三个月前',
    fourMonthsAgo: '四个月前',
    fiveMonthsAgo: '五个月前',
    sixMonthsAgo: '六个月前',
  },

  // 月份单位
  monthsAgo: '个月前',

  // 频率选项
  frequencyOptions: {
    daily: '每天',
    weekly: '每周',
    monthly: '每月',
  },

  // 星期选项
  weekDays: {
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
  },

  // CRON描述
  cronDescription: {
    daily: '每天 {time} 执行',
    weekly: '每周{day} {time} 执行',
    monthly: '每月{day}号 {time} 执行',
  },
};
