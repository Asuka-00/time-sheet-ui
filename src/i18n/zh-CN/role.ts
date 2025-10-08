export default {
  roleManagement: '角色管理',
  roleName: '角色名称',
  description: '角色描述',
  permissions: '权限',
  createdAt: '创建时间',
  createdBy: '创建人',
  updatedAt: '更新时间',
  updatedBy: '更新人',
  
  // 按钮
  create: '新建角色',
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  reset: '重置',
  selectPermissions: '选择权限',
  
  // 表单标题
  formTitle: {
    create: '创建角色',
    edit: '编辑角色',
  },
  
  // 占位符
  placeholder: {
    roleName: '请输入角色名称',
    description: '请输入角色描述',
    searchKey: '按角色名称搜索',
    selectPermissions: '请选择权限',
  },
  
  // 验证
  validation: {
    roleNameRequired: '角色名称不能为空',
    roleNameLength: '角色名称长度必须在2到50个字符之间',
    descriptionRequired: '角色描述不能为空',
    descriptionLength: '角色描述不能超过200个字符',
  },
  
  // 消息
  message: {
    createSuccess: '角色创建成功',
    updateSuccess: '角色更新成功',
    deleteSuccess: '角色删除成功',
    deleteConfirm: '确定要删除该角色吗？',
    deleteWarning: '删除该角色将同时删除所有关联的权限分配，此操作不可撤销。',
  },
  
  // 表格列
  table: {
    roleName: '角色名称',
    description: '角色描述',
    createdAt: '创建时间',
    actions: '操作',
  },
};
