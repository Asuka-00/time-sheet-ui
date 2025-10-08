export default {
  // 通用验证
  COMMON: {
    REQUIRED: '此字段不能为空',
    INVALID_FORMAT: '格式不正确',
    MUST_BE_STRING: '必须是字符串',
    MUST_BE_NUMBER: '必须是数字',
  },

  // 密码验证
  PASSWORD: {
    OLD_PASSWORD_REQUIRED: '旧密码不能为空',
    NEW_PASSWORD_REQUIRED: '新密码不能为空',
    CONFIRM_PASSWORD_REQUIRED: '确认密码不能为空',
    MIN_LENGTH: '密码长度至少为6位',
  },

  // 工时验证
  TIMESHEET: {
    PROJECT_CODE_REQUIRED: '项目编码不能为空',
    WORK_DATE_REQUIRED: '工作日期不能为空',
    WORK_DATE_INVALID: '工作日期格式不正确',
    HOURS_REQUIRED: '工时小时数不能为空',
    HOURS_MUST_BE_NUMBER: '工时小时数必须为数字',
    HOURS_MIN: '工时小时数不能小于0.5',
    HOURS_MAX: '工时小时数不能大于24',
    RECORDS_REQUIRED: '工时记录列表不能为空',
    RECORDS_MUST_BE_ARRAY: '工时记录列表必须是数组',
    RECORDS_MIN_SIZE: '至少需要创建1条工时记录',
    RECORDS_MAX_SIZE: '单次最多创建50条工时记录',
  },
};

