// 部门管理模块中文翻译
export default {
  // 页面标题
  departmentManagement: '部门管理',
  
  // 表格列
  name: '部门名称',
  description: '部门描述',
  parentDepartmentName: '上级部门',
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
  create: '新建部门',
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  reset: '重置',
  
  // 表单标题
  formTitle: {
    create: '创建部门',
    edit: '编辑部门',
  },
  
  // 表单提示
  placeholder: {
    name: '请输入部门名称',
    description: '请输入部门描述',
    parentDepartmentName: '请选择上级部门',
    searchKey: '请输入部门名称或描述',
  },
  
  // 表单验证
  validation: {
    nameRequired: '部门名称不能为空',
    descriptionRequired: '部门描述不能为空',
  },
  
  // 操作提示
  message: {
    deleteConfirm: '确认删除该部门吗？此操作不可恢复！',
    deleteTitle: '删除确认',
    deleteWarning: '删除后将无法恢复，请谨慎操作',
    createSuccess: '创建部门成功',
    updateSuccess: '更新部门成功',
    deleteSuccess: '删除部门成功',
    createFailed: '创建部门失败',
    updateFailed: '更新部门失败',
    deleteFailed: '删除部门失败',
    loadFailed: '加载部门列表失败',
  },
};

