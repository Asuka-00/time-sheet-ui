// レポート設定管理モジュール日本語翻訳
export default {
  // ページタイトル
  reportConfigManagement: 'レポート設定管理',

  // テーブル列
  reportName: 'レポート名',
  cronExpression: 'Cron式',
  scheduleConfig: 'スケジュール設定',
  recipientEmails: '受信メールアドレス',
  ccEmails: 'CCメールアドレス',
  filterConditions: 'フィルター条件',
  projectCodes: 'プロジェクトコード',
  monthOffset: '対象月',
  isEnabled: 'ステータス',

  // スケジュール設定
  useAdvancedCron: '高度モード（Cron式直接入力）',
  frequency: '実行頻度',
  dayOfMonth: '実行日（毎月）',
  dayOfWeek: '実行曜日',
  hour: '時',
  minute: '分',
  generatedCron: '生成されたCron式',
  dayLabel: '{day}日',
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
  test: 'テスト実行',
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
    reportName: 'レポート名を入力してください',
    cronExpression: 'Cron式を入力してください（例：0 0 9 1 * *）',
    recipientEmails: '受信メールアドレスを入力または選択してください',
    ccEmails: 'CCメールアドレスを入力または選択してください（任意）',
    filterConditions: 'フィルター条件を入力してください',
    projectCodes: 'プロジェクトコードを入力または選択してください（例：P001）',
    monthOffset: '対象月を選択してください',
    description: '設定説明を入力してください',
    searchKey: 'レポート名または説明を入力してください',
  },

  // フォーム検証
  validation: {
    reportNameRequired: 'レポート名は必須です',
    cronExpressionRequired: 'Cron式は必須です',
    recipientEmailsRequired: '受信メールアドレスは必須です',
    emailFormat: 'メールアドレスの形式が正しくありません',
    atLeastOneEmail: '少なくとも1つの受信メールアドレスが必要です',
    monthOffsetRequired: '対象月は必須です',
  },

  // 操作メッセージ
  message: {
    deleteConfirm: 'このレポート設定を削除してもよろしいですか？',
    deleteTitle: '削除確認',
    deleteWarning: '削除後は復元できません。慎重に操作してください。',
    enableConfirm: 'このレポート設定を有効にしてもよろしいですか？',
    disableConfirm: 'このレポート設定を無効にしてもよろしいですか？',
    testConfirm:
      'このレポートタスクを今すぐ実行してもよろしいですか？設定に従ってレポートを生成し、メールを送信します。',
    testTitle: 'テスト実行確認',
    testExecuting: 'レポートを生成して送信しています。お待ちください...',
    createSuccess: 'レポート設定の作成に成功しました',
    updateSuccess: 'レポート設定の更新に成功しました',
    deleteSuccess: 'レポート設定の削除に成功しました',
    toggleSuccess: 'ステータスの切り替えに成功しました',
    testSuccess: 'レポートタスクの実行に成功しました。メールをご確認ください',
    createFailed: 'レポート設定の作成に失敗しました',
    updateFailed: 'レポート設定の更新に失敗しました',
    deleteFailed: 'レポート設定の削除に失敗しました',
    toggleFailed: 'ステータスの切り替えに失敗しました',
    testFailed: 'レポートタスクの実行に失敗しました',
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
    ccEmails: 'CCメールアドレスは任意です。複数のメールアドレスを追加できます',
    monthOffset: 'レポートデータの対象月を選択します。0は当月、-1は先月を表します',
  },

  // 月オフセットオプション
  monthOffsetOptions: {
    currentMonth: '当月',
    lastMonth: '先月',
    twoMonthsAgo: '2ヶ月前',
    threeMonthsAgo: '3ヶ月前',
    fourMonthsAgo: '4ヶ月前',
    fiveMonthsAgo: '5ヶ月前',
    sixMonthsAgo: '6ヶ月前',
  },

  // 月単位
  monthsAgo: 'ヶ月前',

  // 頻度オプション
  frequencyOptions: {
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
  },

  // 曜日
  weekDays: {
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
  },

  // Cron説明
  cronDescription: {
    daily: '毎日 {time} に実行',
    weekly: '毎週{day} {time} に実行',
    monthly: '毎月{day}日 {time} に実行',
  },
};
