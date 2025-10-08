// 权限管理模块中文翻译
export default {
  // 页面标题
  permissionManagement: '权限管理',
  
  // 表格列
  name: '权限名称',
  menuName: '菜单显示名称',
  code: '权限代码',
  module: '所属模块',
  type: '权限类型',
  description: '描述',
  status: '状态',
  parentCode: '父级代码',
  path: '路由路径',
  icon: '图标',
  component: '组件路径',
  sort: '排序',
  createdAt: '创建时间',
  createdBy: '创建人',
  updatedAt: '更新时间',
  updatedBy: '更新人',
  
  // 状态值
  statusActive: '启用',
  statusInactive: '禁用',
  
  // 权限类型
  typeMenu: '菜单',
  typeButton: '按钮',
  typeApi: '接口',
  
  // 操作按钮
  actions: '操作',
  create: '新建权限',
  edit: '编辑',
  delete: '删除',
  search: '搜索',
  reset: '重置',
  save: '保存',
  cancel: '取消',
  confirm: '确认',
  
  // 表单标签
  formTitle: {
    create: '新建权限',
    edit: '编辑权限',
  },
  
  // 表单提示
  placeholder: {
    name: '请输入权限名称',
    menuName: '请输入菜单显示名称（可选）',
    code: '请输入权限代码',
    module: '请输入所属模块',
    type: '请选择权限类型',
    description: '请输入权限描述',
    parentCode: '请输入父级权限代码',
    path: '请输入路由路径',
    icon: '请输入图标名称',
    component: '请输入组件路径',
    sort: '请输入排序值',
    searchKey: '请输入权限名称或代码',
  },
  
  // 字段提示
  hint: {
    menuName: '用于在菜单中显示，如不填写则使用权限名称',
  },
  
  // 表单验证
  validation: {
    nameRequired: '权限名称不能为空',
    codeRequired: '权限代码不能为空',
    moduleRequired: '所属模块不能为空',
    descriptionRequired: '权限描述不能为空',
    sortInvalid: '排序值必须为数字',
  },
  
  // 操作提示
  message: {
    deleteConfirm: '确认删除该权限吗？此操作不可恢复！',
    deleteTitle: '删除确认',
    createSuccess: '创建权限成功',
    updateSuccess: '更新权限成功',
    deleteSuccess: '删除权限成功',
    createFailed: '创建权限失败',
    updateFailed: '更新权限失败',
    deleteFailed: '删除权限失败',
    loadFailed: '加载权限列表失败',
  },
  
  // 分页
  pagination: {
    total: '共',
    items: '条',
    rowsPerPage: '每页显示',
  },
};
