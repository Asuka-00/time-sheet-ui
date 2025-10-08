// エラーメッセージ日本語翻訳
export default {
  // 共通エラー
  COMMON: {
    UNAUTHORIZED: 'ログインしていません',
    FORBIDDEN: '権限が不足しています',
    NOT_FOUND: 'リソースが存在しません',
    INTERNAL_ERROR: 'サーバー内部エラー',
    INVALID_TOKEN: '無効なトークンです',
  },

  // 認証モジュール
  AUTH: {
    LOGIN: {
      INVALID_CREDENTIALS: 'ユーザー名またはパスワードが間違っています',
    },
    TOKEN: {
      INVALID_TYPE: '無効なトークンタイプです',
      USER_NOT_FOUND: 'ユーザーが存在しません',
      USER_DISABLED: 'ユーザーは無効化されています',
    },
    CONFIG: {
      JWT_SECRET_MISSING: 'JWT秘密鍵の設定がありません',
    },
  },

  // ユーザーモジュール
  USER: {
    CREATE: {
      ALREADY_EXISTS: 'ユーザーは既に存在します',
    },
    COMMON: {
      NOT_FOUND: 'ユーザーが存在しません',
      ID_REQUIRED: 'ユーザーIDは必須です',
    },
    PASSWORD: {
      OLD_PASSWORD_INCORRECT: '古いパスワードが間違っています',
      SAME_AS_OLD: '新しいパスワードは古いパスワードと同じにできません',
    },
  },

  // ロールモジュール
  ROLE: {
    CREATE: {
      ALREADY_EXISTS: 'ロールは既に存在します',
    },
    COMMON: {
      NOT_FOUND: 'ロールが存在しません',
      ID_REQUIRED: 'ロールIDは必須です',
    },
  },

  // 権限モジュール
  PERMISSION: {
    CREATE: {
      CODE_ALREADY_EXISTS: '権限コードは既に存在します',
    },
    COMMON: {
      NOT_FOUND: '権限が存在しません',
      ID_REQUIRED: '権限IDは必須です',
    },
  },

  // 部門モジュール
  DEPARTMENT: {
    CREATE: {
      ALREADY_EXISTS: '部門は既に存在します',
      PARENT_NOT_FOUND: '上位部門が存在しません',
    },
    UPDATE: {
      PARENT_NOT_FOUND: '上位部門が存在しません',
    },
    COMMON: {
      NOT_FOUND: '部門が存在しません',
      ID_REQUIRED: '部門IDは必須です',
    },
  },

  // プロジェクトモジュール
  PROJECT: {
    CREATE: {
      CODE_ALREADY_EXISTS: 'プロジェクトコードは既に存在します',
      MANAGER_NOT_FOUND: 'プロジェクトマネージャーが存在しません',
    },
    UPDATE: {
      MANAGER_NOT_FOUND: 'プロジェクトマネージャーが存在しません',
    },
    MEMBER: {
      ALREADY_EXISTS: 'このユーザーは既にプロジェクトメンバーです',
      USER_NOT_FOUND: 'ユーザーが存在しません',
    },
    COMMON: {
      NOT_FOUND: 'プロジェクトが存在しません',
      ID_REQUIRED: 'プロジェクトIDは必須です',
    },
  },

  // 工数モジュール
  TIMESHEET: {
    CREATE: {
      PROJECT_NOT_FOUND: 'プロジェクトが存在しません',
      PROJECT_NOT_IN_PROGRESS: '進行中のプロジェクトのみ工数を記録できます',
      NOT_PROJECT_MEMBER: 'このプロジェクトのメンバーではありません',
      FUTURE_DATE_NOT_ALLOWED: '未来の日付の工数は記録できません',
      DUPLICATE_RECORD: 'この日付には既に同じプロジェクトの工数記録が存在します',
    },
    SUBMIT: {
      NOT_OWNER: '自分の工数記録のみ提出できます',
      INVALID_STATUS: '下書きステータスの工数記録のみ提出できます',
    },
    REVIEW: {
      INVALID_STATUS: 'レビュー待ちステータスの工数のみレビューできます',
      NO_PERMISSION: 'この工数をレビューする権限がありません',
    },
    UPDATE: {
      NOT_OWNER: '自分の工数記録のみ編集できます',
      INVALID_STATUS: '下書きステータスの工数記録のみ編集できます',
      PROJECT_NOT_FOUND: 'プロジェクトが存在しません',
      PROJECT_NOT_IN_PROGRESS: '進行中のプロジェクトのみ工数を記録できます',
      NOT_PROJECT_MEMBER: 'このプロジェクトのメンバーではありません',
      FUTURE_DATE_NOT_ALLOWED: '未来の日付の工数は記録できません',
    },
    DELETE: {
      NOT_OWNER: '自分の工数記録のみ削除できます',
      INVALID_STATUS: '下書きステータスの工数記録のみ削除できます',
    },
    RECALL: {
      NOT_OWNER: '自分の工数記録のみ撤回できます',
      INVALID_STATUS: 'レビュー待ちステータスの工数記録のみ撤回できます',
    },
    COMMON: {
      NOT_FOUND: '工数記録が存在しません',
    },
  },
};

