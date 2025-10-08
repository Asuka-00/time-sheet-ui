export default {
  // 共通検証
  COMMON: {
    REQUIRED: 'このフィールドは必須です',
    INVALID_FORMAT: 'フォーマットが正しくありません',
    MUST_BE_STRING: '文字列である必要があります',
    MUST_BE_NUMBER: '数値である必要があります',
  },

  // パスワード検証
  PASSWORD: {
    OLD_PASSWORD_REQUIRED: '古いパスワードは必須です',
    NEW_PASSWORD_REQUIRED: '新しいパスワードは必須です',
    CONFIRM_PASSWORD_REQUIRED: 'パスワード確認は必須です',
    MIN_LENGTH: 'パスワードは6文字以上である必要があります',
  },

  // 工数検証
  TIMESHEET: {
    PROJECT_CODE_REQUIRED: 'プロジェクトコードは必須です',
    WORK_DATE_REQUIRED: '作業日は必須です',
    WORK_DATE_INVALID: '作業日のフォーマットが正しくありません',
    HOURS_REQUIRED: '工数時間は必須です',
    HOURS_MUST_BE_NUMBER: '工数時間は数値である必要があります',
    HOURS_MIN: '工数時間は0.5時間以上である必要があります',
    HOURS_MAX: '工数時間は24時間以下である必要があります',
    RECORDS_REQUIRED: '工数記録リストは必須です',
    RECORDS_MUST_BE_ARRAY: '工数記録リストは配列である必要があります',
    RECORDS_MIN_SIZE: '少なくとも1つの工数記録を作成する必要があります',
    RECORDS_MAX_SIZE: '一度に作成できる工数記録は最大50件です',
  },
};

