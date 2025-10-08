export default {
  projectManagement: '项目管理',
  projectName: '项目名称',
  projectCode: '项目编码',
  description: '项目描述',
  manager: '项目经理',
  startDate: '开始日期',
  endDate: '结束日期',
  status: '项目状态',
  memberCount: '成员数量',
  members: '项目成员',
  createdAt: '创建时间',
  createdBy: '创建人',
  updatedAt: '更新时间',
  updatedBy: '更新人',
  
  // 项目状态
  statusOptions: {
    inProgress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  },
  
  // 按钮
  create: '新建项目',
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  reset: '重置',
  refresh: '刷新',
  manageMembers: '成员管理',
  addMember: '添加成员',
  removeMember: '移除',
  close: '关闭',
  
  // 表单标题
  formTitle: {
    create: '创建项目',
    edit: '编辑项目',
    members: '项目成员管理',
  },
  
  // 占位符
  placeholder: {
    projectCode: '请输入项目编码',
    projectName: '请输入项目名称',
    description: '请输入项目描述',
    manager: '请选择项目经理',
    startDate: '请选择开始日期',
    endDate: '请选择结束日期',
    status: '请选择项目状态',
    searchKey: '按项目编码或名称搜索',
    selectUser: '请选择用户',
    memberRole: '请输入成员角色（如：开发、测试、设计等）',
    joinDate: '请选择加入日期',
  },
  
  // 验证
  validation: {
    projectCodeRequired: '项目编码不能为空',
    projectCodeLength: '项目编码长度必须在2到50个字符之间',
    projectNameRequired: '项目名称不能为空',
    projectNameLength: '项目名称长度必须在2到100个字符之间',
    descriptionLength: '项目描述不能超过500个字符',
    managerRequired: '项目经理不能为空',
    startDateRequired: '开始日期不能为空',
    endDateRequired: '结束日期不能为空',
    endDateAfterStart: '结束日期必须在开始日期之后',
    userRequired: '用户不能为空',
  },
  
  // 消息
  message: {
    createSuccess: '项目创建成功',
    updateSuccess: '项目更新成功',
    deleteSuccess: '项目删除成功',
    deleteConfirm: '确定要删除该项目吗？',
    deleteWarning: '删除该项目将同时删除所有项目成员记录，此操作不可撤销。',
    addMemberSuccess: '成员添加成功',
    removeMemberSuccess: '成员移除成功',
    removeMemberConfirm: '确定要移除该成员吗？',
    noMembers: '暂无项目成员',
    loadingMembers: '加载成员数据...',
    loadingUsers: '加载用户数据...',
  },
  
  // 表格列
  table: {
    projectCode: '项目编码',
    projectName: '项目名称',
    description: '描述',
    manager: '项目经理',
    memberCount: '成员数',
    status: '状态',
    startDate: '开始日期',
    endDate: '结束日期',
    createdAt: '创建时间',
    actions: '操作',
  },
  
  // 成员表格
  memberTable: {
    userName: '成员姓名',
    email: '邮箱',
    role: '角色',
    joinDate: '加入日期',
    actions: '操作',
  },
};
