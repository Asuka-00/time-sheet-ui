export default {
  // Page titles
  myTimesheets: 'My Timesheets',
  timesheetReview: 'Timesheet Review',
  timesheetStatistics: 'Timesheet Statistics',
  timesheetManagement: 'Timesheet Management',
  projectManagerTimesheets: 'Project Timesheets Management',

  // Field labels
  timesheetCode: 'Timesheet Code',
  userCode: 'User Code',
  userName: 'Name',
  projectCode: 'Project Code',
  projectName: 'Project Name',
  workDate: 'Work Date',
  hours: 'Hours',
  description: 'Description',
  status: 'Status',
  submitDate: 'Submit Date',
  reviewerUserName: 'Reviewer',
  reviewDate: 'Review Date',
  reviewComment: 'Review Comment',
  createdAt: 'Created At',
  updatedAt: 'Updated At',

  // Status options
  statusOptions: {
    draft: 'Draft',
    pendingReview: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    all: 'All',
  },

  // Buttons
  create: 'New Timesheet',
  batchCreate: 'Batch Create',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search',
  reset: 'Reset',
  submit: 'Submit',
  batchSubmit: 'Batch Submit',
  withdraw: 'Withdraw',
  approve: 'Approve',
  reject: 'Reject',
  batchApprove: 'Batch Approve',
  batchReject: 'Batch Reject',
  viewDetail: 'View Detail',
  export: 'Export',
  close: 'Close',
  confirm: 'Confirm',

  // Form titles
  formTitle: {
    create: 'Create Timesheet',
    edit: 'Edit Timesheet',
    review: 'Review Timesheet',
    detail: 'Timesheet Detail',
  },

  // Batch create form
  batchCreateForm: {
    title: 'Batch Create Timesheets',
    addRow: 'Add Row',
    copyRow: 'Copy Row',
    removeRow: 'Remove Row',
  },

  // Placeholders
  placeholder: {
    projectCode: 'Please select project',
    workDate: 'Please select work date',
    hours: 'Please enter hours (0.5-24)',
    description: 'Please describe your work in detail',
    reviewComment: 'Please enter review comment',
    searchKey: 'Search project or description',
    selectProject: 'Please select project',
    selectStatus: 'Please select status',
    selectDateRange: 'Select date range',
    startDate: 'Start Date',
    endDate: 'End Date',
    selectUser: 'Please select user',
  },

  // Validation messages
  validation: {
    projectCodeRequired: 'Project is required',
    workDateRequired: 'Work date is required',
    workDateFuture: 'Cannot select future date',
    hoursRequired: 'Hours is required',
    hoursRange: 'Hours must be between 0.5 and 24',
    hoursNumber: 'Hours must be a number',
    descriptionRequired: 'Description is required',
    descriptionMinLength: 'Description must be at least 10 characters',
    reviewCommentRequired: 'Review comment is required when rejecting',
    atLeastOneRow: 'At least one timesheet record is required',
    formError: 'Please check if the form is filled correctly',
    duplicateProjectDate: 'This project already has a timesheet for this date',
    hasDuplicateRows: 'There are {count} duplicate project+date combinations',
  },

  // Messages
  message: {
    createSuccess: 'Timesheet created successfully',
    updateSuccess: 'Timesheet updated successfully',
    deleteSuccess: 'Timesheet deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this timesheet?',
    deleteWarning: 'This action cannot be undone',
    submitSuccess: 'Timesheet submitted successfully',
    batchSubmitSuccess: 'Batch submit completed successfully',
    batchCreateSuccess: 'Batch created successfully: {success} succeeded, {failed} failed',
    batchCreateError: 'Batch create failed',
    withdrawSuccess: 'Timesheet withdrawn successfully',
    reviewSuccess: 'Review completed successfully',
    approveConfirm: 'Are you sure you want to approve this timesheet?',
    rejectConfirm: 'Are you sure you want to reject this timesheet?',
    batchApproveConfirm: 'Are you sure you want to approve selected timesheets?',
    batchRejectConfirm: 'Are you sure you want to reject selected timesheets?',
    selectAtLeastOne: 'Please select at least one record',
    onlyDraftCanEdit: 'Only draft timesheets can be edited',
    onlyDraftCanDelete: 'Only draft timesheets can be deleted',
    onlyDraftCanSubmit: 'Only draft timesheets can be submitted',
    onlyPendingCanWithdraw: 'Only pending timesheets can be withdrawn',
    noData: 'No data',
    loading: 'Loading...',
  },

  // Table columns
  table: {
    timesheetCode: 'Code',
    projectName: 'Project',
    userName: 'Name',
    workDate: 'Work Date',
    hours: 'Hours',
    description: 'Description',
    status: 'Status',
    submitDate: 'Submit Date',
    reviewerUserName: 'Reviewer',
    reviewDate: 'Review Date',
    createdAt: 'Created At',
    actions: 'Actions',
  },

  // Statistics
  statistics: {
    totalHours: 'Total Hours',
    totalRecords: 'Total Records',
    approvalRate: 'Approval Rate',
    byProject: 'By Project',
    byStatus: 'By Status',
    byDate: 'Timesheet Trend',
    projectName: 'Project',
    hoursCount: 'Hours',
    recordCount: 'Records',
    percentage: 'Percentage',
    chartType: 'Chart Type',
    pie: 'Pie Chart',
    bar: 'Bar Chart',
    line: 'Line Chart',
    timeRange: 'Time Range',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    last90Days: 'Last 90 Days',
    custom: 'Custom',
  },

  // Filter
  filter: {
    title: 'Filter',
    project: 'Project',
    status: 'Status',
    dateRange: 'Date Range',
    user: 'User',
    allProjects: 'All Projects',
    allStatus: 'All Status',
  },

  // Batch operations
  batch: {
    selected: 'Selected',
    items: 'items',
    clear: 'Clear Selection',
  },

  // Review
  review: {
    approveTitle: 'Approve Timesheet',
    rejectTitle: 'Reject Timesheet',
    approveMessage: 'Confirm to approve this timesheet?',
    rejectMessage: 'Confirm to reject this timesheet? Please provide a reason.',
    batchApproveMessage: 'Confirm to approve {count} selected timesheets?',
    batchRejectMessage: 'Confirm to reject {count} selected timesheets?',
    pendingCount: 'Pending',
  },
};
