export default {
  // ページタイトル
  myTimesheets: 'マイタイムシート',
  timesheetReview: '工数レビュー',
  timesheetStatistics: '工数統計',
  timesheetManagement: '工数管理',
  projectManagerTimesheets: 'プロジェクト工数管理',

  // フィールドラベル
  timesheetCode: '工数コード',
  userCode: 'ユーザーコード',
  userName: '名前',
  projectCode: 'プロジェクトコード',
  projectName: 'プロジェクト名',
  workDate: '作業日',
  hours: '工数時間',
  description: '作業内容',
  status: 'ステータス',
  submitDate: '提出日',
  reviewerUserName: 'レビュー者',
  reviewDate: 'レビュー日',
  reviewComment: 'レビューコメント',
  createdAt: '作成日時',
  updatedAt: '更新日時',

  // ステータスオプション
  statusOptions: {
    draft: '下書き',
    pendingReview: 'レビュー待ち',
    approved: '承認済み',
    rejected: '却下',
    all: 'すべて',
  },

  // ボタン
  create: '工数記録作成',
  batchCreate: '一括作成',
  edit: '編集',
  delete: '削除',
  save: '保存',
  cancel: 'キャンセル',
  search: '検索',
  reset: 'リセット',
  submit: '提出',
  batchSubmit: '一括提出',
  withdraw: '撤回',
  approve: '承認',
  reject: '却下',
  batchApprove: '一括承認',
  batchReject: '一括却下',
  viewDetail: '詳細表示',
  export: 'エクスポート',
  close: '閉じる',
  confirm: '確認',

  // フォームタイトル
  formTitle: {
    create: '工数記録作成',
    edit: '工数記録編集',
    review: '工数レビュー',
    detail: '工数記録詳細',
  },

  // 一括作成フォーム
  batchCreateForm: {
    title: '一括工数記録作成',
    addRow: '行追加',
    copyRow: '行コピー',
    removeRow: '行削除',
  },

  // プレースホルダー
  placeholder: {
    projectCode: 'プロジェクトを選択してください',
    workDate: '作業日を選択してください',
    hours: '工数時間を入力してください（0.5〜24）',
    description: '作業内容を詳しく記入してください',
    reviewComment: 'レビューコメントを入力してください',
    searchKey: 'プロジェクトまたは作業内容で検索',
    selectProject: 'プロジェクトを選択してください',
    selectStatus: 'ステータスを選択してください',
    selectDateRange: '日付範囲を選択',
    startDate: '開始日',
    endDate: '終了日',
    selectUser: 'ユーザーを選択してください',
  },

  // 検証メッセージ
  validation: {
    projectCodeRequired: 'プロジェクトは必須です',
    workDateRequired: '作業日は必須です',
    workDateFuture: '未来の日付は選択できません',
    hoursRequired: '工数時間は必須です',
    hoursRange: '工数時間は0.5〜24の範囲で入力してください',
    hoursNumber: '工数時間は数値である必要があります',
    descriptionRequired: '作業内容は必須です',
    descriptionMinLength: '作業内容は10文字以上である必要があります',
    reviewCommentRequired: '却下する場合はレビューコメントが必須です',
    atLeastOneRow: '少なくとも1つの工数記録が必要です',
    formError: 'フォームが正しく入力されているか確認してください',
    duplicateProjectDate: 'この日付には既に同じプロジェクトの工数記録が存在します',
    hasDuplicateRows: '{count}件の重複するプロジェクト+日付の組み合わせがあります',
  },

  // メッセージ
  message: {
    createSuccess: '工数記録の作成に成功しました',
    updateSuccess: '工数記録の更新に成功しました',
    deleteSuccess: '工数記録の削除に成功しました',
    deleteConfirm: 'この工数記録を削除してもよろしいですか？',
    deleteWarning: 'この操作は元に戻せません',
    submitSuccess: '工数記録の提出に成功しました',
    batchSubmitSuccess: '一括提出が完了しました',
    batchCreateSuccess: '一括作成が完了しました：{success}件成功、{failed}件失敗',
    batchCreateError: '一括作成に失敗しました',
    withdrawSuccess: '工数記録の撤回に成功しました',
    reviewSuccess: 'レビューが完了しました',
    approveConfirm: 'この工数記録を承認してもよろしいですか？',
    rejectConfirm: 'この工数記録を却下してもよろしいですか？',
    batchApproveConfirm: '選択した工数記録を承認してもよろしいですか？',
    batchRejectConfirm: '選択した工数記録を却下してもよろしいですか？',
    selectAtLeastOne: '少なくとも1つの記録を選択してください',
    onlyDraftCanEdit: '下書きステータスの工数記録のみ編集できます',
    onlyDraftCanDelete: '下書きステータスの工数記録のみ削除できます',
    onlyDraftCanSubmit: '下書きステータスの工数記録のみ提出できます',
    onlyPendingCanWithdraw: 'レビュー待ちステータスの工数記録のみ撤回できます',
    noData: 'データがありません',
    loading: '読み込み中...',
  },

  // テーブル列
  table: {
    timesheetCode: 'コード',
    projectName: 'プロジェクト',
    userName: '名前',
    workDate: '作業日',
    hours: '工数時間',
    description: '作業内容',
    status: 'ステータス',
    submitDate: '提出日',
    reviewerUserName: 'レビュー者',
    reviewDate: 'レビュー日',
    createdAt: '作成日時',
    actions: '操作',
  },

  // 統計
  statistics: {
    totalHours: '総工数時間',
    totalRecords: '総記録数',
    approvalRate: '承認率',
    byProject: 'プロジェクト別',
    byStatus: 'ステータス別',
    byDate: '工数推移',
    projectName: 'プロジェクト',
    hoursCount: '工数時間',
    recordCount: '記録数',
    percentage: '割合',
    chartType: 'グラフタイプ',
    pie: '円グラフ',
    bar: '棒グラフ',
    line: '折れ線グラフ',
    timeRange: '期間',
    last7Days: '過去7日間',
    last30Days: '過去30日間',
    last90Days: '過去90日間',
    custom: 'カスタム',
  },

  // フィルター
  filter: {
    title: 'フィルター',
    project: 'プロジェクト',
    status: 'ステータス',
    dateRange: '日付範囲',
    user: 'ユーザー',
    allProjects: 'すべてのプロジェクト',
    allStatus: 'すべてのステータス',
  },

  // 一括操作
  batch: {
    selected: '選択済み',
    items: '件',
    clear: '選択解除',
  },

  // レビュー
  review: {
    approveTitle: '工数記録承認',
    rejectTitle: '工数記録却下',
    approveMessage: 'この工数記録を承認してもよろしいですか？',
    rejectMessage: 'この工数記録を却下してもよろしいですか？理由を入力してください。',
    batchApproveMessage: '選択した{count}件の工数記録を承認してもよろしいですか？',
    batchRejectMessage: '選択した{count}件の工数記録を却下してもよろしいですか？',
    pendingCount: 'レビュー待ち',
  },
};
