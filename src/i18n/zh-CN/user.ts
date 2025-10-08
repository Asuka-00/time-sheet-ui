// 用户管理模块中文翻译
export default {
  // 页面标题
  userManagement: '用户管理',
  
  // 表格列
  userCode: '用户代码',
  userName: '用户名称',
  email: '邮箱',
  phoneNumber: '手机号',
  password: '密码',
  roleName: '角色',
  departmentName: '部门',
  timezone: '时区',
  status: '状态',
  createdAt: '创建时间',
  createdBy: '创建人',
  updatedAt: '更新时间',
  updatedBy: '更新人',
  
  // 状态值
  statusActive: '启用',
  statusInactive: '禁用',
  
  // 操作按钮
  actions: '操作',
  create: '新建用户',
  edit: '编辑',
  delete: '删除',
  resetPassword: '重置密码',
  search: '搜索',
  reset: '重置',
  save: '保存',
  cancel: '取消',
  confirm: '确认',
  
  // 表单标签
  formTitle: {
    create: '新建用户',
    edit: '编辑用户',
    resetPassword: '重置用户密码',
  },
  
  // 表单提示
  placeholder: {
    userCode: '请输入用户代码',
    userName: '请输入用户名称',
    email: '请输入邮箱',
    phoneNumber: '请输入手机号',
    password: '请输入密码',
    newPassword: '请输入新密码',
    confirmPassword: '请再次输入新密码',
    roleName: '请选择角色',
    departmentName: '请选择部门',
    timezone: '请选择时区',
    searchKey: '请输入用户代码或用户名称',
  },
  
  // 表单验证
  validation: {
    userCodeRequired: '用户代码不能为空',
    userNameRequired: '用户名称不能为空',
    emailRequired: '邮箱不能为空',
    emailInvalid: '请输入有效的邮箱地址',
    phoneRequired: '手机号不能为空',
    phoneInvalid: '请输入有效的手机号',
    passwordRequired: '密码不能为空',
    passwordMinLength: '密码长度至少6位',
    newPasswordRequired: '新密码不能为空',
    newPasswordMinLength: '新密码长度至少6位',
    confirmPasswordRequired: '确认密码不能为空',
    passwordMismatch: '两次输入的密码不一致',
    roleRequired: '角色不能为空',
    departmentRequired: '部门不能为空',
  },
  
  // 操作提示
  message: {
    deleteConfirm: '确认删除该用户吗？此操作不可恢复！',
    deleteTitle: '删除确认',
    deleteWarning: '删除后将无法恢复，请谨慎操作',
    resetPasswordConfirm: '确认重置该用户的密码吗？',
    createSuccess: '创建用户成功',
    updateSuccess: '更新用户成功',
    deleteSuccess: '删除用户成功',
    resetPasswordSuccess: '重置密码成功',
    createFailed: '创建用户失败',
    updateFailed: '更新用户失败',
    deleteFailed: '删除用户失败',
    resetPasswordFailed: '重置密码失败',
    loadFailed: '加载用户列表失败',
  },
  
  // 分页
  pagination: {
    total: '共',
    items: '条',
    rowsPerPage: '每页显示',
  },

  // 时区
  timezones: {
    utc: 'UTC（协调世界时）',
    // 亚洲
    shanghai: 'Asia/Shanghai（中国标准时间）',
    tokyo: 'Asia/Tokyo（日本标准时间）',
    seoul: 'Asia/Seoul（韩国标准时间）',
    hongkong: 'Asia/Hong_Kong（香港时间）',
    taipei: 'Asia/Taipei（台北时间）',
    singapore: 'Asia/Singapore（新加坡时间）',
    bangkok: 'Asia/Bangkok（中南半岛时间）',
    dubai: 'Asia/Dubai（海湾标准时间）',
    kolkata: 'Asia/Kolkata（印度标准时间）',
    karachi: 'Asia/Karachi（巴基斯坦标准时间）',
    tashkent: 'Asia/Tashkent（乌兹别克斯坦时间）',
    // 欧洲
    london: 'Europe/London（格林威治标准时间）',
    paris: 'Europe/Paris（中欧时间）',
    berlin: 'Europe/Berlin（中欧时间）',
    rome: 'Europe/Rome（中欧时间）',
    madrid: 'Europe/Madrid（中欧时间）',
    amsterdam: 'Europe/Amsterdam（中欧时间）',
    moscow: 'Europe/Moscow（莫斯科标准时间）',
    istanbul: 'Europe/Istanbul（土耳其时间）',
    // 美洲
    newYork: 'America/New_York（美国东部时间）',
    chicago: 'America/Chicago（美国中部时间）',
    denver: 'America/Denver（美国山地时间）',
    losAngeles: 'America/Los_Angeles（美国太平洋时间）',
    toronto: 'America/Toronto（加拿大东部时间）',
    mexicoCity: 'America/Mexico_City（墨西哥中部标准时间）',
    saoPaulo: 'America/Sao_Paulo（巴西利亚时间）',
    buenosAires: 'America/Argentina/Buenos_Aires（阿根廷时间）',
    // 大洋洲
    sydney: 'Australia/Sydney（澳大利亚东部时间）',
    melbourne: 'Australia/Melbourne（澳大利亚东部时间）',
    auckland: 'Pacific/Auckland（新西兰时间）',
    // 非洲
    cairo: 'Africa/Cairo（东欧时间）',
    johannesburg: 'Africa/Johannesburg（南非标准时间）',
  },
};
