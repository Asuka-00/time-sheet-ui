export default {
  projectManagement: 'プロジェクト管理',
  projectName: 'プロジェクト名',
  projectCode: 'プロジェクトコード',
  description: 'プロジェクト説明',
  manager: 'プロジェクトマネージャー',
  director: 'プロジェクトディレクター',
  startDate: '開始日',
  endDate: '終了日',
  status: 'プロジェクトステータス',
  memberCount: 'メンバー数',
  members: 'プロジェクトメンバー',
  createdAt: '作成日時',
  createdBy: '作成者',
  updatedAt: '更新日時',
  updatedBy: '更新者',

  // プロジェクトステータス
  statusOptions: {
    inProgress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル済み',
  },

  // ボタン
  create: 'プロジェクト作成',
  edit: '編集',
  delete: '削除',
  save: '保存',
  cancel: 'キャンセル',
  search: '検索',
  reset: 'リセット',
  refresh: '更新',
  manageMembers: 'メンバー管理',
  addMember: 'メンバー追加',
  removeMember: '削除',
  close: '閉じる',

  // フォームタイトル
  formTitle: {
    create: 'プロジェクト作成',
    edit: 'プロジェクト編集',
    members: 'プロジェクトメンバー管理',
  },

  // プレースホルダー
  placeholder: {
    projectCode: 'プロジェクトコードを入力してください',
    projectName: 'プロジェクト名を入力してください',
    description: 'プロジェクト説明を入力してください',
    manager: 'プロジェクトマネージャーを選択してください',
    director: 'プロジェクトディレクターを選択してください',
    startDate: '開始日を選択してください',
    endDate: '終了日を選択してください',
    status: 'プロジェクトステータスを選択してください',
    searchKey: 'プロジェクトコードまたは名前で検索',
    selectUser: 'ユーザーを選択してください',
    memberRole: 'メンバーロールを入力してください（例：開発、テスト、デザイン等）',
    joinDate: '参加日を選択してください',
  },

  // 検証
  validation: {
    projectCodeRequired: 'プロジェクトコードは必須です',
    projectCodeLength: 'プロジェクトコードは2〜50文字である必要があります',
    projectNameRequired: 'プロジェクト名は必須です',
    projectNameLength: 'プロジェクト名は2〜100文字である必要があります',
    descriptionLength: 'プロジェクト説明は500文字以内である必要があります',
    managerRequired: 'プロジェクトマネージャーは必須です',
    directorRequired: 'プロジェクトディレクターは必須です',
    startDateRequired: '開始日は必須です',
    endDateRequired: '終了日は必須です',
    endDateAfterStart: '終了日は開始日より後である必要があります',
    userRequired: 'ユーザーは必須です',
  },

  // メッセージ
  message: {
    createSuccess: 'プロジェクトの作成に成功しました',
    updateSuccess: 'プロジェクトの更新に成功しました',
    deleteSuccess: 'プロジェクトの削除に成功しました',
    deleteConfirm: 'このプロジェクトを削除してもよろしいですか？',
    deleteWarning:
      'このプロジェクトを削除すると、すべてのプロジェクトメンバー記録も削除されます。この操作は元に戻せません。',
    addMemberSuccess: 'メンバーの追加に成功しました',
    removeMemberSuccess: 'メンバーの削除に成功しました',
    removeMemberConfirm: 'このメンバーを削除してもよろしいですか？',
    noMembers: 'プロジェクトメンバーがいません',
    loadingMembers: 'メンバーデータを読み込み中...',
    loadingUsers: 'ユーザーデータを読み込み中...',
  },

  // テーブル列
  table: {
    projectCode: 'プロジェクトコード',
    projectName: 'プロジェクト名',
    description: '説明',
    manager: 'プロジェクトマネージャー',
    director: 'ディレクター',
    memberCount: 'メンバー数',
    status: 'ステータス',
    startDate: '開始日',
    endDate: '終了日',
    createdAt: '作成日時',
    actions: '操作',
  },

  // メンバーテーブル
  memberTable: {
    userName: 'メンバー名',
    email: 'メールアドレス',
    role: 'ロール',
    joinDate: '参加日',
    actions: '操作',
  },
};
