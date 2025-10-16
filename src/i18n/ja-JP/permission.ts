// 権限管理モジュール日本語翻訳
export default {
  // ページタイトル
  permissionManagement: '権限管理',

  // テーブル列
  name: '権限名',
  menuName: 'メニュー表示名',
  code: '権限コード',
  module: '所属モジュール',
  type: '権限タイプ',
  description: '説明',
  status: 'ステータス',
  parentCode: '親コード',
  path: 'ルートパス',
  icon: 'アイコン',
  component: 'コンポーネントパス',
  sort: 'ソート',
  createdAt: '作成日時',
  createdBy: '作成者',
  updatedAt: '更新日時',
  updatedBy: '更新者',

  // ステータス値
  statusActive: '有効',
  statusInactive: '無効',

  // 権限タイプ
  typeMenu: 'メニュー',
  typeButton: 'ボタン',
  typeApi: 'API',

  // 操作ボタン
  actions: '操作',
  create: '権限作成',
  edit: '編集',
  delete: '削除',
  search: '検索',
  reset: 'リセット',
  save: '保存',
  cancel: 'キャンセル',
  confirm: '確認',

  // フォームタイトル
  formTitle: {
    create: '権限作成',
    edit: '権限編集',
  },

  // フォームプレースホルダー
  placeholder: {
    name: '権限名を入力してください',
    menuName: 'メニュー表示名を入力してください（オプション）',
    code: '権限コードを入力してください',
    module: '所属モジュールを入力してください',
    type: '権限タイプを選択してください',
    description: '権限説明を入力してください',
    parentCode: '親権限コードを入力してください',
    path: 'ルートパスを入力してください',
    icon: 'アイコン名を入力してください',
    component: 'コンポーネントパスを入力してください',
    sort: 'ソート値を入力してください',
    searchKey: '権限名またはコードを入力してください',
  },

  // フィールドヒント
  hint: {
    menuName: 'メニューに表示するために使用します。入力しない場合は権限名が使用されます',
  },

  // フォーム検証
  validation: {
    nameRequired: '権限名は必須です',
    codeRequired: '権限コードは必須です',
    moduleRequired: '所属モジュールは必須です',
    descriptionRequired: '権限説明は必須です',
    sortInvalid: 'ソート値は数値である必要があります',
  },

  // 操作メッセージ
  message: {
    deleteConfirm: 'この権限を削除してもよろしいですか？この操作は元に戻せません！',
    deleteTitle: '削除確認',
    createSuccess: '権限の作成に成功しました',
    updateSuccess: '権限の更新に成功しました',
    deleteSuccess: '権限の削除に成功しました',
    createFailed: '権限の作成に失敗しました',
    updateFailed: '権限の更新に失敗しました',
    deleteFailed: '権限の削除に失敗しました',
    loadFailed: '権限リストの読み込みに失敗しました',
  },

  // ページネーション
  pagination: {
    total: '合計',
    items: '件',
    rowsPerPage: 'ページあたりの表示数',
  },

  // メニュー名
  menus: {
    systemManagement: 'システム管理',
    userManagement: 'ユーザー管理',
    permissionManagement: '権限管理',
    roleManagement: 'ロール管理',
    departmentManagement: '部署管理',
    reportConfigManagement: 'レポート設定管理',
    projectManagement: 'プロジェクト管理',
    timesheetManagement: 'タイムシート管理',
    myTimesheets: 'マイタイムシート',
    timesheetReview: 'タイムシート承認',
    projectManagerTimesheets: 'プロジェクトマネージャータイムシート',
    timesheetStatistics: 'タイムシート統計',
  },

  // ボタン権限
  buttons: {
    user: {
      create: 'ユーザー作成',
      edit: 'ユーザー編集',
      delete: 'ユーザー削除',
      resetPassword: 'パスワードリセット',
    },
    department: {
      create: '部署作成',
      edit: '部署編集',
      delete: '部署削除',
    },
    permission: {
      create: '権限作成',
      edit: '権限編集',
      delete: '権限削除',
    },
    role: {
      create: 'ロール作成',
      edit: 'ロール編集',
      delete: 'ロール削除',
    },
    project: {
      create: 'プロジェクト作成',
      edit: 'プロジェクト編集',
      members: 'プロジェクトメンバー管理',
      delete: 'プロジェクト削除',
    },
    timesheet: {
      create: 'タイムシート作成',
      batchCreate: '一括タイムシート作成',
      edit: 'タイムシート編集',
      delete: 'タイムシート削除',
      submit: 'タイムシート提出',
      withdraw: 'タイムシート取消',
      batchSubmit: '一括タイムシート提出',
    },
    timesheetReview: {
      approve: 'タイムシート承認',
      reject: 'タイムシート拒否',
      batchApprove: '一括タイムシート承認',
      batchReject: '一括タイムシート拒否',
    },
    reportConfig: {
      create: 'レポート設定作成',
      edit: 'レポート設定編集',
      toggle: 'レポート設定切替',
      delete: 'レポート設定削除',
    },
  },
};
