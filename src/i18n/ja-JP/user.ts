// ユーザー管理モジュール日本語翻訳
export default {
  // ページタイトル
  userManagement: 'ユーザー管理',
  
  // テーブル列
  userCode: 'ユーザーコード',
  userName: 'ユーザー名',
  email: 'メールアドレス',
  phoneNumber: '電話番号',
  password: 'パスワード',
  roleName: 'ロール',
  departmentName: '部門',
  timezone: 'タイムゾーン',
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
  create: 'ユーザー作成',
  edit: '編集',
  delete: '削除',
  resetPassword: 'パスワードリセット',
  search: '検索',
  reset: 'リセット',
  save: '保存',
  cancel: 'キャンセル',
  confirm: '確認',
  
  // フォームタイトル
  formTitle: {
    create: 'ユーザー作成',
    edit: 'ユーザー編集',
    resetPassword: 'ユーザーパスワードリセット',
  },
  
  // フォームプレースホルダー
  placeholder: {
    userCode: 'ユーザーコードを入力してください',
    userName: 'ユーザー名を入力してください',
    email: 'メールアドレスを入力してください',
    phoneNumber: '電話番号を入力してください',
    password: 'パスワードを入力してください',
    newPassword: '新しいパスワードを入力してください',
    confirmPassword: '新しいパスワードを再入力してください',
    roleName: 'ロールを選択してください',
    departmentName: '部門を選択してください',
    timezone: 'タイムゾーンを選択してください',
    searchKey: 'ユーザーコードまたはユーザー名を入力してください',
  },
  
  // フォーム検証
  validation: {
    userCodeRequired: 'ユーザーコードは必須です',
    userNameRequired: 'ユーザー名は必須です',
    emailRequired: 'メールアドレスは必須です',
    emailInvalid: '有効なメールアドレスを入力してください',
    phoneRequired: '電話番号は必須です',
    phoneInvalid: '有効な電話番号を入力してください',
    passwordRequired: 'パスワードは必須です',
    passwordMinLength: 'パスワードは6文字以上である必要があります',
    newPasswordRequired: '新しいパスワードは必須です',
    newPasswordMinLength: '新しいパスワードは6文字以上である必要があります',
    confirmPasswordRequired: 'パスワード確認は必須です',
    passwordMismatch: 'パスワードが一致しません',
    roleRequired: 'ロールは必須です',
    departmentRequired: '部門は必須です',
  },
  
  // 操作メッセージ
  message: {
    deleteConfirm: 'このユーザーを削除してもよろしいですか？この操作は元に戻せません！',
    deleteTitle: '削除確認',
    deleteWarning: '削除後は復元できません。慎重に操作してください',
    resetPasswordConfirm: 'このユーザーのパスワードをリセットしてもよろしいですか？',
    createSuccess: 'ユーザーの作成に成功しました',
    updateSuccess: 'ユーザーの更新に成功しました',
    deleteSuccess: 'ユーザーの削除に成功しました',
    resetPasswordSuccess: 'パスワードのリセットに成功しました',
    createFailed: 'ユーザーの作成に失敗しました',
    updateFailed: 'ユーザーの更新に失敗しました',
    deleteFailed: 'ユーザーの削除に失敗しました',
    resetPasswordFailed: 'パスワードのリセットに失敗しました',
    loadFailed: 'ユーザーリストの読み込みに失敗しました',
  },
  
  // ページネーション
  pagination: {
    total: '合計',
    items: '件',
    rowsPerPage: 'ページあたりの表示数',
  },

  // タイムゾーン
  timezones: {
    utc: 'UTC（協定世界時）',
    // アジア
    shanghai: 'Asia/Shanghai（中国標準時）',
    tokyo: 'Asia/Tokyo（日本標準時）',
    seoul: 'Asia/Seoul（韓国標準時）',
    hongkong: 'Asia/Hong_Kong（香港時間）',
    taipei: 'Asia/Taipei（台北時間）',
    singapore: 'Asia/Singapore（シンガポール時間）',
    bangkok: 'Asia/Bangkok（インドシナ時間）',
    dubai: 'Asia/Dubai（湾岸標準時）',
    kolkata: 'Asia/Kolkata（インド標準時）',
    karachi: 'Asia/Karachi（パキスタン標準時）',
    tashkent: 'Asia/Tashkent（ウズベキスタン時間）',
    // ヨーロッパ
    london: 'Europe/London（グリニッジ標準時）',
    paris: 'Europe/Paris（中央ヨーロッパ時間）',
    berlin: 'Europe/Berlin（中央ヨーロッパ時間）',
    rome: 'Europe/Rome（中央ヨーロッパ時間）',
    madrid: 'Europe/Madrid（中央ヨーロッパ時間）',
    amsterdam: 'Europe/Amsterdam（中央ヨーロッパ時間）',
    moscow: 'Europe/Moscow（モスクワ標準時）',
    istanbul: 'Europe/Istanbul（トルコ時間）',
    // 南北アメリカ
    newYork: 'America/New_York（東部時間）',
    chicago: 'America/Chicago（中部時間）',
    denver: 'America/Denver（山岳部時間）',
    losAngeles: 'America/Los_Angeles（太平洋時間）',
    toronto: 'America/Toronto（東部時間）',
    mexicoCity: 'America/Mexico_City（メキシコ中部標準時）',
    saoPaulo: 'America/Sao_Paulo（ブラジリア時間）',
    buenosAires: 'America/Argentina/Buenos_Aires（アルゼンチン時間）',
    // オセアニア
    sydney: 'Australia/Sydney（オーストラリア東部時間）',
    melbourne: 'Australia/Melbourne（オーストラリア東部時間）',
    auckland: 'Pacific/Auckland（ニュージーランド時間）',
    // アフリカ
    cairo: 'Africa/Cairo（東ヨーロッパ時間）',
    johannesburg: 'Africa/Johannesburg（南アフリカ標準時）',
  },
};

