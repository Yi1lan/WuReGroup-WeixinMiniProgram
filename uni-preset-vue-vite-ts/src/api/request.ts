import { API_CONFIG, STATUS_CODES, STORAGE_KEYS } from './config';

// 请求响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 请求配置类型
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
  headers?: any;
  timeout?: number;
}

class Request {
  private baseURL: string;
  private timeout: number;
  private headers: any;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.headers = API_CONFIG.HEADERS;
  }

  // 获取存储的token
  private getToken(): string {
    try {
      return uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';
    } catch (error) {
      console.error('获取token失败:', error);
      return '';
    }
  }

  // 设置token
  public setToken(token: string): void {
    try {
      uni.setStorageSync(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('设置token失败:', error);
    }
  }

  // 清除token
  public clearToken(): void {
    try {
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('清除token失败:', error);
    }
  }

  // 请求拦截器
  private requestInterceptor(config: RequestConfig): RequestConfig {
    // 处理URL
    if (!config.url.startsWith('http')) {
      config.url = this.baseURL + config.url;
    }

    // 不需要token的接口列表
    const noTokenUrls = [
      '/api/auth/login',
      '/api/auth/register', 
      '/api/sms/send',
      '/api/sms/verify',
      '/health',
      '/api/config/agreements',
      '/api/config/system'
    ];
    
    // 检查是否需要添加token
    const needsToken = !noTokenUrls.some(url => config.url.includes(url));
    
    if (needsToken) {
      // 添加token到请求头
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    }

    console.log('请求配置:', config);
    console.log('是否需要token:', needsToken);
    return config;
  }

  // 响应拦截器
  private async responseInterceptor<T>(response: any): Promise<ApiResponse<T>> {
    console.log('响应数据:', response);

    // 先尝试解析响应体，看是否包含有效的业务数据
    let result: ApiResponse<T>;
    
    try {
      result = response.data;
      console.log('解析到业务响应结果:', result);
    } catch (parseError) {
      console.error('响应数据解析失败:', parseError);
      // 如果无法解析响应体，按HTTP错误处理
      if (response.statusCode !== 200) {
        const errorMessage = this.getHttpErrorMessage(response.statusCode);
        console.error('HTTP错误:', response.statusCode, errorMessage);
        uni.showToast({
          title: errorMessage,
          icon: 'none'
        });
        throw new Error(errorMessage);
      }
      throw parseError;
    }

    // 如果响应体包含有效的业务代码，按业务逻辑处理（无论HTTP状态码如何）
    if (result && typeof result.code === 'number') {
      console.log('按业务逻辑处理响应');
      
      // 处理业务状态码
      if (result.code !== STATUS_CODES.SUCCESS) {
        console.error('业务错误:', result.code, result.message);
        
        // token失效，清除本地数据并跳转到登录页
        if (result.code === STATUS_CODES.UNAUTHORIZED) {
          this.clearToken();
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          });
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/index'
            });
          }, 1500);
          throw new Error(result.message);
        }

        // 其他业务错误，显示错误信息
        uni.showToast({
          title: result.message || '请求失败',
          icon: 'none'
        });
        throw new Error(result.message);
      }

      return result;
    } else {
      // 如果响应体不包含有效的业务代码，按HTTP状态码处理
      if (response.statusCode !== 200) {
        const errorMessage = this.getHttpErrorMessage(response.statusCode);
        console.error('HTTP错误:', response.statusCode, errorMessage);
        uni.showToast({
          title: errorMessage,
          icon: 'none'
        });
        throw new Error(errorMessage);
      }
      
      return result;
    }
  }

  // 获取HTTP错误信息
  private getHttpErrorMessage(statusCode: number): string {
    const errorMap: { [key: number]: string } = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '禁止访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };
    return errorMap[statusCode] || `请求失败 (${statusCode})`;
  }

  // 通用请求方法
  public async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      // 请求拦截
      const requestConfig = this.requestInterceptor(config);

      // 发起请求
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: requestConfig.url,
          method: requestConfig.method || 'GET',
          data: requestConfig.data,
          header: {
            ...this.headers,
            ...requestConfig.headers
          },
          timeout: requestConfig.timeout || this.timeout,
          success: resolve,
          fail: (error) => {
            console.error('请求失败:', error);
            uni.showToast({
              title: '网络请求失败',
              icon: 'none'
            });
            reject(new Error('网络请求失败'));
          }
        });
      });

      // 响应拦截
      return await this.responseInterceptor<T>(response);
    } catch (error: any) {
      console.error('请求异常:', error);
      throw error;
    }
  }

  // GET请求
  public get<T = any>(url: string, params?: any, headers?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      headers
    });
  }

  // POST请求
  public post<T = any>(url: string, data?: any, headers?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      headers
    });
  }

  // PUT请求
  public put<T = any>(url: string, data?: any, headers?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      headers
    });
  }

  // DELETE请求
  public delete<T = any>(url: string, params?: any, headers?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      params,
      headers
    });
  }
}

// 创建请求实例
const request = new Request();

export { request };
export default request; 