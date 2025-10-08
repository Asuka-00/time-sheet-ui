export default {
  // 共通成功メッセージ
  COMMON: {
    SUCCESS: '操作が成功しました',
  },

  // 認証モジュール
  AUTH: {
    LOGIN: {
      SUCCESS: 'ログインに成功しました',
    },
    REGISTER: {
      SUCCESS: '登録に成功しました',
    },
    REFRESH_TOKEN: {
      SUCCESS: 'トークンの更新に成功しました',
    },
    GET_USER_INFO: {
      SUCCESS: 'ユーザー情報の取得に成功しました',
    },
  },

  // ユーザーモジュール
  USER: {
    RESET_PASSWORD: {
      SUCCESS: 'パスワードのリセットに成功しました',
    },
    CHANGE_PASSWORD: {
      SUCCESS: 'パスワードの変更に成功しました',
    },
  },

  // 工数モジュール
  TIMESHEET: {
    CREATE: {
      SUCCESS: '工数記録の作成に成功しました',
    },
    BATCH_CREATE: {
      SUCCESS: '一括作成に成功しました',
    },
    UPDATE: {
      SUCCESS: '工数記録の更新に成功しました',
    },
    DELETE: {
      SUCCESS: '工数記録の削除に成功しました',
    },
    SUBMIT: {
      SUCCESS: '工数記録の提出に成功しました',
    },
    BATCH_SUBMIT: {
      SUCCESS: '一括提出に成功しました',
    },
    WITHDRAW: {
      SUCCESS: '工数記録の撤回に成功しました',
    },
    REVIEW: {
      SUCCESS: '工数レビューが完了しました',
    },
    BATCH_REVIEW: {
      SUCCESS: '一括レビューが完了しました',
    },
  },
};

