<template>
  <view class="property-container">
    <!-- 现代化背景设计 -->
    <view class="material-background">
      <view class="primary-surface"></view>
      <view class="elevation-overlay"></view>
      <view class="geometric-pattern">
        <view class="pattern-shape shape-1"></view>
        <view class="pattern-shape shape-2"></view>
        <view class="pattern-dots">
          <view class="dot" v-for="n in 12" :key="n"></view>
        </view>
      </view>
    </view>

    <scroll-view class="content-area" scroll-y="true">
      <!-- 顶部导航区域 -->
      <view class="header-section">
        <view class="nav-container">
          <button class="nav-back-btn" @click="backToHome">
            <text class="back-icon">←</text>
            <text class="back-text">返回</text>
          </button>
          <text class="page-title">我的房产</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 房产统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ properties.length }}</text>
            <text class="stats-label">房产数量</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ overdueCount }}</text>
            <text class="stats-label">待缴费</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">¥{{ totalAmount }}</text>
            <text class="stats-label">总费用</text>
          </view>
        </view>
      </view>

      <!-- 房产列表 -->
      <view class="properties-section" v-if="properties.length > 0">
        <text class="section-title">房产信息</text>
        <view class="property-list">
          <view 
            class="property-card"
            v-for="(property, index) in properties" 
            :key="property.id"
            @click="showPropertyDetail(property)"
          >
            <view class="card-header">
              <view class="property-info">
                <text class="property-name">{{ property.address }}</text>
                <text class="property-area">{{ property.area }}㎡</text>
              </view>
              <view class="property-status" :class="property.isOverdue ? 'status-overdue' : 'status-paid'">
                <text class="status-text">{{ property.isOverdue ? '待缴费' : '已缴费' }}</text>
              </view>
            </view>

            <view class="card-details">
              <view class="detail-row">
                <view class="detail-item">
                  <view class="detail-icon-circle">
                    <view class="calendar-icon">
                      <view class="calendar-body"></view>
                      <view class="calendar-lines"></view>
                    </view>
                  </view>
                  <view class="detail-content">
                    <text class="detail-label">用暖期间</text>
                    <text class="detail-value">{{ property.heatingPeriod }}</text>
                  </view>
                </view>
              </view>
              
              <view class="detail-row">
                <view class="detail-item">
                  <view class="detail-icon-circle">
                    <view class="heat-icon">
                      <view class="heat-waves"></view>
                    </view>
                  </view>
                  <view class="detail-content">
                    <text class="detail-label">热力状态</text>
                    <text class="detail-value">{{ property.heatingStatus }}</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="card-footer">
              <view class="payment-info">
                <text class="amount">¥{{ property.amount }}</text>
                <text class="deadline">截止: {{ property.deadline }}</text>
              </view>
              <button 
                class="action-btn"
                :class="property.isOverdue ? 'btn-pay' : 'btn-paid'"
                @click.stop="goToPayment(property)"
              >
                <text class="btn-text">{{ property.isOverdue ? '立即缴费' : '已缴费' }}</text>
                <text class="btn-icon" v-if="property.isOverdue">→</text>
                <text class="btn-icon" v-if="!property.isOverdue">✓</text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <view class="empty-card">
          <view class="empty-icon-container">
            <view class="home-icon">
              <view class="house-base"></view>
              <view class="house-roof"></view>
              <view class="house-door"></view>
              <view class="house-window"></view>
            </view>
          </view>
          <text class="empty-title">暂无绑定房产</text>
          <text class="empty-subtitle">请联系客服绑定您的房产信息</text>
          <button class="add-property-btn" @click="addProperty">
            <text class="add-btn-text">联系客服</text>
          </button>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="footer-section">
        <view class="footer-card">
          <view class="footer-icon-container">
            <view class="phone-icon">
              <view class="phone-body"></view>
              <view class="phone-screen"></view>
            </view>
          </view>
          <view class="footer-content">
            <text class="footer-title">需要帮助？</text>
            <text class="footer-subtitle">客服热线：960577</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { apiService } from '@/api';

// 模拟房产数据 - 与"暖费速缴"页面保持一致
const properties = ref([
  {
    id: '001',
    address: '龙域西城小区 3号楼2单元201',
    area: 120,
    heatingPeriod: '2025年1月1日-2025年3月31日',
    heatingStatus: '正常供暖',
    amount: '1200.00',
    deadline: '2025年1月15日',
    isOverdue: true
  },
  {
    id: '002',
    address: '阳光花园小区 5号楼1单元102',
    area: 89,
    heatingPeriod: '2025年1月1日-2025年3月31日',
    heatingStatus: '正常供暖',
    amount: '890.00',
    deadline: '2025年1月10日',
    isOverdue: false
  },
  {
    id: '003',
    address: '明珠华府 8号楼3单元501',
    area: 105,
    heatingPeriod: '2025年1月1日-2025年3月31日',
    heatingStatus: '正常供暖',
    amount: '1050.00',
    deadline: '2025年1月20日',
    isOverdue: true
  }
]);

onMounted(() => {
  console.log('房产页面已加载');
  checkAuthStatus();
});

// 检查登录状态
onShow(() => {
  checkAuthStatus();
});

const checkAuthStatus = () => {
  if (!apiService.isLoggedIn()) {
    console.log('用户未登录，跳转到登录页面');
    uni.reLaunch({
      url: '/pages/login/index'
    });
    return;
  }
};

// 返回首页
const backToHome = () => {
  uni.navigateBack({
    success: () => {
      console.log('返回首页成功');
    },
    fail: () => {
      console.error('返回首页失败，尝试重定向');
      uni.redirectTo({
        url: '/pages/index/index'
      });
    }
  });
};

// 显示房产详情
const showPropertyDetail = (property: any) => {
  console.log('查看房产详情', property);
  uni.showToast({
    title: '房产详情功能开发中',
    icon: 'none'
  });
};

// 添加房产
const addProperty = () => {
  uni.showToast({
    title: '添加房产功能开发中',
    icon: 'none'
  });
};

// 跳转到缴费页面
const goToPayment = (property: any) => {
  if (!property.isOverdue) {
    uni.showToast({
      title: '当前房产已完成缴费',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: `/pages/payment/index?propertyIds=${property.id}&propertyAddresses=${encodeURIComponent(property.address)}&amounts=${property.amount}`
  });
};

// 计算属性
const overdueCount = computed(() => {
  return properties.value.filter(p => p.isOverdue).length;
});

const totalAmount = computed(() => {
  return properties.value.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2);
});
</script>

<style lang="scss">
:root {
  /* Material Design 主色板 */
  --md-primary: #ff6b35;
  --md-primary-variant: #ff8a50;
  --md-secondary: #ffa726;
  --md-secondary-variant: #ffb74d;
  --md-background: #fff8f0;
  --md-surface: #ffffff;
  --md-error: #f44336;
  --md-on-primary: #ffffff;
  --md-on-secondary: #000000;
  --md-on-background: #2d1810;
  --md-on-surface: #2d1810;
  --md-on-error: #ffffff;
  
  /* 温暖供热主题色彩 */
  --primary-gradient: linear-gradient(135deg, var(--md-primary) 0%, #f7931e 100%);
  --secondary-gradient: linear-gradient(135deg, var(--md-primary-variant) 0%, var(--md-primary) 100%);
  --warm-gradient: linear-gradient(135deg, #ff9a56 0%, #ffad56 50%, #ffc947 100%);
  --heating-gradient: linear-gradient(135deg, var(--md-primary) 0%, var(--md-primary-variant) 50%, var(--md-secondary) 100%);
  --surface-color: var(--md-surface);
  --glass-bg: rgba(255, 255, 255, 0.85);
  --warm-glass-bg: rgba(255, 248, 240, 0.95);
  --text-primary: var(--md-on-surface);
  --text-secondary: #8b4513;
  --text-muted: #cd853f;
  --accent-primary: var(--md-primary);
  --accent-secondary: var(--md-primary-variant);
  --accent-warm: var(--md-secondary);
  --accent-danger: #f44336;
  --accent-success: #4caf50;
  --success-green: #4caf50;
  --success-green-dark: #45a049;
  
  /* Material Design 阴影 */
  --md-elevation-0: none;
  --md-elevation-1: 0 1rpx 3rpx rgba(0, 0, 0, 0.12), 0 1rpx 2rpx rgba(0, 0, 0, 0.24);
  --md-elevation-2: 0 3rpx 6rpx rgba(0, 0, 0, 0.16), 0 3rpx 6rpx rgba(0, 0, 0, 0.23);
  --md-elevation-3: 0 10rpx 20rpx rgba(0, 0, 0, 0.19), 0 6rpx 6rpx rgba(0, 0, 0, 0.23);
  --md-elevation-4: 0 14rpx 28rpx rgba(0, 0, 0, 0.25), 0 10rpx 10rpx rgba(0, 0, 0, 0.22);
  --md-elevation-5: 0 19rpx 38rpx rgba(0, 0, 0, 0.30), 0 15rpx 12rpx rgba(0, 0, 0, 0.22);
  
  /* Material Design 圆角 */
  --md-corner-radius: 4rpx;
  --md-corner-radius-medium: 8rpx;
  --md-corner-radius-large: 16rpx;
  --md-corner-radius-extra-large: 24rpx;
  
  --border-radius: var(--md-corner-radius-large);
  --shadow-sm: var(--md-elevation-1);
  --shadow-md: var(--md-elevation-2);
  --shadow-lg: var(--md-elevation-3);
  --warm-shadow: 0 4rpx 20rpx rgba(255, 138, 80, 0.3);
}

page {
  background: #ffffff !important;
  overflow-x: hidden;
}

/* 备用背景保障 */
view, scroll-view {
  background: transparent;
}

/* 确保根级容器背景 */
.property-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  z-index: -10;
}

.property-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
}

/* 简洁白色背景设计 */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  opacity: 1;
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  opacity: 1;
}

.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pattern-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 200rpx;
  height: 200rpx;
  top: 15%;
  right: -50rpx;
  border-radius: 50rpx;
  animation-delay: 0s;
}

.shape-2 {
  width: 150rpx;
  height: 150rpx;
  top: 70%;
  left: -30rpx;
  transform: rotate(45deg);
  animation-delay: 3s;
}

.pattern-dots {
  position: absolute;
  top: 40%;
  right: 10%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.dot:nth-child(odd) {
  animation-delay: 0.5s;
}

/* 内容区域 */
.content-area {
  position: relative;
  z-index: 1;
  height: 100vh;
  padding: 160rpx 0 40rpx;
}

/* 头部导航 */
.header-section {
  padding: 0 40rpx 60rpx;
  animation: slideInDown 0.8s ease-out;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-back-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1rpx solid rgba(0, 0, 0, 0.1);
  border-radius: 50rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10rpx);
  box-shadow: var(--shadow-sm);
}

.back-icon {
  font-size: 32rpx;
  color: var(--text-primary);
  margin-right: 8rpx;
  font-weight: 600;
}

.back-text {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.page-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-placeholder {
  width: 120rpx;
}

/* 统计卡片 */
.statistics-section {
  padding: 0 40rpx;
  margin-bottom: 40rpx;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.stats-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: var(--border-radius);
  padding: 40rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-number {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
  line-height: 1;
}

.stats-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.stats-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 20rpx;
}

/* 区块标题 */
.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 32rpx;
  padding: 0 40rpx;
}

/* 房产列表 */
.properties-section {
  margin-bottom: 50rpx;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.property-list {
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.property-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: var(--border-radius);
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.property-card:active {
  transform: translateY(-4rpx);
  box-shadow: var(--md-elevation-3);
}

.property-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.property-card:active::before {
  transform: translateX(100%);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.property-info {
  flex: 1;
}

.property-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.property-area {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.property-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
}

.status-overdue {
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(250, 112, 154, 0.2) 100%);
  border: 1rpx solid rgba(245, 87, 108, 0.3);
}

.status-paid {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%);
  border: 1rpx solid rgba(79, 172, 254, 0.3);
}

.status-text {
  font-size: 22rpx;
  font-weight: 600;
}

.status-overdue .status-text {
  color: var(--accent-danger);
}

.status-paid .status-text {
  color: var(--accent-success);
}

/* 卡片详情 */
.card-details {
  margin-bottom: 24rpx;
}

.detail-row {
  margin-bottom: 16rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.detail-icon-circle {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  margin-right: 16rpx;
}

.calendar-icon {
  position: relative;
  width: 24rpx;
  height: 20rpx;
  background: var(--accent-primary);
  border-radius: 2rpx;
  display: flex;
  flex-direction: column;
}

.calendar-body {
  width: 100%;
  height: 14rpx;
  background: var(--accent-primary);
  border-radius: 2rpx 2rpx 0 0;
  position: relative;
}

.calendar-body::before,
.calendar-body::after {
  content: "";
  position: absolute;
  top: -4rpx;
  width: 2rpx;
  height: 8rpx;
  background: var(--text-muted);
  border-radius: 1rpx;
}

.calendar-body::before {
  left: 4rpx;
}

.calendar-body::after {
  right: 4rpx;
}

.calendar-lines {
  width: 100%;
  height: 6rpx;
  background: #fff;
  position: relative;
  border-radius: 0 0 2rpx 2rpx;
}

.calendar-lines::before,
.calendar-lines::after {
  content: "";
  position: absolute;
  top: 1rpx;
  left: 2rpx;
  width: 20rpx;
  height: 1rpx;
  background: var(--accent-primary);
}

.calendar-lines::after {
  top: 3rpx;
  width: 16rpx;
}

.heat-icon {
  position: relative;
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heat-waves {
  position: relative;
  width: 18rpx;
  height: 18rpx;
}

.heat-waves::before,
.heat-waves::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2rpx solid var(--accent-primary);
  border-radius: 50%;
  animation: heatPulse 2s ease-in-out infinite;
}

.heat-waves::after {
  animation-delay: 1s;
  opacity: 0.6;
}

.detail-content {
  flex: 1;
}

.detail-label {
  display: block;
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 4rpx;
}

.detail-value {
  font-size: 26rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-info {
  flex: 1;
}

.amount {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: var(--md-primary);
  margin-bottom: 6rpx;
  text-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.15);
}

.deadline {
  font-size: 22rpx;
  color: var(--text-muted);
}

.action-btn {
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn.btn-pay {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%) !important;
  color: #fff !important;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.3);
  border: 2rpx solid #ff6b35;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.action-btn.btn-pay:active {
  background: linear-gradient(135deg, #ff8a50 0%, #ff6b35 100%) !important;
  box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.25);
}

.action-btn.btn-paid {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  color: #fff !important;
  box-shadow: 0 12rpx 32rpx rgba(76, 175, 80, 0.18);
  border: 2rpx solid #4caf50;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.action-btn.btn-paid:active {
  background: linear-gradient(135deg, #45a049 0%, #5fb85f 100%) !important;
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.15);
}

.btn-text {
  font-size: 26rpx;
}

.btn-icon {
  font-size: 20rpx;
  font-weight: 600;
}

/* 空状态 */
.empty-section {
  padding: 0 40rpx;
  animation: fadeIn 0.8s ease-out 0.4s both;
}

.empty-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: var(--border-radius);
  padding: 80rpx 40rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
  text-align: center;
}

.empty-icon-container {
  margin-bottom: 32rpx;
}

.home-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--warm-shadow);
}

.house-base {
  position: relative;
  width: 60rpx;
  height: 50rpx;
  background: #fff;
  border-radius: 4rpx;
}

.house-roof {
  position: absolute;
  top: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 40rpx solid transparent;
  border-right: 40rpx solid transparent;
  border-bottom: 30rpx solid #fff;
}

.house-door {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 24rpx;
  background: var(--accent-primary);
  border-radius: 2rpx 2rpx 0 0;
}

.house-window {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: 12rpx;
  height: 12rpx;
  background: var(--accent-primary);
  border-radius: 2rpx;
}

.house-window::after {
  content: "";
  position: absolute;
  top: 8rpx;
  right: -24rpx;
  width: 12rpx;
  height: 12rpx;
  background: var(--accent-primary);
  border-radius: 2rpx;
}

.empty-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16rpx;
}

.empty-subtitle {
  display: block;
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 48rpx;
  line-height: 1.6;
}

.add-property-btn {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 48rpx;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.add-btn-text {
  font-size: 28rpx;
}

/* 底部区域 */
.footer-section {
  padding: 0 40rpx 60rpx;
  animation: slideInUp 0.8s ease-out 0.6s both;
}

.footer-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: var(--border-radius);
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.footer-icon-container {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.phone-icon {
  position: relative;
  width: 28rpx;
  height: 32rpx;
}

.phone-body {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 6rpx;
  position: relative;
}

.phone-body::before {
  content: "";
  position: absolute;
  top: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 2rpx;
  background: var(--accent-primary);
  border-radius: 1rpx;
}

.phone-body::after {
  content: "";
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 8rpx;
  background: var(--accent-primary);
  border-radius: 50%;
}

.phone-screen {
  position: absolute;
  top: 8rpx;
  left: 2rpx;
  right: 2rpx;
  bottom: 16rpx;
  background: var(--accent-primary);
  border-radius: 2rpx;
}

.footer-content {
  flex: 1;
}

.footer-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6rpx;
}

.footer-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 动画定义 */
@keyframes slideInDown {
  from {
    transform: translateY(-100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes heatPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
</style> 