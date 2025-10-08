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
};

