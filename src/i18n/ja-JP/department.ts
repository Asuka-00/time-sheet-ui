// 部門管理モジュール日本語翻訳
export default {
  // ページタイトル
  departmentManagement: '部門管理',
  
  // テーブル列
  name: '部門名',
  description: '部門説明',
  parentDepartmentName: '上位部門',
  status: 'ステータス',
  createdAt: '作成日時',
  createdBy: '作成者',
  updatedAt: '更新日時',
  updatedBy: '更新者',
  
  // ステータス値
  statusActive: '有効',
  statusInactive: '無効',
  
  // 操作ボタン
  actions: '操作',
  create: '部門作成',
  edit: '編集',
  delete: '削除',
  save: '保存',
  cancel: 'キャンセル',
  search: '検索',
  reset: 'リセット',
  
  // フォームタイトル
  formTitle: {
    create: '部門作成',
    edit: '部門編集',
  },
  
  // フォームプレースホルダー
  placeholder: {
    name: '部門名を入力してください',
    description: '部門説明を入力してください',
    parentDepartmentName: '上位部門を選択してください',
    searchKey: '部門名または説明を入力してください',
  },
  
  // フォーム検証
  validation: {
    nameRequired: '部門名は必須です',
    descriptionRequired: '部門説明は必須です',
  },
  
  // 操作メッセージ
  message: {
    deleteConfirm: 'この部門を削除してもよろしいですか？この操作は元に戻せません！',
    deleteTitle: '削除確認',
    deleteWarning: '削除後は復元できません。慎重に操作してください',
    createSuccess: '部門の作成に成功しました',
    updateSuccess: '部門の更新に成功しました',
    deleteSuccess: '部門の削除に成功しました',
    createFailed: '部門の作成に失敗しました',
    updateFailed: '部門の更新に失敗しました',
    deleteFailed: '部門の削除に失敗しました',
    loadFailed: '部門リストの読み込みに失敗しました',
  },
};

