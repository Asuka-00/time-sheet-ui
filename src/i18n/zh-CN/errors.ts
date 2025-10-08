// 错误消息中文翻译
export default {
  // 通用错误
  COMMON: {
    UNAUTHORIZED: '用户未登录',
    FORBIDDEN: '权限不足',
    NOT_FOUND: '资源不存在',
    INTERNAL_ERROR: '服务器内部错误',
    INVALID_TOKEN: '无效的令牌',
  },

  // 认证模块
  AUTH: {
    LOGIN: {
      INVALID_CREDENTIALS: '用户名或密码错误',
    },
    TOKEN: {
      INVALID_TYPE: '无效的令牌类型',
      USER_NOT_FOUND: '用户不存在',
      USER_DISABLED: '用户已被禁用',
    },
    CONFIG: {
      JWT_SECRET_MISSING: 'JWT密钥配置缺失',
    },
  },

  // 用户模块
  USER: {
    CREATE: {
      ALREADY_EXISTS: '用户已存在',
    },
    COMMON: {
      NOT_FOUND: '用户不存在',
      ID_REQUIRED: '用户ID不能为空',
    },
    PASSWORD: {
      OLD_PASSWORD_INCORRECT: '旧密码错误',
      SAME_AS_OLD: '新密码不能与旧密码相同',
    },
  },

  // 角色模块
  ROLE: {
    CREATE: {
      ALREADY_EXISTS: '角色已存在',
    },
    COMMON: {
      NOT_FOUND: '角色不存在',
      ID_REQUIRED: '角色ID不能为空',
    },
  },

  // 权限模块
  PERMISSION: {
    CREATE: {
      CODE_ALREADY_EXISTS: '权限代码已存在',
    },
    COMMON: {
      NOT_FOUND: '权限不存在',
      ID_REQUIRED: '权限ID不能为空',
    },
  },

  // 部门模块
  DEPARTMENT: {
    CREATE: {
      ALREADY_EXISTS: '部门已存在',
      PARENT_NOT_FOUND: '上级部门不存在',
    },
    UPDATE: {
      PARENT_NOT_FOUND: '上级部门不存在',
    },
    COMMON: {
      NOT_FOUND: '部门不存在',
      ID_REQUIRED: '部门ID不能为空',
    },
  },

  // 项目模块
  PROJECT: {
    CREATE: {
      CODE_ALREADY_EXISTS: '项目编码已存在',
      MANAGER_NOT_FOUND: '项目经理不存在',
    },
    UPDATE: {
      MANAGER_NOT_FOUND: '项目经理不存在',
    },
    MEMBER: {
      ALREADY_EXISTS: '该用户已是项目成员',
      USER_NOT_FOUND: '用户不存在',
    },
    COMMON: {
      NOT_FOUND: '项目不存在',
      ID_REQUIRED: '项目ID不能为空',
    },
  },

  // 工时模块
  TIMESHEET: {
    CREATE: {
      PROJECT_NOT_FOUND: '项目不存在',
      PROJECT_NOT_IN_PROGRESS: '只能为进行中的项目填报工时',
      NOT_PROJECT_MEMBER: '您不是该项目成员',
      FUTURE_DATE_NOT_ALLOWED: '不能填报未来日期的工时',
      DUPLICATE_RECORD: '该日期已存在该项目的工时记录',
    },
    SUBMIT: {
      NOT_OWNER: '只能提交自己的工时记录',
      INVALID_STATUS: '只能提交草稿状态的工时记录',
    },
    REVIEW: {
      INVALID_STATUS: '只能审核待审核状态的工时',
      NO_PERMISSION: '您没有权限审核此工时',
    },
    UPDATE: {
      NOT_OWNER: '只能修改自己的工时记录',
      INVALID_STATUS: '只能修改草稿状态的工时记录',
      PROJECT_NOT_FOUND: '项目不存在',
      PROJECT_NOT_IN_PROGRESS: '只能为进行中的项目填报工时',
      NOT_PROJECT_MEMBER: '您不是该项目成员',
      FUTURE_DATE_NOT_ALLOWED: '不能填报未来日期的工时',
    },
    DELETE: {
      NOT_OWNER: '只能删除自己的工时记录',
      INVALID_STATUS: '只能删除草稿状态的工时记录',
    },
    RECALL: {
      NOT_OWNER: '只能撤回自己的工时记录',
      INVALID_STATUS: '只能撤回待审核状态的工时记录',
    },
    COMMON: {
      NOT_FOUND: '工时记录不存在',
    },
  },
};

