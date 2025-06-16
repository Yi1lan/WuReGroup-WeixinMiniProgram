// 用户信息类型
export interface UserInfo {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  real_name?: string;
  id_card?: string;
  address?: string;
  heat_account?: string;
  balance?: number;
  is_first_login?: boolean;
  created_at: string;
  updated_at: string;
}

// 短信验证码相关
export interface SendSmsRequest {
  phone: string;
  type: 'login' | 'register' | 'reset_password';
}

export interface SendSmsResponse {
  phone: string;
  expire_time: number;
}

export interface VerifySmsRequest {
  phone: string;
  code: string;
  type: 'login' | 'register' | 'reset_password';
}

export interface VerifySmsResponse {
  is_valid: boolean;
}

// 用户认证相关
export interface LoginRequest {
  phone: string;
  code: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  user_info: UserInfo;
}

export interface RegisterRequest {
  phone: string;
  code: string;
  password: string;
  nickname?: string;
}

export interface RegisterResponse {
  user_id: string;
  phone: string;
  nickname: string;
  created_at: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
}

// 用户信息相关
export interface UpdateUserInfoRequest {
  nickname?: string;
  real_name?: string;
  id_card?: string;
  address?: string;
}

export interface UpdateUserInfoResponse {
  updated_fields: string[];
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  phone: string;
  code: string;
}

// 供热账户相关
export interface BindHeatAccountRequest {
  heat_account: string;
  real_name: string;
  id_card: string;
  address: string;
}

export interface BindHeatAccountResponse {
  heat_account: string;
  real_name: string;
  address: string;
  heating_area: number;
  heating_fee: number;
  bind_time: string;
}

export interface HeatAccountInfo {
  heat_account: string;
  real_name: string;
  address: string;
  heating_area: number;
  current_balance: number;
  total_fee: number;
  paid_fee: number;
  unpaid_fee: number;
  heating_season: string;
  payment_deadline: string;
  heating_start: string;
  heating_end: string;
}

// 缴费相关
export interface Bill {
  bill_id: string;
  heating_season: string;
  amount: number;
  bill_date: string;
  due_date: string;
  status: 'unpaid' | 'paid' | 'overdue';
  late_fee: number;
}

export interface PaymentInfo {
  heat_account: string;
  unpaid_bills: Bill[];
  total_unpaid: number;
  total_late_fee: number;
}

export interface CreatePaymentRequest {
  bill_ids: string[];
  amount: number;
}

export interface WechatPayParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

export interface CreatePaymentResponse {
  order_id: string;
  amount: number;
  wechat_pay_params: WechatPayParams;
  created_at: string;
}

export interface PaymentStatus {
  order_id: string;
  status: 'pending' | 'paid' | 'failed' | 'canceled';
  amount: number;
  paid_at?: string;
  payment_method: string;
}

export interface PaymentRecord {
  order_id: string;
  bill_id: string;
  amount: number;
  heating_season: string;
  payment_method: string;
  status: string;
  paid_at: string;
  receipt_url: string;
}

export interface PaymentHistoryResponse {
  total: number;
  page: number;
  size: number;
  records: PaymentRecord[];
}

// 配置相关
export interface Agreement {
  title: string;
  content: string;
  version: string;
  updated_at: string;
}

export interface AgreementsResponse {
  user_agreement: Agreement;
  privacy_policy: Agreement;
}

export interface SystemConfig {
  customer_service_phone: string;
  business_hours: string;
  company_name: string;
  company_address: string;
  app_version: string;
  announcement: string;
  maintenance_notice?: string;
}

// 统计数据
export interface UserStatistics {
  total_heating_seasons: number;
  total_paid_amount: number;
  current_season_paid: number;
  average_monthly_consumption: number;
  on_time_payment_rate: number;
}

// 健康检查
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  mongodb: string;
} 