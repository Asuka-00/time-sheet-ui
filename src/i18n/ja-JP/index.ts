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
  failed: '失敗',
  success: '成功',
  systemManagement: 'システム管理',
  userManagement: 'ユーザー管理',
  roleManagement: 'ロール管理',
  permissionManagement: '権限管理',
  departmentManagement: '部門管理',
  reportConfigManagement: 'レポート設定管理',
  projectManagement: 'プロジェクト管理',
  timesheetManagement: '工数管理',
  myTimesheets: 'マイタイムシート',
  timesheetReview: '工数レビュー',
  timesheetStatistics: '工数統計',
  projectManagerTimesheets: 'プロジェクト工数管理',
  menu: {
    home: 'ホーム',
  },
  common: {
    paginationLabel: '{from}〜{to}件を表示（全{total}件）',
    confirm: '確認',
    cancel: 'キャンセル',
    close: '閉じる',
    language: '言語',
    languageZhCN: '简体中文',
    languageEnUS: 'English',
    languageJaJP: '日本語',
    appTitle: '工数管理システム',
  },
  request: {
    defaultError: '操作に失敗しました',
    requestFailed: 'リクエストに失敗しました',
    badRequest: 'リクエストパラメータが正しくありません',
    unauthorized: '認証されていません',
    sessionExpired: 'セッションの有効期限が切れました。再度ログインしてください',
    requestConfigLost: '元のリクエスト設定が失われました',
    refreshTokenFailed: 'トークンの更新に失敗しました',
    forbidden: 'アクセス権限がありません',
    notFound: 'リクエストされたリソースが存在しません',
    serverError: 'サーバーエラー',
    networkError: 'ネットワークエラー。ネットワーク接続を確認してください',
    configError: 'リクエスト設定エラー',
    requestFailedWithStatus: 'リクエストに失敗しました（{status}）',
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
