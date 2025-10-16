// Permission management module English translation
export default {
  // Page title
  permissionManagement: 'Permission Management',

  // Table columns
  name: 'Permission Name',
  menuName: 'Menu Display Name',
  code: 'Permission Code',
  module: 'Module',
  type: 'Type',
  description: 'Description',
  status: 'Status',
  parentCode: 'Parent Code',
  path: 'Route Path',
  icon: 'Icon',
  component: 'Component Path',
  sort: 'Sort',
  createdAt: 'Created At',
  createdBy: 'Created By',
  updatedAt: 'Updated At',
  updatedBy: 'Updated By',

  // Status values
  statusActive: 'Active',
  statusInactive: 'Inactive',

  // Permission types
  typeMenu: 'Menu',
  typeButton: 'Button',
  typeApi: 'API',

  // Action buttons
  actions: 'Actions',
  create: 'Create Permission',
  edit: 'Edit',
  delete: 'Delete',
  search: 'Search',
  reset: 'Reset',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',

  // Form labels
  formTitle: {
    create: 'Create Permission',
    edit: 'Edit Permission',
  },

  // Form placeholders
  placeholder: {
    name: 'Please enter permission name',
    menuName: 'Please enter menu display name (optional)',
    code: 'Please enter permission code',
    module: 'Please enter module',
    type: 'Please select permission type',
    description: 'Please enter description',
    parentCode: 'Please enter parent code',
    path: 'Please enter route path',
    icon: 'Please enter icon name',
    component: 'Please enter component path',
    sort: 'Please enter sort value',
    searchKey: 'Please enter permission name or code',
  },

  // Field hints
  hint: {
    menuName: 'Used for menu display, use permission name if not provided',
  },

  // Form validation
  validation: {
    nameRequired: 'Permission name is required',
    codeRequired: 'Permission code is required',
    moduleRequired: 'Module is required',
    descriptionRequired: 'Description is required',
    sortInvalid: 'Sort value must be a number',
  },

  // Operation messages
  message: {
    deleteConfirm: 'Are you sure to delete this permission? This action cannot be undone!',
    deleteTitle: 'Delete Confirmation',
    createSuccess: 'Permission created successfully',
    updateSuccess: 'Permission updated successfully',
    deleteSuccess: 'Permission deleted successfully',
    createFailed: 'Failed to create permission',
    updateFailed: 'Failed to update permission',
    deleteFailed: 'Failed to delete permission',
    loadFailed: 'Failed to load permission list',
  },

  // Pagination
  pagination: {
    total: 'Total',
    items: 'items',
    rowsPerPage: 'Rows per page',
  },

  // Menu names
  menus: {
    systemManagement: 'System Management',
    userManagement: 'User Management',
    permissionManagement: 'Permission Management',
    roleManagement: 'Role Management',
    departmentManagement: 'Department Management',
    reportConfigManagement: 'Report Configuration Management',
    projectManagement: 'Project Management',
    timesheetManagement: 'Timesheet Management',
    myTimesheets: 'My Timesheets',
    timesheetReview: 'Timesheet Review',
    projectManagerTimesheets: 'Project Manager Timesheets',
    timesheetStatistics: 'Timesheet Statistics',
  },

  // Button permissions
  buttons: {
    user: {
      create: 'Create User',
      edit: 'Edit User',
      delete: 'Delete User',
      resetPassword: 'Reset Password',
    },
    department: {
      create: 'Create Department',
      edit: 'Edit Department',
      delete: 'Delete Department',
    },
    permission: {
      create: 'Create Permission',
      edit: 'Edit Permission',
      delete: 'Delete Permission',
    },
    role: {
      create: 'Create Role',
      edit: 'Edit Role',
      delete: 'Delete Role',
    },
    project: {
      create: 'Create Project',
      edit: 'Edit Project',
      members: 'Manage Project Members',
      delete: 'Delete Project',
    },
    timesheet: {
      create: 'Create Timesheet',
      batchCreate: 'Batch Create Timesheet',
      edit: 'Edit Timesheet',
      delete: 'Delete Timesheet',
      submit: 'Submit Timesheet',
      withdraw: 'Withdraw Timesheet',
      batchSubmit: 'Batch Submit Timesheet',
    },
    timesheetReview: {
      approve: 'Approve Timesheet',
      reject: 'Reject Timesheet',
      batchApprove: 'Batch Approve Timesheet',
      batchReject: 'Batch Reject Timesheet',
    },
    reportConfig: {
      create: 'Create Report Config',
      edit: 'Edit Report Config',
      toggle: 'Toggle Report Config',
      delete: 'Delete Report Config',
    },
  },
};
