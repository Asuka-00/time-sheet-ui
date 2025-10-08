export default {
  // Common validation
  COMMON: {
    REQUIRED: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    MUST_BE_STRING: 'Must be a string',
    MUST_BE_NUMBER: 'Must be a number',
  },

  // Password validation
  PASSWORD: {
    OLD_PASSWORD_REQUIRED: 'Old password is required',
    NEW_PASSWORD_REQUIRED: 'New password is required',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
    MIN_LENGTH: 'Password must be at least 6 characters',
  },

  // Timesheet validation
  TIMESHEET: {
    PROJECT_CODE_REQUIRED: 'Project code is required',
    WORK_DATE_REQUIRED: 'Work date is required',
    WORK_DATE_INVALID: 'Invalid work date format',
    HOURS_REQUIRED: 'Hours is required',
    HOURS_MUST_BE_NUMBER: 'Hours must be a number',
    HOURS_MIN: 'Hours cannot be less than 0.5',
    HOURS_MAX: 'Hours cannot be greater than 24',
    RECORDS_REQUIRED: 'Timesheet records list is required',
    RECORDS_MUST_BE_ARRAY: 'Timesheet records must be an array',
    RECORDS_MIN_SIZE: 'At least 1 timesheet record is required',
    RECORDS_MAX_SIZE: 'Maximum 50 timesheet records can be created at once',
  },
};

