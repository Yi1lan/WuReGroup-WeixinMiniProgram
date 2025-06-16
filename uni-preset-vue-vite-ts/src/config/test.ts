// 测试配置文件
export const TEST_CONFIG = {
  // 是否启用测试模式（生产环境应该设置为false）
  ENABLE_TEST_MODE: true,
  
  // 测试验证码（固定验证码，用于测试）
  TEST_VERIFICATION_CODE: '888888',
  
  // 测试账号列表
  TEST_ACCOUNTS: [
    {
      phone: '13800000001',
      nickname: '测试管理员',
      password: '123456',
      role: 'admin'
    },
    {
      phone: '13800000002', 
      nickname: '测试用户1',
      password: '123456',
      role: 'user'
    },
    {
      phone: '13800000003',
      nickname: '测试用户2', 
      password: '123456',
      role: 'user'
    }
  ],
  
  // 测试手机号前缀（以此开头的手机号将使用测试模式）
  TEST_PHONE_PREFIX: '138000000',
  
  // 测试提示信息
  TEST_MESSAGES: {
    TEST_MODE_ENABLED: '当前为测试模式，可使用测试账号登录',
    TEST_CODE_HINT: '测试验证码：888888',
    TEST_ACCOUNT_HINT: '测试账号：13800000001-13800000003'
  }
};

// 检查是否为测试手机号
export const isTestPhone = (phone: string): boolean => {
  if (!TEST_CONFIG.ENABLE_TEST_MODE) return false;
  return phone.startsWith(TEST_CONFIG.TEST_PHONE_PREFIX);
};

// 获取测试账号信息
export const getTestAccount = (phone: string) => {
  return TEST_CONFIG.TEST_ACCOUNTS.find(account => account.phone === phone);
};

// 检查是否为测试验证码
export const isTestVerificationCode = (code: string): boolean => {
  return TEST_CONFIG.ENABLE_TEST_MODE && code === TEST_CONFIG.TEST_VERIFICATION_CODE;
}; 