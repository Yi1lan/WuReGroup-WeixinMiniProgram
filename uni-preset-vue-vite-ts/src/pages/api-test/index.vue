<template>
  <view class="api-test-container">
    <view class="header">
      <text class="title">API接口测试</text>
    </view>
    
    <view class="test-section">
      <text class="section-title">健康检查</text>
      <button class="test-btn" @click="testHealthCheck">测试健康检查接口</button>
      <view class="result-box" v-if="healthCheckResult">
        <text class="result-text">{{ healthCheckResult }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <text class="section-title">系统配置</text>
      <button class="test-btn" @click="testSystemConfig">获取系统配置</button>
      <view class="result-box" v-if="systemConfigResult">
        <text class="result-text">{{ systemConfigResult }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <text class="section-title">用户协议</text>
      <button class="test-btn" @click="testAgreements">获取用户协议</button>
      <view class="result-box" v-if="agreementsResult">
        <text class="result-text">{{ agreementsResult }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <text class="section-title">短信验证码</text>
      <input 
        class="input" 
        v-model="testPhone" 
        placeholder="请输入测试手机号"
        type="number"
        maxlength="11"
      />
      <button class="test-btn" @click="testSendSms">发送验证码</button>
      <view class="result-box" v-if="smsResult">
        <text class="result-text">{{ smsResult }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <text class="section-title">用户注册测试</text>
      <input 
        class="input" 
        v-model="testRegisterPhone" 
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
      />
      <input 
        class="input" 
        v-model="testRegisterCode" 
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      />
      <input 
        class="input" 
        v-model="testRegisterPassword" 
        placeholder="请输入密码"
        type="password"
      />
      <button class="test-btn" @click="testRegister">测试注册</button>
      <button class="test-btn secondary" @click="fillTestRegisterData">使用测试数据</button>
      <view class="result-box" v-if="registerResult">
        <text class="result-text">{{ registerResult }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <text class="section-title">测试登录</text>
      <input 
        class="input" 
        v-model="testLoginPhone" 
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
      />
      <input 
        class="input" 
        v-model="testLoginCode" 
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      />
      <button class="test-btn" @click="testLogin">测试登录</button>
      <button class="test-btn secondary" @click="fillTestLoginData">使用测试数据</button>
      <button class="test-btn secondary" @click="testPasswordValidationError">测试密码验证错误</button>
      <view class="result-box" v-if="loginResult">
        <text class="result-text">{{ loginResult }}</text>
      </view>
    </view>
    
    <view class="back-section">
      <button class="back-btn" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { apiService } from '@/api';
import { TEST_CONFIG } from '@/config/test';

// 测试结果
const healthCheckResult = ref('');
const systemConfigResult = ref('');
const agreementsResult = ref('');
const smsResult = ref('');
const registerResult = ref('');
const testPhone = ref('13888888888');
const testRegisterPhone = ref('13899999999');
const testRegisterCode = ref('123456');
const testRegisterPassword = ref('123456');
const loginResult = ref('');
const testLoginPhone = ref('13800000001');
const testLoginCode = ref('888888');

// 测试健康检查接口
const testHealthCheck = async () => {
  try {
    healthCheckResult.value = '请求中...';
    const response = await apiService.healthCheck();
    healthCheckResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    healthCheckResult.value = `错误: ${error.message}`;
  }
};

// 测试系统配置接口
const testSystemConfig = async () => {
  try {
    systemConfigResult.value = '请求中...';
    const response = await apiService.getSystemConfig();
    systemConfigResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    systemConfigResult.value = `错误: ${error.message}`;
  }
};

// 测试用户协议接口
const testAgreements = async () => {
  try {
    agreementsResult.value = '请求中...';
    const response = await apiService.getAgreements();
    agreementsResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    agreementsResult.value = `错误: ${error.message}`;
  }
};

// 测试短信验证码接口
const testSendSms = async () => {
  if (!/^1[3-9]\d{9}$/.test(testPhone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    });
    return;
  }
  
  try {
    smsResult.value = '请求中...';
    const response = await apiService.sendSms({
      phone: testPhone.value,
      type: 'login'
    });
    smsResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    smsResult.value = `错误: ${error.message}`;
  }
};

// 测试注册接口
const testRegister = async () => {
  if (!/^1[3-9]\d{9}$/.test(testRegisterPhone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    });
    return;
  }
  
  if (!/^\d{6}$/.test(testRegisterCode.value)) {
    uni.showToast({
      title: '请输入6位验证码',
      icon: 'none'
    });
    return;
  }
  
  if (testRegisterPassword.value.length < 6) {
    uni.showToast({
      title: '密码至少6位',
      icon: 'none'
    });
    return;
  }
  
  try {
    registerResult.value = '请求中...';
    const response = await apiService.register({
      phone: testRegisterPhone.value,
      code: testRegisterCode.value,
      password: testRegisterPassword.value,
      nickname: `测试用户${testRegisterPhone.value.substring(7)}`
    });
    registerResult.value = JSON.stringify(response, null, 2);
    
    // 如果注册成功，提示跳转（但在测试页面不实际跳转）
    if (response.code === 200) {
      uni.showModal({
        title: '注册成功',
        content: '注册成功！在正常使用中，此时会自动跳转到登录页面。',
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  } catch (error: any) {
    registerResult.value = `错误: ${error.message}\n\n完整错误信息: ${JSON.stringify(error, null, 2)}`;
  }
};

// 测试登录接口
const testLogin = async () => {
  if (!/^1[3-9]\d{9}$/.test(testLoginPhone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    });
    return;
  }
  
  if (!/^\d{6}$/.test(testLoginCode.value)) {
    uni.showToast({
      title: '请输入6位验证码',
      icon: 'none'
    });
    return;
  }
  
  try {
    loginResult.value = '请求中...';
    const response = await apiService.login({
      phone: testLoginPhone.value,
      code: testLoginCode.value
    });
    loginResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    loginResult.value = `错误: ${error.message}\n\n完整错误信息: ${JSON.stringify(error, null, 2)}`;
  }
};

// 填入测试注册数据
const fillTestRegisterData = () => {
  testRegisterPhone.value = '13800000004';
  testRegisterCode.value = TEST_CONFIG.TEST_VERIFICATION_CODE;
  testRegisterPassword.value = '123456';
  
  uni.showToast({
    title: '已填入测试数据',
    icon: 'success'
  });
};

// 填入测试登录数据
const fillTestLoginData = () => {
  testLoginPhone.value = '13800000001';
  testLoginCode.value = TEST_CONFIG.TEST_VERIFICATION_CODE;
  
  uni.showToast({
    title: '已填入测试数据',
    icon: 'success'
  });
};

// 测试密码验证错误（使用真实已注册手机号）
const testPasswordValidationError = () => {
  testLoginPhone.value = '18923441108'; // 这是一个已知会触发密码验证错误的手机号
  testLoginCode.value = '123456'; // 任意验证码都会触发该错误
  
  uni.showModal({
    title: '测试密码验证错误',
    content: '即将使用已注册的真实手机号测试密码验证错误。这个错误是后端已知问题，前端已做相应处理。',
    showCancel: true,
    confirmText: '开始测试',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        testLogin();
      }
    }
  });
};

// 返回
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
page {
  background-color: #f8f8f8;
}

.api-test-container {
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
  }
}

.test-section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .test-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #e73323;
    color: #fff;
    font-size: 28rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    
    &.secondary {
      background-color: #fff;
      border: 2rpx solid #e73323;
      color: #e73323;
    }
  }
  
  .input {
    width: 100%;
    height: 80rpx;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 12rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  
  .result-box {
    background-color: #f9f9f9;
    border-radius: 12rpx;
    padding: 20rpx;
    max-height: 400rpx;
    overflow-y: auto;
    
    .result-text {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}

.back-section {
  text-align: center;
  margin-top: 40rpx;
  
  .back-btn {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #999;
    color: #fff;
    font-size: 28rpx;
    border-radius: 12rpx;
  }
}
</style> 