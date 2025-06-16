// API配置
export const API_CONFIG = {
  // 生产环境
  BASE_URL: 'https://cpdllqnupdei.sealosbja.site',
  // 开发环境 - 如果需要切换到开发环境，修改这里
  // BASE_URL: 'http://localhost:3000',
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // 请求头
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// 响应状态码
export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  // 业务错误码
  PHONE_FORMAT_ERROR: 1001,
  CODE_ERROR: 1002,
  USER_EXISTS: 1003,
  USER_NOT_EXISTS: 1004,
  PASSWORD_ERROR: 1005,
  CODE_EXPIRED: 1006,
  CODE_SEND_FAILED: 1007,
  RATE_LIMIT: 1008
};

// Token存储键名
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info'
}; 