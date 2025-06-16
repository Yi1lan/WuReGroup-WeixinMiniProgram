<template>
  <view class="page-container">
    <!-- 现代化背景设计 -->
    <view class="background-container">
      <view class="gradient-bg"></view>
      <view class="geometric-pattern">
        <view class="pattern-circle circle-1"></view>
        <view class="pattern-circle circle-2"></view>
        <view class="pattern-circle circle-3"></view>
        <view class="pattern-element element-1"></view>
        <view class="pattern-element element-2"></view>
      </view>
    </view>
    
    <scroll-view class="content-area" scroll-y="true">
      <!-- 顶部品牌区域 -->
      <view class="brand-section">
        <view class="brand-header">
          <view class="brand-title-section">
            <view class="brand-main-title">精准暖费速办</view>
          </view>
          <view class="brand-subtitle-section">
            <view class="brand-sub-title">乌鲁木齐热力集团有限公司</view>
          </view>
        </view>
      </view>
      
      <!-- 主卡片容器 -->
      <view class="main-card">
        <view class="card-header">
          <view class="title-section">
            <text class="page-title">创建账户</text>
          </view>
          <view class="description-section">
            <text class="page-description">填写基本信息，享受便捷的暖气缴费服务</text>
          </view>
        </view>
        
        <!-- 表单区域 -->
        <view class="form-container">
          <view class="input-group">
            <view class="input-wrapper">
              <view class="input-label">
                <text class="label-text">手机号</text>
              </view>
              <view class="input-box">
                <input 
                  class="form-input" 
                  type="number" 
                  placeholder="请输入手机号码" 
                  placeholder-class="input-placeholder"
                  maxlength="11"
                  v-model="phone"
                />
              </view>
            </view>
          </view>

          <view class="input-group">
            <view class="input-wrapper">
              <view class="input-label">
                <text class="label-text">验证码</text>
              </view>
              <view class="input-box verification-box">
                <input 
                  class="form-input verification-input" 
                  type="number" 
                  placeholder="请输入验证码" 
                  placeholder-class="input-placeholder"
                  maxlength="6"
                  v-model="verificationCode"
                />
                <button 
                  class="code-button" 
                  :class="{ 'code-button-disabled': isGettingCode }"
                  :disabled="isGettingCode" 
                  @click="getVerificationCode"
                >
                  <text class="code-button-text">{{ codeButtonText }}</text>
                </button>
              </view>
            </view>
          </view>
          
          <view class="input-group">
            <view class="input-wrapper">
              <view class="input-label">
                <text class="label-text">设置密码</text>
              </view>
              <view class="input-box">
                <input 
                  class="form-input" 
                  type="password" 
                  placeholder="请设置6-20位密码" 
                  placeholder-class="input-placeholder"
                  maxlength="20"
                  v-model="password"
                />
              </view>
            </view>
          </view>
          
          <view class="input-group">
            <view class="input-wrapper">
              <view class="input-label">
                <text class="label-text">确认密码</text>
              </view>
              <view class="input-box">
                <input 
                  class="form-input" 
                  type="password" 
                  placeholder="请再次输入密码" 
                  placeholder-class="input-placeholder"
                  maxlength="20"
                  v-model="confirmPassword"
                />
              </view>
            </view>
          </view>
          
          <!-- 主要操作按钮 -->
          <view class="action-section">
            <button class="primary-button" @click="register">
              <text class="primary-button-text">创建账户</text>
            </button>
          </view>
          
          <!-- 测试模式 -->
          <view v-if="isTestMode" class="test-panel">
            <view class="test-header">
              <text class="test-title">开发测试模式</text>
            </view>
            <view class="test-content">
              <text class="test-hint">{{ TEST_CONFIG.TEST_MESSAGES.TEST_CODE_HINT }}</text>
              <text class="test-hint">测试手机号：可使用13800000004-13800000099</text>
              <button class="test-fill-button" @click="fillTestData">填入测试数据</button>
            </view>
          </view>
          
          <!-- 次要操作 -->
          <view class="secondary-actions">
            <button class="secondary-button" @click="goToLogin">
              <text class="secondary-button-text">已有账号？立即登录</text>
            </button>
          </view>
        </view>
      </view>
      
      <!-- 底部协议区域 -->
      <view class="footer-section">
        <view class="agreement-text-container">
          <text class="agreement-text">注册即表示您同意</text>
          <text class="agreement-link" @click="openUserAgreement">《用户协议》</text>
          <text class="agreement-text">和</text>
          <text class="agreement-link" @click="openPrivacyPolicy">《隐私政策》</text>
        </view>
        <view class="footer-brand">
          <text class="footer-text">温暖服务每一天</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apiService } from '@/api';
import { validatePhone, validateCode, validatePassword } from '@/utils/auth';
import { TEST_CONFIG, isTestPhone } from '@/config/test';

// 手机号、验证码和密码
const phone = ref('');
const verificationCode = ref('');
const password = ref('');
const confirmPassword = ref('');
const isTestMode = ref(TEST_CONFIG.ENABLE_TEST_MODE);

// 验证码按钮状态
const isGettingCode = ref(false);
const countdown = ref(60);
const codeButtonText = computed(() => {
  if (isGettingCode.value) {
    return `${countdown.value}秒后重新获取`;
  }
  return '获取验证码';
});

// 获取验证码
const getVerificationCode = async () => {
  // 验证手机号
  if (!validatePhone(phone.value)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none'
    });
    return;
  }
  
  // 防止重复点击
  if (isGettingCode.value) return;
  
  try {
    uni.showLoading({
      title: '发送中...'
    });

    console.log('发送验证码请求:', { phone: phone.value, type: 'register' });

    // 调用发送验证码API
    const response = await apiService.sendSms({
      phone: phone.value,
      type: 'register'
    });

    uni.hideLoading();
    console.log('发送验证码响应:', response);

    if (response.code === 200) {
      // 开始倒计时
      isGettingCode.value = true;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          isGettingCode.value = false;
          countdown.value = 60;
        }
      }, 1000);

      uni.showToast({
        title: `验证码已发送至${phone.value}，请查收短信`,
        icon: 'success',
        duration: 3000
      });
    }
  } catch (error: any) {
    uni.hideLoading();
    console.error('发送验证码失败:', error);
    console.error('错误详情:', error.message);
    
    // 如果错误信息没有在拦截器中显示，手动显示
    if (error.message && !error.message.includes('请求失败')) {
      uni.showToast({
        title: error.message || '发送验证码失败，请重试',
        icon: 'none'
      });
    }
  }
};

// 注册
const register = async () => {
  // 验证手机号
  if (!validatePhone(phone.value)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none'
    });
    return;
  }
  
  // 验证验证码
  if (!validateCode(verificationCode.value)) {
    uni.showToast({
      title: '请输入6位数字验证码',
      icon: 'none'
    });
    return;
  }
  
  // 检查是否已发送验证码
  if (!isGettingCode.value && countdown.value === 60) {
    uni.showToast({
      title: '请先获取验证码',
      icon: 'none'
    });
    return;
  }
  
  // 验证密码
  if (!validatePassword(password.value)) {
    uni.showToast({
      title: '密码长度应为6-20位',
      icon: 'none'
    });
    return;
  }
  
  // 验证两次密码是否一致
  if (password.value !== confirmPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  try {
    uni.showLoading({
      title: '注册中...'
    });

    // 准备注册数据
    const registerData = {
      phone: phone.value,
      code: verificationCode.value,
      password: password.value,
      nickname: `用户${phone.value.substring(7)}`  // 使用手机号后4位作为默认昵称
    };
    
    console.log('注册请求数据:', registerData);

    // 调用注册API
    const response = await apiService.register(registerData);

    uni.hideLoading();
    console.log('注册响应:', response);

    if (response.code === 200) {
      uni.showToast({
        title: '注册成功，请登录',
        icon: 'success',
        duration: 2000
      });
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        console.log('注册成功，跳转到登录页面');
        jumpToLogin();
      }, 2000);
    }
  } catch (error: any) {
    uni.hideLoading();
    console.error('注册失败详情:', error);
    console.error('错误堆栈:', error.stack);
    
    // 根据错误类型提供具体的提示
    let errorMessage = '注册失败，请重试';
    
    if (error.message) {
      if (error.message.includes('验证码错误')) {
        errorMessage = '验证码错误，请重新获取验证码';
      } else if (error.message.includes('用户已存在')) {
        errorMessage = '该手机号已注册，即将跳转到登录页';
        // 用户已存在时，延迟跳转到登录页面
        setTimeout(() => {
          console.log('用户已存在，跳转到登录页面');
          jumpToLogin();
        }, 2500);
      } else if (error.message.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络';
      } else {
        errorMessage = error.message;
      }
    }
    
    uni.showToast({
      title: errorMessage,
      icon: error.message?.includes('用户已存在') ? 'success' : 'none',
      duration: error.message?.includes('用户已存在') ? 2000 : 3000
    });
  }
};

// 跳转到登录页面（注册成功后使用）
const jumpToLogin = () => {
  console.log('执行跳转到登录页面');
  
  // 方法1：尝试使用 reLaunch（推荐，会清空页面栈）
  uni.reLaunch({
    url: '/pages/login/index',
    success: () => {
      console.log('reLaunch 跳转登录页面成功');
    },
    fail: (err) => {
      console.error('reLaunch 跳转失败:', err);
      
      // 方法2：尝试使用 redirectTo
      uni.redirectTo({
        url: '/pages/login/index',
        success: () => {
          console.log('redirectTo 跳转登录页面成功');
        },
        fail: (redirectErr) => {
          console.error('redirectTo 跳转失败:', redirectErr);
          
          // 方法3：尝试使用 navigateTo
          uni.navigateTo({
            url: '/pages/login/index',
            success: () => {
              console.log('navigateTo 跳转登录页面成功');
            },
            fail: (navErr) => {
              console.error('所有跳转方法都失败:', navErr);
              uni.showToast({
                title: '跳转失败，请手动返回登录页',
                icon: 'none',
                duration: 3000
              });
            }
          });
        }
      });
    }
  });
};

// 填入测试数据
const fillTestData = () => {
  phone.value = '13800000004';
  verificationCode.value = TEST_CONFIG.TEST_VERIFICATION_CODE;
  password.value = '123456';
  confirmPassword.value = '123456';
  
  uni.showToast({
    title: '已填入测试数据',
    icon: 'success'
  });
};

// 防抖状态
const isNavigating = ref(false);

// 跳转到登录页面
const goToLogin = () => {
  // 防止重复点击
  if (isNavigating.value) return;
  
  isNavigating.value = true;
  
  uni.redirectTo({
    url: '/pages/login/index',
    complete: () => {
      // 重置防抖状态
      setTimeout(() => {
        isNavigating.value = false;
      }, 1000);
    }
  });
};

// 打开用户协议
const openUserAgreement = async () => {
  console.log('打开用户协议');
  try {
    const response = await apiService.getAgreements();
    if (response.code === 200 && response.data.user_agreement) {
      uni.showModal({
        title: response.data.user_agreement.title,
        content: response.data.user_agreement.content.substring(0, 500) + '...',  // 限制显示长度
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  } catch (error) {
    console.error('获取用户协议失败:', error);
    uni.showModal({
      title: '用户协议',
      content: '暂时无法加载用户协议内容，请稍后再试。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
};

// 打开隐私政策
const openPrivacyPolicy = async () => {
  console.log('打开隐私政策');
  try {
    const response = await apiService.getAgreements();
    if (response.code === 200 && response.data.privacy_policy) {
      uni.showModal({
        title: response.data.privacy_policy.title,
        content: response.data.privacy_policy.content.substring(0, 500) + '...',  // 限制显示长度
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  } catch (error) {
    console.error('获取隐私政策失败:', error);
    uni.showModal({
      title: '隐私政策',
      content: '暂时无法加载隐私政策内容，请稍后再试。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
};
</script>

<style lang="scss">
page {
  background: #ffffff;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #ffffff;
  overflow: hidden;
}

/* 背景设计 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  
  .geometric-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    
    .pattern-circle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.03), rgba(168, 85, 247, 0.01));
      animation: float 8s ease-in-out infinite;
      
      &.circle-1 {
        width: 380rpx;
        height: 380rpx;
        top: -8%;
        right: -12%;
      }
      
      &.circle-2 {
        width: 280rpx;
        height: 280rpx;
        top: 25%;
        left: -8%;
        animation-delay: 2.5s;
      }
      
      &.circle-3 {
        width: 180rpx;
        height: 180rpx;
        bottom: 15%;
        right: 25%;
        animation-delay: 5s;
      }
    }
    
    .pattern-element {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, #a855f7, #3b82f6);
      opacity: 0.02;
      animation: rotate 22s linear infinite;
      
      &.element-1 {
        width: 140rpx;
        height: 140rpx;
        top: 12%;
        left: 25%;
      }
      
      &.element-2 {
        width: 90rpx;
        height: 90rpx;
        bottom: 25%;
        left: 12%;
        animation-delay: 11s;
      }
    }
  }
}

.content-area {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 180rpx 30rpx 20rpx; /* 增加顶部间距，为小程序状态栏留出空间 */
  box-sizing: border-box;
}

/* 品牌区域 */
.brand-section {
  margin-bottom: 40rpx;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, 
    rgba(245, 243, 255, 0.95) 0%, 
    rgba(237, 233, 254, 0.9) 25%, 
    rgba(221, 214, 254, 0.85) 50%, 
    rgba(196, 181, 253, 0.8) 75%, 
    rgba(168, 85, 247, 0.75) 100%
  );
  border-radius: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(168, 85, 247, 0.2);
  box-shadow: 0 20rpx 40rpx rgba(168, 85, 247, 0.15);
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  position: relative;
  overflow: hidden;
  
  /* 添加装饰性背景元素 */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: rotate(-45deg);
    pointer-events: none;
  }
  
  .brand-header {
    text-align: center;
    position: relative;
    z-index: 2;
    
    .brand-title-section {
      margin-bottom: 16rpx;
      
      .brand-main-title {
        font-size: 48rpx;
        font-weight: 700;
        color: #581c87;
        letter-spacing: 0.5rpx;
        text-shadow: 0 2rpx 4rpx rgba(255, 255, 255, 0.5);
      }
    }
    
    .brand-subtitle-section {
      .brand-sub-title {
        font-size: 28rpx;
        color: #7c3aed;
        line-height: 1.6;
        font-weight: 500;
        text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.3);
      }
    }
  }
}

/* 主卡片 */
.main-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.08);
  padding: 40rpx;
  margin-bottom: 30rpx;
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-header {
  text-align: center;
  margin-bottom: 45rpx;
  
  .title-section {
    margin-bottom: 24rpx;
    
    .page-title {
      font-size: 48rpx;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 0.5rpx;
    }
  }
  
  .description-section {
    .page-description {
      font-size: 28rpx;
      color: #64748b;
      line-height: 1.6;
      font-weight: 400;
    }
  }
}

/* 表单样式 */
.form-container {
  .input-group {
    margin-bottom: 28rpx;
    
    .input-wrapper {
      .input-label {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        
        .label-text {
          font-size: 28rpx;
          color: #374151;
          font-weight: 600;
          position: relative;
          padding-left: 16rpx;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4rpx;
            height: 16rpx;
            background: linear-gradient(135deg, #a855f7, #3b82f6);
            border-radius: 2rpx;
          }
        }
      }
      
      .input-box {
        position: relative;
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 2rpx solid #e5e7eb;
        border-radius: 16rpx;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        
        &:focus-within {
          border-color: #a855f7;
          box-shadow: 0 0 0 4rpx rgba(168, 85, 247, 0.1);
        }
        
        /* 移除前缀样式，不再需要 */
        
        .form-input {
          width: 100%;
          height: 96rpx;
          padding: 0 20rpx;
          font-size: 30rpx;
          color: #374151;
          border: none;
          background: transparent;
          box-sizing: border-box;
          
          &:focus {
            outline: none;
          }
        }
        
        .input-placeholder {
          color: #9ca3af;
        }
      }
      
      .verification-box {
        .verification-input {
          border-right: 1rpx solid #e5e7eb;
        }
        
        .code-button {
          height: 96rpx;
          padding: 0 24rpx;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border: none;
          border-radius: 0 14rpx 14rpx 0;
          color: #ffffff;
          font-size: 24rpx;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:active {
            transform: scale(0.98);
          }
          
          &.code-button-disabled {
            background: #e5e7eb;
            color: #9ca3af;
            cursor: not-allowed;
          }
          
          .code-button-text {
            white-space: nowrap;
          }
        }
      }
    }
  }
  
  .action-section {
    margin: 45rpx 0 35rpx;
  }
  
  .primary-button {
    width: 100%;
    height: 104rpx;
    background: linear-gradient(135deg, #a855f7, #3b82f6);
    border: none;
    border-radius: 20rpx;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8rpx 24rpx rgba(168, 85, 247, 0.25);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 12rpx rgba(168, 85, 247, 0.3);
      
      &::before {
        left: 100%;
      }
    }
    
    .primary-button-text {
      position: relative;
      z-index: 1;
    }
  }
  
  /* 测试模式样式 */
  .test-panel {
    margin-top: 35rpx;
    padding: 30rpx;
    background: linear-gradient(135deg, #e0e7ff, #ddd6fe);
    border: 2rpx solid #7c3aed;
    border-radius: 20rpx;
    
    .test-header {
      .test-title {
        font-size: 28rpx;
        font-weight: 700;
        color: #5b21b6;
        text-align: center;
        margin-bottom: 16rpx;
      }
    }
    
    .test-content {
      .test-hint {
        font-size: 24rpx;
        color: #5b21b6;
        text-align: center;
        margin-bottom: 8rpx;
        line-height: 1.4;
      }
      
      .test-fill-button {
        margin-top: 20rpx;
        padding: 20rpx 24rpx;
        background: #ffffff;
        border: 2rpx solid #7c3aed;
        border-radius: 12rpx;
        color: #5b21b6;
        font-size: 26rpx;
        font-weight: 600;
        text-align: center;
        width: 100%;
        transition: all 0.2s ease;
        
        &:active {
          background: #e0e7ff;
          transform: scale(0.98);
        }
      }
    }
  }
  
  .secondary-actions {
    margin-top: 25rpx;
    text-align: center;
  }
  
  .secondary-button {
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 28rpx;
    font-weight: 500;
    padding: 20rpx;
    transition: color 0.3s ease;
    
    &:active {
      color: #a855f7;
    }
    
    .secondary-button-text {
      text-decoration: underline;
      text-underline-offset: 4rpx;
      text-decoration-thickness: 1rpx;
    }
  }
}

/* 底部区域 */
.footer-section {
  padding: 30rpx;
  text-align: center;
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
  
  .agreement-text-container {
    font-size: 24rpx;
    line-height: 1.6;
    margin-bottom: 20rpx;
    
    .agreement-text {
      color: #9ca3af;
    }
    
    .agreement-link {
      color: #a855f7;
      text-decoration: none;
      font-weight: 500;
      margin: 0 4rpx;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  .footer-brand {
    .footer-text {
      font-size: 24rpx;
      color: #9ca3af;
      font-style: italic;
      letter-spacing: 0.5rpx;
    }
  }
}

/* 动画效果 */
@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20rpx) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面进入动画 */
.brand-section {
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}
</style> 