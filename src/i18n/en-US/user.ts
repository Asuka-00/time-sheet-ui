// User management module English translation
export default {
  // Page title
  userManagement: 'User Management',
  
  // Table columns
  userCode: 'User Code',
  userName: 'User Name',
  email: 'Email',
  phoneNumber: 'Phone Number',
  password: 'Password',
  roleName: 'Role',
  departmentName: 'Department',
  timezone: 'Timezone',
  status: 'Status',
  createdAt: 'Created At',
  createdBy: 'Created By',
  updatedAt: 'Updated At',
  updatedBy: 'Updated By',
  
  // Status values
  statusActive: 'Active',
  statusInactive: 'Inactive',
  
  // Action buttons
  actions: 'Actions',
  create: 'Create User',
  edit: 'Edit',
  delete: 'Delete',
  resetPassword: 'Reset Password',
  search: 'Search',
  reset: 'Reset',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  
  // Form titles
  formTitle: {
    create: 'Create User',
    edit: 'Edit User',
    resetPassword: 'Reset User Password',
  },
  
  // Form placeholders
  placeholder: {
    userCode: 'Please enter user code',
    userName: 'Please enter user name',
    email: 'Please enter email',
    phoneNumber: 'Please enter phone number',
    password: 'Please enter password',
    newPassword: 'Please enter new password',
    confirmPassword: 'Please enter new password again',
    roleName: 'Please select role',
    departmentName: 'Please select department',
    timezone: 'Please select timezone',
    searchKey: 'Please enter user code or user name',
  },
  
  // Form validation
  validation: {
    userCodeRequired: 'User code is required',
    userNameRequired: 'User name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Please enter a valid phone number',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    newPasswordRequired: 'New password is required',
    newPasswordMinLength: 'New password must be at least 6 characters',
    confirmPasswordRequired: 'Confirm password is required',
    passwordMismatch: 'The two passwords do not match',
    roleRequired: 'Role is required',
    departmentRequired: 'Department is required',
  },
  
  // Operation messages
  message: {
    deleteConfirm: 'Are you sure you want to delete this user? This action cannot be undone!',
    deleteTitle: 'Delete Confirmation',
    deleteWarning: 'This action cannot be undone, please proceed with caution',
    resetPasswordConfirm: 'Are you sure you want to reset this user\'s password?',
    createSuccess: 'User created successfully',
    updateSuccess: 'User updated successfully',
    deleteSuccess: 'User deleted successfully',
    resetPasswordSuccess: 'Password reset successfully',
    createFailed: 'Failed to create user',
    updateFailed: 'Failed to update user',
    deleteFailed: 'Failed to delete user',
    resetPasswordFailed: 'Failed to reset password',
    loadFailed: 'Failed to load user list',
  },
  
  // Pagination
  pagination: {
    total: 'Total',
    items: 'items',
    rowsPerPage: 'Rows per page',
  },

  // Timezones
  timezones: {
    utc: 'UTC (Coordinated Universal Time)',
    // Asia
    shanghai: 'Asia/Shanghai (China Standard Time)',
    tokyo: 'Asia/Tokyo (Japan Standard Time)',
    seoul: 'Asia/Seoul (Korea Standard Time)',
    hongkong: 'Asia/Hong_Kong (Hong Kong Time)',
    taipei: 'Asia/Taipei (Taipei Time)',
    singapore: 'Asia/Singapore (Singapore Time)',
    bangkok: 'Asia/Bangkok (Indochina Time)',
    dubai: 'Asia/Dubai (Gulf Standard Time)',
    kolkata: 'Asia/Kolkata (India Standard Time)',
    karachi: 'Asia/Karachi (Pakistan Standard Time)',
    tashkent: 'Asia/Tashkent (Uzbekistan Time)',
    // Europe
    london: 'Europe/London (Greenwich Mean Time)',
    paris: 'Europe/Paris (Central European Time)',
    berlin: 'Europe/Berlin (Central European Time)',
    rome: 'Europe/Rome (Central European Time)',
    madrid: 'Europe/Madrid (Central European Time)',
    amsterdam: 'Europe/Amsterdam (Central European Time)',
    moscow: 'Europe/Moscow (Moscow Standard Time)',
    istanbul: 'Europe/Istanbul (Turkey Time)',
    // Americas
    newYork: 'America/New_York (Eastern Time)',
    chicago: 'America/Chicago (Central Time)',
    denver: 'America/Denver (Mountain Time)',
    losAngeles: 'America/Los_Angeles (Pacific Time)',
    toronto: 'America/Toronto (Eastern Time)',
    mexicoCity: 'America/Mexico_City (Central Standard Time)',
    saoPaulo: 'America/Sao_Paulo (Brasilia Time)',
    buenosAires: 'America/Argentina/Buenos_Aires (Argentina Time)',
    // Oceania
    sydney: 'Australia/Sydney (Australian Eastern Time)',
    melbourne: 'Australia/Melbourne (Australian Eastern Time)',
    auckland: 'Pacific/Auckland (New Zealand Time)',
    // Africa
    cairo: 'Africa/Cairo (Eastern European Time)',
    johannesburg: 'Africa/Johannesburg (South Africa Standard Time)',
  },
};
