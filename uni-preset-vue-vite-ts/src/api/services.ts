import request from './request';
import { STORAGE_KEYS } from './config';
import { TEST_CONFIG, isTestPhone, getTestAccount, isTestVerificationCode } from '../config/test';
import type {
  // 短信验证码
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifySmsResponse,
  // 用户认证
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  // 用户信息
  UserInfo,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  ChangePasswordRequest,
  // 供热账户
  BindHeatAccountRequest,
  BindHeatAccountResponse,
  HeatAccountInfo,
  // 缴费
  PaymentInfo,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatus,
  PaymentHistoryResponse,
  // 配置
  AgreementsResponse,
  SystemConfig,
  // 统计
  UserStatistics,
  // 健康检查
  HealthCheckResponse
} from './types';

/**
 * API服务类
 */
class ApiService {
  
  // =============== 短信验证码相关 ===============
  
  /**
   * 发送验证码
   */
  async sendSms(data: SendSmsRequest) {
    // 检查是否为测试手机号
    if (isTestPhone(data.phone)) {
      console.log('使用测试模式发送验证码:', data.phone);
      // 返回模拟的成功响应
      return {
        code: 200,
        message: '验证码发送成功（测试模式）',
        data: {
          phone: data.phone,
          expire_time: 300
        },
        timestamp: Date.now()
      };
    }
    
    return request.post<SendSmsResponse>('/api/sms/send', data);
  }

  /**
   * 验证验证码
   */
  async verifySms(data: VerifySmsRequest) {
    return request.post<VerifySmsResponse>('/api/sms/verify', data);
  }

  // =============== 用户认证相关 ===============
  
  /**
   * 用户登录
   */
  async login(data: LoginRequest) {
    // 检查是否为测试手机号和测试验证码
    if (isTestPhone(data.phone) && isTestVerificationCode(data.code)) {
      const testAccount = getTestAccount(data.phone);
      if (testAccount) {
        console.log('使用测试账号登录:', testAccount.phone);
        
        // 生成测试用的登录响应
        const testResponse = {
          code: 200,
          message: '登录成功（测试模式）',
          data: {
            token: `test_token_${Date.now()}`,
            refresh_token: `test_refresh_token_${Date.now()}`,
            expires_in: 7200,
            user_info: {
              id: `test_id_${testAccount.phone}`,
              phone: testAccount.phone,
              nickname: testAccount.nickname,
              avatar: '',
              is_first_login: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          },
          timestamp: Date.now()
        };
        
        // 保存测试数据
        this.saveAuthData(testResponse.data);
        return testResponse;
      }
    }
    
    // 正常模式登录 - 添加详细日志
    console.log('正常模式登录，请求数据:', data);
    console.log('请求URL: /api/auth/login');
    
    try {
      const response = await request.post<LoginResponse>('/api/auth/login', data);
      
      console.log('登录响应:', response);
      
      // 登录成功后保存token和用户信息
      if (response.code === 200 && response.data) {
        this.saveAuthData(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('登录请求失败，详细错误:', error);
      console.error('请求数据:', JSON.stringify(data, null, 2));
      
      // 特殊处理后端密码验证错误
      if (error instanceof Error && error.message && error.message.includes('密码长度不能超过20位')) {
        console.error('🐛 检测到后端密码验证bug:', {
          issue: '后端在登录时错误触发了密码字段验证',
          cause: 'bcrypt哈希值长度超过了数据模型中密码字段的maxlength限制',
          solution: '后端需要修改用户模型的密码字段验证规则',
          workaround: '前端已提供友好错误提示，建议用户使用测试账号'
        });
      }
      
      throw error;
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    // 检查是否为测试手机号和测试验证码
    if (isTestPhone(data.phone) && isTestVerificationCode(data.code)) {
      console.log('使用测试模式注册:', data.phone);
      
      // 检查测试账号是否已存在
      const existingAccount = getTestAccount(data.phone);
      if (existingAccount) {
        return {
          code: 1003,
          message: '用户已存在',
          data: null,
          timestamp: Date.now()
        };
      }
      
      // 返回模拟的注册成功响应
      return {
        code: 200,
        message: '注册成功（测试模式）',
        data: {
          user_id: `test_user_${Date.now()}`,
          phone: data.phone,
          nickname: data.nickname || `用户${data.phone.substring(7)}`,
          created_at: new Date().toISOString()
        },
        timestamp: Date.now()
      };
    }
    
    return request.post<RegisterResponse>('/api/auth/register', data);
  }

  /**
   * 刷新token
   */
  async refreshToken(data: RefreshTokenRequest) {
    const response = await request.post<RefreshTokenResponse>('/api/auth/refresh', data);
    
    // 刷新成功后更新token
    if (response.code === 200 && response.data) {
      request.setToken(response.data.token);
      uni.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
    }
    
    return response;
  }

  /**
   * 用户登出
   */
  async logout() {
    try {
      await request.post('/api/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论请求是否成功，都清除本地数据
      request.clearToken();
    }
  }

  /**
   * 保存认证数据
   */
  private saveAuthData(data: LoginResponse) {
    try {
      request.setToken(data.token);
      uni.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      uni.setStorageSync(STORAGE_KEYS.USER_INFO, data.user_info);
    } catch (error) {
      console.error('保存认证数据失败:', error);
    }
  }

  // =============== 用户信息相关 ===============
  
  /**
   * 获取用户信息
   */
  async getUserProfile() {
    return request.get<UserInfo>('/api/user/profile');
  }

  /**
   * 更新用户信息
   */
  async updateUserProfile(data: UpdateUserInfoRequest) {
    return request.put<UpdateUserInfoResponse>('/api/user/profile', data);
  }

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordRequest) {
    return request.put('/api/user/password', data);
  }

  // =============== 供热账户相关 ===============
  
  /**
   * 绑定供热账号
   */
  async bindHeatAccount(data: BindHeatAccountRequest) {
    return request.post<BindHeatAccountResponse>('/api/heat/bind', data);
  }

  /**
   * 获取供热账户信息
   */
  async getHeatAccount() {
    return request.get<HeatAccountInfo>('/api/heat/account');
  }

  // =============== 缴费相关 ===============
  
  /**
   * 获取缴费信息
   */
  async getPaymentInfo() {
    return request.get<PaymentInfo>('/api/payment/info');
  }

  /**
   * 创建支付订单
   */
  async createPayment(data: CreatePaymentRequest) {
    return request.post<CreatePaymentResponse>('/api/payment/create', data);
  }

  /**
   * 查询支付状态
   */
  async getPaymentStatus(orderId: string) {
    return request.get<PaymentStatus>(`/api/payment/status/${orderId}`);
  }

  /**
   * 获取缴费记录
   */
  async getPaymentHistory(params?: {
    page?: number;
    size?: number;
    start_date?: string;
    end_date?: string;
  }) {
    const queryString = params ? '?' + Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&') : '';
    
    return request.get<PaymentHistoryResponse>(`/api/payment/history${queryString}`);
  }

  // =============== 配置相关 ===============
  
  /**
   * 获取用户协议和隐私政策
   */
  async getAgreements() {
    return request.get<AgreementsResponse>('/api/config/agreements');
  }

  /**
   * 获取系统配置
   */
  async getSystemConfig() {
    return request.get<SystemConfig>('/api/config/system');
  }

  // =============== 统计相关 ===============
  
  /**
   * 获取用户统计数据
   */
  async getUserStatistics() {
    return request.get<UserStatistics>('/api/statistics/user');
  }

  // =============== 健康检查 ===============
  
  /**
   * 健康检查
   */
  async healthCheck() {
    return request.get<HealthCheckResponse>('/health');
  }

  // =============== 工具方法 ===============
  
  /**
   * 获取本地存储的用户信息
   */
  getUserInfoFromStorage(): UserInfo | null {
    try {
      return uni.getStorageSync(STORAGE_KEYS.USER_INFO) || null;
    } catch (error) {
      console.error('获取本地用户信息失败:', error);
      return null;
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    try {
      const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
      return !!token;
    } catch (error) {
      console.error('检查登录状态失败:', error);
      return false;
    }
  }

  /**
   * 获取当前token
   */
  getToken(): string {
    try {
      return uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';
    } catch (error) {
      console.error('获取token失败:', error);
      return '';
    }
  }
}

// 创建API服务实例
const apiService = new ApiService();

export { apiService };
export default apiService; 