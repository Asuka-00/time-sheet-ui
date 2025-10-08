export default {
  projectManagement: 'Project Management',
  projectName: 'Project Name',
  projectCode: 'Project Code',
  description: 'Description',
  manager: 'Project Manager',
  startDate: 'Start Date',
  endDate: 'End Date',
  status: 'Status',
  memberCount: 'Members',
  members: 'Project Members',
  createdAt: 'Created At',
  createdBy: 'Created By',
  updatedAt: 'Updated At',
  updatedBy: 'Updated By',
  
  // Project status
  statusOptions: {
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  
  // Buttons
  create: 'New Project',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search',
  reset: 'Reset',
  refresh: 'Refresh',
  manageMembers: 'Manage Members',
  addMember: 'Add Member',
  removeMember: 'Remove',
  close: 'Close',
  
  // Form titles
  formTitle: {
    create: 'Create Project',
    edit: 'Edit Project',
    members: 'Project Members Management',
  },
  
  // Placeholders
  placeholder: {
    projectCode: 'Please enter project code',
    projectName: 'Please enter project name',
    description: 'Please enter project description',
    manager: 'Please select project manager',
    startDate: 'Please select start date',
    endDate: 'Please select end date',
    status: 'Please select project status',
    searchKey: 'Search by code or name',
    selectUser: 'Please select user',
    memberRole: 'Please enter member role (e.g., Developer, Tester, Designer)',
    joinDate: 'Please select join date',
  },
  
  // Validation
  validation: {
    projectCodeRequired: 'Project code is required',
    projectCodeLength: 'Project code must be between 2 and 50 characters',
    projectNameRequired: 'Project name is required',
    projectNameLength: 'Project name must be between 2 and 100 characters',
    descriptionLength: 'Description must not exceed 500 characters',
    managerRequired: 'Project manager is required',
    startDateRequired: 'Start date is required',
    endDateRequired: 'End date is required',
    endDateAfterStart: 'End date must be after start date',
    userRequired: 'User is required',
  },
  
  // Messages
  message: {
    createSuccess: 'Project created successfully',
    updateSuccess: 'Project updated successfully',
    deleteSuccess: 'Project deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this project?',
    deleteWarning: 'Deleting this project will also remove all member records. This action cannot be undone.',
    addMemberSuccess: 'Member added successfully',
    removeMemberSuccess: 'Member removed successfully',
    removeMemberConfirm: 'Are you sure you want to remove this member?',
    noMembers: 'No project members',
    loadingMembers: 'Loading members...',
    loadingUsers: 'Loading users...',
  },
  
  // Table columns
  table: {
    projectCode: 'Code',
    projectName: 'Name',
    description: 'Description',
    manager: 'Manager',
    memberCount: 'Members',
    status: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    createdAt: 'Created At',
    actions: 'Actions',
  },
  
  // Member table
  memberTable: {
    userName: 'Name',
    email: 'Email',
    role: 'Role',
    joinDate: 'Join Date',
    actions: 'Actions',
  },
};
