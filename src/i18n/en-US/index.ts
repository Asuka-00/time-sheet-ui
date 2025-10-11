import user from './user';
import auth from './auth';
import permission from './permission';
import role from './role';
import project from './project';
import timesheet from './timesheet';
import dashboard from './dashboard';
import department from './department';
import reportConfig from './report-config';
import notification from './notification';
import errors from './errors';
import successMessages from './success';
import validationMessages from './validation';

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  systemManagement: 'System Management',
  userManagement: 'User Management',
  roleManagement: 'Role Management',
  permissionManagement: 'Permission Management',
  departmentManagement: 'Department Management',
  reportConfigManagement: 'Report Configuration Management',
  projectManagement: 'Project Management',
  timesheetManagement: 'Timesheet Management',
  myTimesheets: 'My Timesheets',
  timesheetReview: 'Timesheet Review',
  timesheetStatistics: 'Timesheet Statistics',
  projectManagerTimesheets: 'Project Manager Timesheets',
  menu: {
    home: 'Home',
  },
  common: {
    paginationLabel: 'Showing {from}-{to} of {total}',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    language: 'Language',
    languageZhCN: '简体中文',
    languageEnUS: 'English',
    languageJaJP: '日本語',
    appTitle: 'Timesheet Management System',
  },
  request: {
    defaultError: 'Operation failed',
    requestFailed: 'Request failed',
    badRequest: 'Bad request parameters',
    unauthorized: 'Unauthorized',
    sessionExpired: 'Session expired, please login again',
    requestConfigLost: 'Original request configuration lost',
    refreshTokenFailed: 'Failed to refresh token',
    forbidden: 'Permission denied',
    notFound: 'Resource not found',
    serverError: 'Server error',
    networkError: 'Network error, please check your connection',
    configError: 'Request configuration error',
    requestFailedWithStatus: 'Request failed ({status})',
  },
  user,
  auth,
  permission,
  role,
  project,
  timesheet,
  dashboard,
  department,
  reportConfig,
  notification,
  errors,
  successMessages,
  validationMessages,
};
