import { apiService } from '@/api';

/**
 * 认证工具类
 */
export class AuthUtils {
  
  /**
   * 检查登录状态并跳转
   * @param requireAuth 是否需要登录
   * @param redirectUrl 未登录时跳转的URL
   */
  static checkAuthAndRedirect(requireAuth: boolean = true, redirectUrl: string = '/pages/login/index') {
    const isLoggedIn = apiService.isLoggedIn();
    
    if (requireAuth && !isLoggedIn) {
      // 需要登录但未登录，跳转到登录页
      uni.reLaunch({
        url: redirectUrl
      });
      return false;
    }
    
    if (!requireAuth && isLoggedIn) {
      // 不需要登录但已登录（如登录页、注册页），跳转到首页
      uni.reLaunch({
        url: '/pages/index/index'
      });
      return false;
    }
    
    return true;
  }
  
  /**
   * 登出并跳转
   */
  static async logout() {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/index'
      });
    }
  }
  
  /**
   * 获取用户信息
   */
  static getUserInfo() {
    return apiService.getUserInfoFromStorage();
  }
  
  /**
   * 检查token是否即将过期并自动刷新
   */
  static async checkAndRefreshToken() {
    // 这里可以添加token过期检查逻辑
    // 由于JWT token中包含过期时间，可以解析token检查
    // 简化处理：在请求拦截器中统一处理token刷新
    return true;
  }
}

/**
 * 页面路由守卫 - 在页面onShow中调用
 * @param requireAuth 是否需要登录
 */
export function useAuthGuard(requireAuth: boolean = true) {
  return AuthUtils.checkAuthAndRedirect(requireAuth);
}

/**
 * 验证手机号格式
 */
export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证验证码格式
 */
export function validateCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * 验证密码格式
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20;
} 