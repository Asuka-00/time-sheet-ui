// レポート設定管理モジュール日本語翻訳
export default {
  // ページタイトル
  reportConfigManagement: 'レポート設定管理',

  // テーブル列
  reportType: 'レポートタイプ',
  reportName: 'レポート名',
  cronExpression: 'Cron式',
  recipientEmails: '受信メールアドレス',
  filterConditions: 'フィルター条件',
  projectCodes: 'プロジェクトコード',
  isEnabled: 'ステータス',
  description: '説明',
  createdAt: '作成日時',
  createdBy: '作成者',
  updatedAt: '更新日時',
  updatedBy: '更新者',

  // ステータス値
  statusEnabled: '有効',
  statusDisabled: '無効',

  // アクションボタン
  actions: '操作',
  create: '新規設定',
  edit: '編集',
  delete: '削除',
  save: '保存',
  cancel: 'キャンセル',
  search: '検索',
  reset: 'リセット',
  enable: '有効化',
  disable: '無効化',

  // フォームタイトル
  formTitle: {
    create: 'レポート設定作成',
    edit: 'レポート設定編集',
  },

  // フォームプレースホルダー
  placeholder: {
    reportType: 'レポートタイプを入力してください（例：MONTHLY_PROJECT_SUMMARY）',
    reportName: 'レポート名を入力してください',
    cronExpression: 'Cron式を入力してください（例：0 0 9 1 * *）',
    recipientEmails: '受信メールアドレスを入力または選択してください',
    filterConditions: 'フィルター条件を入力してください',
    projectCodes: 'プロジェクトコードを入力または選択してください（例：P001）',
    description: '設定説明を入力してください',
    searchKey: 'レポート名または説明を入力してください',
  },

  // フォーム検証
  validation: {
    reportTypeRequired: 'レポートタイプは必須です',
    reportNameRequired: 'レポート名は必須です',
    cronExpressionRequired: 'Cron式は必須です',
    recipientEmailsRequired: '受信メールアドレスは必須です',
    emailFormat: 'メールアドレスの形式が正しくありません',
    atLeastOneEmail: '少なくとも1つの受信メールアドレスが必要です',
  },

  // 操作メッセージ
  message: {
    deleteConfirm: 'このレポート設定を削除してもよろしいですか？',
    deleteTitle: '削除確認',
    deleteWarning: '削除後は復元できません。慎重に操作してください。',
    enableConfirm: 'このレポート設定を有効にしてもよろしいですか？',
    disableConfirm: 'このレポート設定を無効にしてもよろしいですか？',
    createSuccess: 'レポート設定の作成に成功しました',
    updateSuccess: 'レポート設定の更新に成功しました',
    deleteSuccess: 'レポート設定の削除に成功しました',
    toggleSuccess: 'ステータスの切り替えに成功しました',
    createFailed: 'レポート設定の作成に失敗しました',
    updateFailed: 'レポート設定の更新に失敗しました',
    deleteFailed: 'レポート設定の削除に失敗しました',
    toggleFailed: 'ステータスの切り替えに失敗しました',
    loadFailed: 'レポート設定リストの読み込みに失敗しました',
    loadProjectsFailed: 'プロジェクトリストの読み込みに失敗しました',
  },

  // データなしメッセージ
  noProjectsFound: '一致するプロジェクトが見つかりません',

  // ヒント
  hints: {
    cronExpression: 'Cron式の例：0 0 9 1 * * は毎月1日の午前9時に実行することを意味します',
    filterConditions: 'フィルター条件',
    projectCodes:
      '複数のプロジェクトコードを追加してレポートデータをフィルタリングできます。空白の場合はすべてのプロジェクトを含みます',
    reportTypeUnique: 'レポートタイプは一意である必要があり、作成後は変更できません',
  },
};
