export default {
  // 页面标题
  myTimesheets: '我的工时表',
  timesheetReview: '工时审核',
  timesheetStatistics: '工时统计',
  timesheetManagement: '工时管理',
  projectManagerTimesheets: '项目工时管理',

  // 字段标签
  timesheetCode: '工时编码',
  userCode: '用户编码',
  userName: '姓名',
  projectCode: '项目编码',
  projectName: '项目名称',
  workDate: '工作日期',
  hours: '工时（小时）',
  description: '工作描述',
  status: '状态',
  submitDate: '提交日期',
  reviewerUserName: '审核人',
  reviewDate: '审核日期',
  reviewComment: '审核意见',
  createdAt: '创建时间',
  updatedAt: '更新时间',

  // 状态选项
  statusOptions: {
    draft: '草稿',
    pendingReview: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    all: '全部',
  },

  // 按钮
  create: '新建工时',
  batchCreate: '批量新增',
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  reset: '重置',
  submit: '提交审核',
  batchSubmit: '批量提交',
  withdraw: '撤回',
  approve: '通过',
  reject: '驳回',
  batchApprove: '批量通过',
  batchReject: '批量驳回',
  viewDetail: '查看详情',
  export: '导出',
  close: '关闭',
  confirm: '确认',

  // 表单标题
  formTitle: {
    create: '新建工时记录',
    edit: '编辑工时记录',
    review: '审核工时记录',
    detail: '工时详情',
  },

  // 批量新增表单
  batchCreateForm: {
    title: '批量新增工时',
    addRow: '添加新行',
    copyRow: '复制行',
    removeRow: '删除行',
  },

  // 占位符
  placeholder: {
    projectCode: '请选择项目',
    workDate: '请选择工作日期',
    hours: '请输入工时（0.5-24）',
    description: '请详细描述您的工作内容',
    reviewComment: '请输入审核意见',
    searchKey: '搜索项目或描述',
    selectProject: '请选择项目',
    selectStatus: '请选择状态',
    selectDateRange: '选择日期范围',
    startDate: '开始日期',
    endDate: '结束日期',
    selectUser: '请选择用户',
  },

  // 验证消息
  validation: {
    projectCodeRequired: '项目不能为空',
    workDateRequired: '工作日期不能为空',
    workDateFuture: '不能选择未来日期',
    workDateHoliday: '不能选择节假日',
    hoursRequired: '工时不能为空',
    hoursRange: '工时必须在0.5-24小时之间',
    hoursNumber: '工时必须为数字',
    descriptionRequired: '工作描述不能为空',
    descriptionMinLength: '工作描述至少需要10个字符',
    reviewCommentRequired: '驳回时必须填写审核意见',
    atLeastOneRow: '至少需要一条工时记录',
    formError: '请检查表单填写是否完整',
    duplicateProjectDate: '该项目在此日期已有工时记录',
    hasDuplicateRows: '存在 {count} 行重复的项目+日期组合',
  },

  // 提示消息
  message: {
    createSuccess: '工时记录创建成功',
    updateSuccess: '工时记录更新成功',
    deleteSuccess: '工时记录删除成功',
    saveSuccess: '工时记录保存成功',
    deleteConfirm: '确定要删除该工时记录吗？',
    deleteWarning: '此操作不可撤销',
    submitSuccess: '工时提交成功',
    batchSubmitSuccess: '批量提交成功',
    batchCreateSuccess: '批量创建成功：{success}条成功，{failed}条失败',
    batchCreateError: '批量创建失败',
    withdrawSuccess: '撤回成功',
    reviewSuccess: '审核完成',
    approveConfirm: '确定要通过该工时记录吗？',
    rejectConfirm: '确定要驳回该工时记录吗？',
    batchApproveConfirm: '确定要批量通过选中的工时记录吗？',
    batchRejectConfirm: '确定要批量驳回选中的工时记录吗？',
    selectAtLeastOne: '请至少选择一条记录',
    onlyDraftCanEdit: '只能编辑草稿状态的工时记录',
    onlyDraftCanDelete: '只能删除草稿状态的工时记录',
    onlyDraftCanSubmit: '只能提交草稿状态的工时记录',
    onlyPendingCanWithdraw: '只能撤回待审核状态的工时记录',
    noData: '暂无数据',
    loading: '加载中...',
  },

  // 表格列
  table: {
    timesheetCode: '工时编码',
    projectName: '项目名称',
    userName: '姓名',
    workDate: '工作日期',
    hours: '工时',
    description: '工作描述',
    status: '状态',
    submitDate: '提交日期',
    reviewerUserName: '审核人',
    reviewDate: '审核日期',
    createdAt: '创建时间',
    actions: '操作',
  },

  // 统计相关
  statistics: {
    totalHours: '总工时',
    totalRecords: '总记录数',
    approvalRate: '通过率',
    byProject: '按项目统计',
    byStatus: '按状态统计',
    byDate: '工时趋势',
    projectName: '项目名称',
    hoursCount: '工时数',
    recordCount: '记录数',
    percentage: '占比',
    chartType: '图表类型',
    pie: '饼图',
    bar: '柱状图',
    line: '折线图',
    timeRange: '时间范围',
    last7Days: '最近7天',
    last30Days: '最近30天',
    last90Days: '最近90天',
    custom: '自定义',
  },

  // 筛选器
  filter: {
    title: '筛选条件',
    project: '项目',
    status: '状态',
    dateRange: '日期范围',
    user: '用户',
    allProjects: '全部项目',
    allStatus: '全部状态',
  },

  // 批量操作
  batch: {
    selected: '已选择',
    items: '项',
    clear: '清除选择',
  },

  // 审核相关
  review: {
    approveTitle: '通过工时记录',
    rejectTitle: '驳回工时记录',
    approveMessage: '确认通过该工时记录？',
    rejectMessage: '确认驳回该工时记录？请填写驳回理由。',
    batchApproveMessage: '确认批量通过选中的 {count} 条工时记录？',
    batchRejectMessage: '确认批量驳回选中的 {count} 条工时记录？',
    pendingCount: '待审核',
  },
};
