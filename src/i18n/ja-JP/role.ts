export default {
  roleManagement: 'ロール管理',
  roleName: 'ロール名',
  description: 'ロール説明',
  dataScope: 'データ範囲',
  dataScopeAll: 'すべてのプロジェクト',
  permissions: '権限',
  createdAt: '作成日時',
  createdBy: '作成者',
  updatedAt: '更新日時',
  updatedBy: '更新者',
  
  // ボタン
  create: 'ロール作成',
  edit: '編集',
  delete: '削除',
  save: '保存',
  cancel: 'キャンセル',
  search: '検索',
  reset: 'リセット',
  selectPermissions: '権限選択',
  
  // フォームタイトル
  formTitle: {
    create: 'ロール作成',
    edit: 'ロール編集',
  },
  
  // プレースホルダー
  placeholder: {
    roleName: 'ロール名を入力してください',
    description: 'ロール説明を入力してください',
    dataScope: 'データ範囲を選択してください',
    searchKey: 'ロール名で検索',
    selectPermissions: '権限を選択してください',
  },
  
  // 検証
  validation: {
    roleNameRequired: 'ロール名は必須です',
    roleNameLength: 'ロール名は2〜50文字である必要があります',
    descriptionRequired: 'ロール説明は必須です',
    descriptionLength: 'ロール説明は200文字以内である必要があります',
  },
  
  // メッセージ
  message: {
    createSuccess: 'ロールの作成に成功しました',
    updateSuccess: 'ロールの更新に成功しました',
    deleteSuccess: 'ロールの削除に成功しました',
    deleteConfirm: 'このロールを削除してもよろしいですか？',
    deleteWarning: 'このロールを削除すると、関連するすべての権限割り当ても削除されます。この操作は元に戻せません。',
  },
  
  // テーブル列
  table: {
    roleName: 'ロール名',
    description: 'ロール説明',
    dataScope: 'データ範囲',
    createdAt: '作成日時',
    actions: '操作',
  },
};

