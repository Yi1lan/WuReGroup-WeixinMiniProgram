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
            <text class="page-title">欢迎登录</text>
          </view>
          <view class="description-section">
            <text class="page-description">输入手机号码，便捷登录您的账户</text>
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
          
          <!-- 主要操作按钮 -->
          <view class="action-section">
            <button class="primary-button" @click="login">
              <text class="primary-button-text">登录</text>
            </button>
          </view>
          
          <!-- 测试模式 -->
          <view v-if="isTestMode" class="test-panel">
            <view class="test-header">
              <text class="test-title">开发测试模式</text>
            </view>
            <view class="test-content">
              <text class="test-hint">{{ TEST_CONFIG.TEST_MESSAGES.TEST_CODE_HINT }}</text>
              <text class="test-hint">{{ TEST_CONFIG.TEST_MESSAGES.TEST_ACCOUNT_HINT }}</text>
              <view class="test-accounts-grid">
                <button 
                  v-for="account in TEST_CONFIG.TEST_ACCOUNTS" 
                  :key="account.phone"
                  class="test-account-item"
                  @click="quickLogin(account)"
                >
                  <text class="test-account-name">{{ account.nickname }}</text>
                  <text class="test-account-phone">{{ account.phone }}</text>
                </button>
              </view>
            </view>
          </view>
          
          <!-- 次要操作 -->
          <view class="secondary-actions">
            <button class="secondary-button" @click="goToRegister">
              <text class="secondary-button-text">没有账号？立即注册</text>
            </button>
          </view>
        </view>
      </view>
      
      <!-- 底部协议区域 -->
      <view class="footer-section">
        <view class="agreement-text-container">
          <text class="agreement-text">登录即表示您同意</text>
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
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api';
import { validatePhone, validateCode } from '@/utils/auth';
import { TEST_CONFIG, isTestPhone } from '@/config/test';

// 手机号和验证码
const phone = ref('');
const verificationCode = ref('');
const isTestMode = ref(TEST_CONFIG.ENABLE_TEST_MODE);

onMounted(() => {
  console.log('登录页面已加载');
  // 检查是否已经登录
  if (apiService.isLoggedIn()) {
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }
});

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

    console.log('发送验证码请求:', { phone: phone.value, type: 'login' });

    // 调用发送验证码API
    const response = await apiService.sendSms({
      phone: phone.value,
      type: 'login'
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

// 登录
const login = async () => {
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
  
  try {
    uni.showLoading({
      title: '登录中...'
    });

    console.log('准备登录，数据:', { phone: phone.value, code: verificationCode.value });

    // 调用登录API
    const response = await apiService.login({
      phone: phone.value,
      code: verificationCode.value
    });

    uni.hideLoading();
    console.log('登录响应结果:', response);

    if (response.code === 200) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 延迟跳转到首页
      setTimeout(() => {
        console.log('跳转到首页');
        try {
          uni.reLaunch({
            url: '/pages/index/index',
            success: () => {
              console.log('跳转到首页成功');
            },
            fail: (err) => {
              console.error('跳转到首页失败:', err);
              uni.showToast({
                title: '跳转失败，请重试',
                icon: 'none'
              });
            }
          });
        } catch (error) {
          console.error('跳转到首页出现异常:', error);
          uni.showToast({
            title: '跳转失败，请重试',
            icon: 'none'
          });
        }
      }, 1500);
    }
  } catch (error: any) {
    uni.hideLoading();
    console.error('登录失败:', error);
    
    // 根据错误类型提供具体的提示
    let errorMessage = '登录失败，请重试';
    
    if (error.message) {
      if (error.message.includes('验证码错误')) {
        errorMessage = '验证码错误，请重新获取验证码';
      } else if (error.message.includes('用户不存在')) {
        errorMessage = '该手机号未注册，请先注册';
      } else if (error.message.includes('密码长度不能超过20位')) {
        // 这是一个已知的后端问题，提供友好的错误提示
        errorMessage = '登录服务暂时异常，建议使用测试账号或稍后重试';
        console.error('⚠️ 后端密码验证错误（已知问题）:', {
          phone: phone.value,
          timestamp: new Date().toISOString(),
          error: error.message,
          suggestion: '建议后端检查Mongoose用户模型的密码字段验证配置'
        });
      } else if (error.message.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络';
      } else {
        errorMessage = error.message;
      }
    }
    
    uni.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 3000
    });
  }
};

// 快捷登录（测试账号）
const quickLogin = async (account: any) => {
  phone.value = account.phone;
  verificationCode.value = TEST_CONFIG.TEST_VERIFICATION_CODE;
  
  uni.showToast({
    title: `已选择${account.nickname}`,
    icon: 'success'
  });
  
  // 自动登录
  setTimeout(() => {
    login();
  }, 1000);
};

// 防抖状态
const isNavigating = ref(false);

// 跳转到注册页面
const goToRegister = () => {
  // 防止重复点击
  if (isNavigating.value) return;
  
  isNavigating.value = true;
  
  uni.navigateTo({
    url: '/pages/register/index',
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
      background: radial-gradient(circle, rgba(236, 72, 153, 0.03), rgba(236, 72, 153, 0.01));
      animation: float 8s ease-in-out infinite;
      
      &.circle-1 {
        width: 400rpx;
        height: 400rpx;
        top: -10%;
        left: -15%;
      }
      
      &.circle-2 {
        width: 300rpx;
        height: 300rpx;
        top: 20%;
        right: -10%;
        animation-delay: 2s;
      }
      
      &.circle-3 {
        width: 200rpx;
        height: 200rpx;
        bottom: 10%;
        left: 20%;
        animation-delay: 4s;
      }
    }
    
    .pattern-element {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, #ec4899, #f97316);
      opacity: 0.02;
      animation: rotate 20s linear infinite;
      
      &.element-1 {
        width: 150rpx;
        height: 150rpx;
        top: 15%;
        right: 25%;
      }
      
      &.element-2 {
        width: 100rpx;
        height: 100rpx;
        bottom: 30%;
        right: 15%;
        animation-delay: 10s;
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
  margin-bottom: 50rpx;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, 
    rgba(255, 248, 240, 0.95) 0%, 
    rgba(255, 237, 213, 0.9) 25%, 
    rgba(254, 215, 170, 0.85) 50%, 
    rgba(253, 186, 116, 0.8) 75%, 
    rgba(251, 146, 60, 0.75) 100%
  );
  border-radius: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(251, 146, 60, 0.2);
  box-shadow: 0 20rpx 40rpx rgba(251, 146, 60, 0.15);
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  position: relative;
  overflow: hidden;
  
  /* 添加装饰性背景元素 */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: rotate(45deg);
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
        color: #78350f;
        letter-spacing: 0.5rpx;
        text-shadow: 0 2rpx 4rpx rgba(255, 255, 255, 0.5);
      }
    }
    
    .brand-subtitle-section {
      .brand-sub-title {
        font-size: 28rpx;
        color: #92400e;
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
  margin-bottom: 50rpx;
  
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
    margin-bottom: 32rpx;
    
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
            background: linear-gradient(135deg, #ec4899, #f97316);
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
          border-color: #ec4899;
          box-shadow: 0 0 0 4rpx rgba(236, 72, 153, 0.1);
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
          background: linear-gradient(135deg, #ec4899, #f97316);
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
    margin: 50rpx 0 40rpx;
  }
  
  .primary-button {
    width: 100%;
    height: 104rpx;
    background: linear-gradient(135deg, #ec4899, #f97316);
    border: none;
    border-radius: 20rpx;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8rpx 24rpx rgba(236, 72, 153, 0.25);
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
      box-shadow: 0 4rpx 12rpx rgba(236, 72, 153, 0.3);
      
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
    margin-top: 40rpx;
    padding: 30rpx;
    background: linear-gradient(135deg, #fef3c7, #fed7aa);
    border: 2rpx solid #f59e0b;
    border-radius: 20rpx;
    
    .test-header {
      .test-title {
        font-size: 28rpx;
        font-weight: 700;
        color: #92400e;
        text-align: center;
        margin-bottom: 16rpx;
      }
    }
    
    .test-content {
      .test-hint {
        font-size: 24rpx;
        color: #92400e;
        text-align: center;
        margin-bottom: 8rpx;
        line-height: 1.4;
      }
      
      .test-accounts-grid {
        margin-top: 24rpx;
        display: flex;
        flex-direction: column;
        gap: 12rpx;
      }
      
      .test-account-item {
        padding: 20rpx 24rpx;
        background: #ffffff;
        border: 2rpx solid #f59e0b;
        border-radius: 12rpx;
        transition: all 0.2s ease;
        
        .test-account-name {
          display: block;
          font-size: 26rpx;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 4rpx;
        }
        
        .test-account-phone {
          display: block;
          font-size: 22rpx;
          color: #a16207;
        }
        
        &:active {
          background: #fef3c7;
          transform: scale(0.98);
        }
      }
    }
  }
  
  .secondary-actions {
    margin-top: 30rpx;
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
      color: #ec4899;
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
      color: #ec4899;
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