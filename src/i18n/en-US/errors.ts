// Error messages in English
export default {
  // Common errors
  COMMON: {
    UNAUTHORIZED: 'User not logged in',
    FORBIDDEN: 'Permission denied',
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
    INVALID_TOKEN: 'Invalid token',
  },

  // Authentication module
  AUTH: {
    LOGIN: {
      INVALID_CREDENTIALS: 'Invalid username or password',
    },
    TOKEN: {
      INVALID_TYPE: 'Invalid token type',
      USER_NOT_FOUND: 'User not found',
      USER_DISABLED: 'User has been disabled',
    },
    CONFIG: {
      JWT_SECRET_MISSING: 'JWT secret configuration missing',
    },
  },

  // User module
  USER: {
    CREATE: {
      ALREADY_EXISTS: 'User already exists',
    },
    COMMON: {
      NOT_FOUND: 'User not found',
      ID_REQUIRED: 'User ID is required',
    },
    PASSWORD: {
      OLD_PASSWORD_INCORRECT: 'Incorrect old password',
      SAME_AS_OLD: 'New password cannot be the same as old password',
    },
  },

  // Role module
  ROLE: {
    CREATE: {
      ALREADY_EXISTS: 'Role already exists',
    },
    COMMON: {
      NOT_FOUND: 'Role not found',
      ID_REQUIRED: 'Role ID is required',
    },
  },

  // Permission module
  PERMISSION: {
    CREATE: {
      CODE_ALREADY_EXISTS: 'Permission code already exists',
    },
    COMMON: {
      NOT_FOUND: 'Permission not found',
      ID_REQUIRED: 'Permission ID is required',
    },
  },

  // Department module
  DEPARTMENT: {
    CREATE: {
      ALREADY_EXISTS: 'Department already exists',
      PARENT_NOT_FOUND: 'Parent department not found',
    },
    UPDATE: {
      PARENT_NOT_FOUND: 'Parent department not found',
    },
    COMMON: {
      NOT_FOUND: 'Department not found',
      ID_REQUIRED: 'Department ID is required',
    },
  },

  // Project module
  PROJECT: {
    CREATE: {
      CODE_ALREADY_EXISTS: 'Project code already exists',
      MANAGER_NOT_FOUND: 'Project manager not found',
    },
    UPDATE: {
      MANAGER_NOT_FOUND: 'Project manager not found',
    },
    MEMBER: {
      ALREADY_EXISTS: 'User is already a project member',
      USER_NOT_FOUND: 'User not found',
    },
    COMMON: {
      NOT_FOUND: 'Project not found',
      ID_REQUIRED: 'Project ID is required',
    },
  },

  // Report Configuration module
  REPORT_CONFIG: {
    CREATE: {
      TYPE_ALREADY_EXISTS: 'Report type already exists',
    },
    UPDATE: {
      NOT_FOUND: 'Report configuration not found',
    },
    DELETE: {
      NOT_FOUND: 'Report configuration not found',
    },
    COMMON: {
      NOT_FOUND: 'Report configuration not found',
      ID_REQUIRED: 'Report configuration ID is required',
    },
  },

  // Timesheet module
  TIMESHEET: {
    CREATE: {
      PROJECT_NOT_FOUND: 'Project not found',
      PROJECT_NOT_IN_PROGRESS: 'Can only submit timesheets for projects in progress',
      NOT_PROJECT_MEMBER: 'You are not a member of this project',
      FUTURE_DATE_NOT_ALLOWED: 'Cannot submit timesheets for future dates',
      DUPLICATE_RECORD: 'A timesheet record already exists for this project on this date',
      HOLIDAY_NOT_ALLOWED: 'Cannot submit timesheets on holidays',
    },
    SUBMIT: {
      NOT_OWNER: 'Can only submit your own timesheets',
      INVALID_STATUS: 'Can only submit timesheets in draft status',
    },
    REVIEW: {
      INVALID_STATUS: 'Can only review timesheets pending approval',
      NO_PERMISSION: 'You do not have permission to review this timesheet',
    },
    UPDATE: {
      NOT_OWNER: 'Can only update your own timesheets',
      INVALID_STATUS: 'Can only update timesheets in draft status',
      PROJECT_NOT_FOUND: 'Project not found',
      PROJECT_NOT_IN_PROGRESS: 'Can only submit timesheets for projects in progress',
      NOT_PROJECT_MEMBER: 'You are not a member of this project',
      FUTURE_DATE_NOT_ALLOWED: 'Cannot submit timesheets for future dates',
      HOLIDAY_NOT_ALLOWED: 'Cannot submit timesheets on holidays',
    },
    DELETE: {
      NOT_OWNER: 'Can only delete your own timesheets',
      INVALID_STATUS: 'Can only delete timesheets in draft status',
    },
    RECALL: {
      NOT_OWNER: 'Can only recall your own timesheets',
      INVALID_STATUS: 'Can only recall timesheets pending approval',
    },
    COMMON: {
      NOT_FOUND: 'Timesheet record not found',
    },
  },

  // WebSocket module
  WEBSOCKET: {
    AUTH: {
      NO_TOKEN: 'WebSocket connection missing authentication token',
      INVALID_TOKEN: 'Invalid WebSocket authentication token',
    },
    CONNECTION: {
      FAILED: 'WebSocket connection failed',
    },
  },
};
