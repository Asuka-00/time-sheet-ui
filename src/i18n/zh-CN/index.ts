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
  failed: '失败',
  success: '成功',
  systemManagement: '系统管理',
  userManagement: '用户管理',
  roleManagement: '角色管理',
  permissionManagement: '权限管理',
  departmentManagement: '部门管理',
  reportConfigManagement: '报表配置管理',
  projectManagement: '项目管理',
  timesheetManagement: '工时管理',
  myTimesheets: '我的工时表',
  timesheetReview: '工时审核',
  timesheetStatistics: '工时统计',
  projectManagerTimesheets: '项目工时管理',
  menu: {
    home: '主页',
  },
  common: {
    paginationLabel: '显示 {from}-{to} 共 {total} 条',
    confirm: '确定',
    cancel: '取消',
    close: '关闭',
    language: '语言',
    languageZhCN: '简体中文',
    languageEnUS: 'English',
    languageJaJP: '日本語',
    appTitle: '工时管理系统',
  },
  request: {
    defaultError: '操作失败',
    requestFailed: '请求失败',
    badRequest: '请求参数错误',
    unauthorized: '未授权',
    sessionExpired: '登录已过期，请重新登录',
    requestConfigLost: '原始请求配置丢失',
    refreshTokenFailed: '刷新令牌失败',
    forbidden: '没有权限访问',
    notFound: '请求的资源不存在',
    serverError: '服务器错误',
    networkError: '网络错误，请检查网络连接',
    configError: '请求配置错误',
    requestFailedWithStatus: '请求失败 ({status})',
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
