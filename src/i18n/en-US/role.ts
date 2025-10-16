export default {
  roleManagement: 'Role Management',
  roleName: 'Role Name',
  description: 'Description',
  dataScope: 'Data Scope',
  dataScopeAll: 'All Projects',
  permissions: 'Permissions',
  createdAt: 'Created At',
  createdBy: 'Created By',
  updatedAt: 'Updated At',
  updatedBy: 'Updated By',
  
  // Buttons
  create: 'New Role',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search',
  reset: 'Reset',
  selectPermissions: 'Select Permissions',
  
  // Form titles
  formTitle: {
    create: 'Create Role',
    edit: 'Edit Role',
  },
  
  // Placeholders
  placeholder: {
    roleName: 'Please enter role name',
    description: 'Please enter role description',
    dataScope: 'Please select data scope',
    searchKey: 'Search by role name',
    selectPermissions: 'Please select permissions',
  },
  
  // Validation
  validation: {
    roleNameRequired: 'Role name is required',
    roleNameLength: 'Role name must be between 2 and 50 characters',
    descriptionRequired: 'Description is required',
    descriptionLength: 'Description must not exceed 200 characters',
  },
  
  // Messages
  message: {
    createSuccess: 'Role created successfully',
    updateSuccess: 'Role updated successfully',
    deleteSuccess: 'Role deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this role?',
    deleteWarning: 'Deleting this role will also remove all associated permission assignments. This action cannot be undone.',
  },
  
  // Table columns
  table: {
    roleName: 'Role Name',
    description: 'Description',
    dataScope: 'Data Scope',
    createdAt: 'Created At',
    actions: 'Actions',
  },
};
