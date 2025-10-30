// Report Configuration Management Module English Translation
export default {
  // Page Title
  reportConfigManagement: 'Report Configuration Management',

  // Table Columns
  reportName: 'Report Name',
  cronExpression: 'Cron Expression',
  scheduleConfig: 'Schedule Configuration',
  recipientEmails: 'Recipient Emails',
  ccEmails: 'CC Emails',
  filterConditions: 'Filter Conditions',
  projectCodes: 'Project Codes',
  monthOffset: 'Target Month',
  isEnabled: 'Status',

  // Schedule Configuration
  useAdvancedCron: 'Advanced Mode (Direct CRON Input)',
  frequency: 'Frequency',
  dayOfMonth: 'Day of Month',
  dayOfWeek: 'Day of Week',
  hour: 'Hour',
  minute: 'Minute',
  generatedCron: 'Generated CRON Expression',
  dayLabel: 'Day {day}',
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
  test: 'Test Execute',
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
    reportName: 'Enter report name',
    cronExpression: 'Enter cron expression (e.g., 0 0 9 1 * *)',
    recipientEmails: 'Enter or select recipient emails',
    ccEmails: 'Enter or select CC emails (optional)',
    filterConditions: 'Enter filter conditions',
    projectCodes: 'Enter or select project codes (e.g., P001)',
    monthOffset: 'Select target month',
    description: 'Enter configuration description',
    searchKey: 'Enter report name or description',
  },

  // Form Validation
  validation: {
    reportNameRequired: 'Report name is required',
    cronExpressionRequired: 'Cron expression is required',
    recipientEmailsRequired: 'Recipient emails are required',
    emailFormat: 'Invalid email format',
    atLeastOneEmail: 'At least one recipient email is required',
    monthOffsetRequired: 'Target month is required',
  },

  // Operation Messages
  message: {
    deleteConfirm: 'Are you sure you want to delete this report configuration?',
    deleteTitle: 'Delete Confirmation',
    deleteWarning: 'This action cannot be undone. Please proceed with caution.',
    enableConfirm: 'Are you sure you want to enable this report configuration?',
    disableConfirm: 'Are you sure you want to disable this report configuration?',
    testConfirm:
      'Are you sure you want to execute this report task now? It will generate the report and send emails according to the configuration.',
    testTitle: 'Test Execution Confirmation',
    testExecuting: 'Generating and sending report, please wait...',
    createSuccess: 'Report configuration created successfully',
    updateSuccess: 'Report configuration updated successfully',
    deleteSuccess: 'Report configuration deleted successfully',
    toggleSuccess: 'Status toggled successfully',
    testSuccess: 'Report task executed successfully, please check your email',
    createFailed: 'Failed to create report configuration',
    updateFailed: 'Failed to update report configuration',
    deleteFailed: 'Failed to delete report configuration',
    toggleFailed: 'Failed to toggle status',
    testFailed: 'Failed to execute report task',
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
    ccEmails: 'CC emails are optional. You can add multiple email addresses',
    monthOffset:
      'Select the target month for the report data. 0 represents current month, -1 represents last month, and so on',
  },

  // Month Offset Options
  monthOffsetOptions: {
    currentMonth: 'Current Month',
    lastMonth: 'Last Month',
    twoMonthsAgo: '2 Months Ago',
    threeMonthsAgo: '3 Months Ago',
    fourMonthsAgo: '4 Months Ago',
    fiveMonthsAgo: '5 Months Ago',
    sixMonthsAgo: '6 Months Ago',
  },

  // Month Unit
  monthsAgo: ' Months Ago',

  // Frequency Options
  frequencyOptions: {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  },

  // Week Days
  weekDays: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },

  // CRON Description
  cronDescription: {
    daily: 'Execute daily at {time}',
    weekly: 'Execute every {day} at {time}',
    monthly: 'Execute on day {day} of each month at {time}',
  },
};
