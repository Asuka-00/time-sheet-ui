// Report Configuration Management Module English Translation
export default {
  // Page Title
  reportConfigManagement: 'Report Configuration Management',

  // Table Columns
  reportType: 'Report Type',
  reportName: 'Report Name',
  cronExpression: 'Cron Expression',
  recipientEmails: 'Recipient Emails',
  filterConditions: 'Filter Conditions',
  projectCodes: 'Project Codes',
  isEnabled: 'Status',
  description: 'Description',
  createdAt: 'Created At',
  createdBy: 'Created By',
  updatedAt: 'Updated At',
  updatedBy: 'Updated By',

  // Status Values
  statusEnabled: 'Enabled',
  statusDisabled: 'Disabled',

  // Action Buttons
  actions: 'Actions',
  create: 'New Configuration',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search',
  reset: 'Reset',
  enable: 'Enable',
  disable: 'Disable',

  // Form Titles
  formTitle: {
    create: 'Create Report Configuration',
    edit: 'Edit Report Configuration',
  },

  // Form Placeholders
  placeholder: {
    reportType: 'Enter report type (e.g., MONTHLY_PROJECT_SUMMARY)',
    reportName: 'Enter report name',
    cronExpression: 'Enter cron expression (e.g., 0 0 9 1 * *)',
    recipientEmails: 'Enter or select recipient emails',
    filterConditions: 'Enter filter conditions',
    projectCodes: 'Enter or select project codes (e.g., P001)',
    description: 'Enter configuration description',
    searchKey: 'Enter report name or description',
  },

  // Form Validation
  validation: {
    reportTypeRequired: 'Report type is required',
    reportNameRequired: 'Report name is required',
    cronExpressionRequired: 'Cron expression is required',
    recipientEmailsRequired: 'Recipient emails are required',
    emailFormat: 'Invalid email format',
    atLeastOneEmail: 'At least one recipient email is required',
  },

  // Operation Messages
  message: {
    deleteConfirm: 'Are you sure you want to delete this report configuration?',
    deleteTitle: 'Delete Confirmation',
    deleteWarning: 'This action cannot be undone. Please proceed with caution.',
    enableConfirm: 'Are you sure you want to enable this report configuration?',
    disableConfirm: 'Are you sure you want to disable this report configuration?',
    createSuccess: 'Report configuration created successfully',
    updateSuccess: 'Report configuration updated successfully',
    deleteSuccess: 'Report configuration deleted successfully',
    toggleSuccess: 'Status toggled successfully',
    createFailed: 'Failed to create report configuration',
    updateFailed: 'Failed to update report configuration',
    deleteFailed: 'Failed to delete report configuration',
    toggleFailed: 'Failed to toggle status',
    loadFailed: 'Failed to load report configuration list',
    loadProjectsFailed: 'Failed to load project list',
  },

  // No Data Messages
  noProjectsFound: 'No matching projects found',

  // Hints
  hints: {
    cronExpression:
      'Cron expression example: 0 0 9 1 * * means execute at 9:00 AM on the 1st of every month',
    filterConditions: 'Filter conditions',
    projectCodes:
      'You can add multiple project codes to filter report data. Leave empty to include all projects',
    reportTypeUnique: 'Report type must be unique and cannot be modified after creation',
  },
};
