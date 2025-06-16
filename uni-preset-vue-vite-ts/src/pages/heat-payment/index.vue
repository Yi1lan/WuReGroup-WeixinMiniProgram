<template>
  <view class="heat-payment-container">
    <!-- 现代化背景设计 -->
    <view class="background-container">
      <view class="gradient-bg"></view>
      <view class="geometric-pattern">
        <view class="pattern-waves">
          <view class="wave wave-1"></view>
          <view class="wave wave-2"></view>
          <view class="wave wave-3"></view>
        </view>
        <view class="pattern-coins">
          <view class="coin coin-1">
            <view class="coin-icon">💰</view>
          </view>
          <view class="coin coin-2">
            <view class="coin-icon">💳</view>
          </view>
          <view class="coin coin-3">
            <view class="coin-icon">💸</view>
          </view>
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
          <text class="page-title">缴纳热费</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 缴费统计卡片 -->
      <view class="payment-stats-section">
        <view class="stats-card">
          <view class="stats-row">
            <view class="stat-item">
              <text class="stat-number">{{ overdueProperties.length }}</text>
              <text class="stat-label">待缴房产</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-number">{{ selectedCount }}</text>
              <text class="stat-label">已选择</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-number highlight">¥{{ selectedTotalAmount }}</text>
              <text class="stat-label">缴费金额</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 房产列表 -->
      <view class="properties-section" v-if="overdueProperties.length > 0">
        <view class="section-header">
          <text class="section-title">选择缴费房产</text>
          <button class="select-all-btn" @click="toggleSelectAll">
            <text class="select-all-text">{{ isAllSelected ? '取消全选' : '全选' }}</text>
          </button>
        </view>
        
        <view class="property-list">
          <view 
            class="property-card"
            v-for="(property, index) in overdueProperties" 
            :key="property.id"
            :class="{ 'card-selected': selectedProperties.includes(property.id) }"
            @click="toggleSelectProperty(index)"
          >
            <!-- 选择状态指示器 -->
            <view class="selection-indicator">
              <view class="checkbox" :class="{ 'checkbox-checked': selectedProperties.includes(property.id) }">
                <text class="checkbox-icon" v-if="selectedProperties.includes(property.id)">✓</text>
              </view>
            </view>

            <view class="card-content">
              <view class="card-header">
                <view class="property-info">
                  <text class="property-name">{{ property.address }}</text>
                  <text class="property-area">{{ property.area }}㎡</text>
                </view>
                <view class="overdue-badge">
                  <text class="overdue-text">待缴费</text>
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
                <view class="payment-details">
                  <text class="amount">¥{{ property.amount }}</text>
                  <text class="deadline">截止: {{ property.deadline }}</text>
                </view>
                <view class="payment-status">
                  <text class="status-text">待缴费</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <view class="empty-card">
          <view class="empty-icon-container">
            <view class="success-icon">
              <view class="checkmark"></view>
            </view>
          </view>
          <text class="empty-title">太棒了！</text>
          <text class="empty-subtitle">您暂时没有待缴费的房产</text>
          <button class="view-property-btn" @click="goToPropertyPage">
            <text class="btn-text">查看我的房产</text>
          </button>
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="bottom-spacing" v-if="overdueProperties.length > 0"></view>
    </scroll-view>

    <!-- 固定底部操作栏 -->
    <view class="bottom-action-bar" v-if="overdueProperties.length > 0">
      <view class="action-card">
        <view class="action-info">
          <text class="selected-count">已选择 {{ selectedCount }} 个房产</text>
          <text class="total-amount">合计: ¥{{ selectedTotalAmount }}</text>
        </view>
        <button 
          class="payment-action-btn"
          :class="{ 'btn-disabled': selectedCount === 0 }"
          :disabled="selectedCount === 0"
          @click="goBatchPayment"
        >
          <text class="action-btn-text">立即缴费</text>
          <text class="action-btn-icon">→</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { apiService } from '@/api';

// 模拟房产数据 - 与"我的房产"页面保持一致的全部房产数据
const allProperties = ref([
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

// 仅显示待缴费房产
const properties = computed(() => {
  return allProperties.value.filter(property => property.isOverdue);
});

// 选中的房产ID列表
const selectedProperties = ref<string[]>([]);

// 获取待缴费房产
const overdueProperties = computed(() => {
  return properties.value.filter(property => property.isOverdue);
});

// 计算选中的房产数量
const selectedCount = computed(() => {
  return selectedProperties.value.length;
});

// 计算选中房产的总金额
const selectedTotalAmount = computed(() => {
  let total = 0;
  allProperties.value.forEach(property => {
    if (selectedProperties.value.includes(property.id)) {
      total += parseFloat(property.amount);
    }
  });
  return total.toFixed(2);
});

// 计算是否全选
const isAllSelected = computed(() => {
  return overdueProperties.value.length > 0 && selectedProperties.value.length === overdueProperties.value.length;
});

onMounted(() => {
  console.log('缴纳热费页面已加载');
  checkAuthStatus();
  
  // 默认全选
  overdueProperties.value.forEach(property => {
    selectedProperties.value.push(property.id);
  });
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

// 选择/取消选择房产
const toggleSelectProperty = (index: number) => {
  const propertyId = overdueProperties.value[index].id;
  const findIndex = selectedProperties.value.indexOf(propertyId);
  
  if (findIndex === -1) {
    // 添加选择
    selectedProperties.value.push(propertyId);
  } else {
    // 取消选择
    selectedProperties.value.splice(findIndex, 1);
  }
};

// 全选/取消全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProperties.value = [];
  } else {
    selectedProperties.value = overdueProperties.value.map(p => p.id);
  }
};

// 跳转到缴费页面
const goBatchPayment = () => {
  if (selectedProperties.value.length === 0) {
    uni.showToast({
      title: '请至少选择一个待缴费房产',
      icon: 'none'
    });
    return;
  }
  
  // 收集选中房产的信息
  const selectedIds = selectedProperties.value;
  const selectedAddresses: string[] = [];
  const selectedAmounts: string[] = [];
  
  allProperties.value.forEach(property => {
    if (selectedIds.includes(property.id)) {
      selectedAddresses.push(property.address);
      selectedAmounts.push(property.amount);
    }
  });
  
  // 跳转到缴费页面
  uni.navigateTo({
    url: `/pages/payment/index?propertyIds=${selectedIds.join(',')}&propertyAddresses=${encodeURIComponent(selectedAddresses.join(','))}&amounts=${selectedAmounts.join(',')}&clear=true`
  });
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

// 跳转到我的房产页面
const goToPropertyPage = () => {
  uni.navigateTo({
    url: '/pages/property/index'
  });
};
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
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
  overflow-x: hidden;
}

/* 备用背景保障 */
view, scroll-view {
  background: transparent;
}

/* 确保根级容器背景 */
.heat-payment-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  z-index: -10;
}

.heat-payment-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
}

/* 现代化背景设计 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  opacity: 0.95;
}

.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pattern-waves {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40%;
}

.wave {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.1);
  animation: wave 4s ease-in-out infinite;
}

.wave-1 {
  border-radius: 100% 0 0 0 / 50% 0 0 0;
  animation-delay: 0s;
}

.wave-2 {
  border-radius: 80% 0 0 0 / 40% 0 0 0;
  animation-delay: 1.3s;
  opacity: 0.7;
}

.wave-3 {
  border-radius: 60% 0 0 0 / 30% 0 0 0;
  animation-delay: 2.6s;
  opacity: 0.5;
}

.pattern-coins {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.coin {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  animation: coinFloat 6s ease-in-out infinite;
}

.coin-icon {
  width: 24rpx;
  height: 24rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: relative;
}

.coin-icon::before {
  content: "¥";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16rpx;
  font-weight: bold;
  color: var(--accent-primary);
}

.coin-1 {
  top: 20%;
  right: 15%;
  animation-delay: 0s;
}

.coin-2 {
  top: 50%;
  left: 10%;
  animation-delay: 2s;
}

.coin-3 {
  top: 70%;
  right: 25%;
  animation-delay: 4s;
}

/* 内容区域 */
.content-area {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 160rpx 0 200rpx;
}

/* 头部导航 */
.header-section {
  padding: 0 40rpx 40rpx;
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
.payment-stats-section {
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
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-item {
  min-width: 160rpx;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-card .stat-number {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
  line-height: 1;
}

.stats-card .stat-number.highlight {
  color: var(--accent-danger);
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 20rpx;
}

/* 房产列表区域 */
.properties-section {
  margin-bottom: 40rpx;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.section-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  margin-bottom: 32rpx;
}

.section-title {
  flex: 1;
  text-align: left;
}

.select-all-btn {
  margin-left: 24rpx;
  min-width: 180rpx;
}

.select-all-text {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.property-list {
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.property-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 240, 0.85) 100%);
  border-radius: 32rpx;
  border-left: 8rpx solid var(--md-primary);
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.13);
  position: relative;
  overflow: hidden;
  padding: 32rpx 32rpx 32rpx 40rpx;
  margin-bottom: 24rpx;
}

.property-card.card-selected {
  background: linear-gradient(135deg, #ffecd2 0%, #ffb88c 100%);
  border-left: 8rpx solid var(--md-primary-variant);
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.18);
}

.property-card::before {
  content: '';
  position: absolute;
  top: -40rpx;
  left: -40rpx;
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle, #ffe0b2 0%, rgba(255,255,255,0.1) 80%, transparent 100%);
  z-index: 0;
}

.property-card::after {
  content: '';
  position: absolute;
  bottom: -30rpx;
  right: -30rpx;
  width: 80rpx;
  height: 80rpx;
  background: radial-gradient(circle, #ffd180 0%, rgba(255,255,255,0.08) 80%, transparent 100%);
  z-index: 0;
}

.selection-indicator {
  flex-shrink: 0;
  margin-top: 8rpx;
}

.checkbox {
  width: 48rpx;
  height: 48rpx;
  border: 2rpx solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.3s ease;
}

.checkbox.checkbox-checked {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
}

.checkbox-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

/* 卡片内容 */
.card-content {
  flex: 1;
}

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

.overdue-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(250, 112, 154, 0.2) 100%);
  border: 1rpx solid rgba(245, 87, 108, 0.3);
}

.overdue-text {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--accent-danger);
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
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
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
  border: 2rpx solid var(--accent-danger);
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

.payment-details {
  flex: 1;
}

.amount {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: var(--accent-danger);
  margin-bottom: 6rpx;
}

.deadline {
  font-size: 22rpx;
  color: var(--text-muted);
}

.payment-status {
  padding: 8rpx 16rpx;
  border-radius: 15rpx;
  background: rgba(245, 87, 108, 0.1);
}

.status-text {
  font-size: 20rpx;
  color: var(--accent-danger);
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
  display: block;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  background: var(--accent-success);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.checkmark {
  position: relative;
  width: 60rpx;
  height: 30rpx;
  transform: rotate(-45deg);
}

.checkmark::before,
.checkmark::after {
  content: "";
  position: absolute;
  background: #fff;
  border-radius: 2rpx;
}

.checkmark::before {
  width: 6rpx;
  height: 20rpx;
  bottom: 0;
  left: 0;
  animation: checkmarkShort 0.5s ease-out 0.3s both;
}

.checkmark::after {
  width: 6rpx;
  height: 40rpx;
  bottom: 0;
  right: 0;
  animation: checkmarkLong 0.5s ease-out 0.6s both;
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

.view-property-btn {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 48rpx;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.btn-text {
  font-size: 28rpx;
}

/* 底部间距 */
.bottom-spacing {
  height: 40rpx;
}

/* 固定底部操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20rpx 40rpx 40rpx;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid var(--glass-border);
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-card {
  width: 92vw;
  max-width: 700rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  box-shadow: none;
}

.action-info {
  flex: 1;
}

.selected-count {
  display: block;
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 6rpx;
}

.total-amount {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--accent-danger);
}

.payment-action-btn {
  width: 320rpx;
  min-width: 200rpx;
  max-width: 360rpx;
  margin-left: 24rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%) !important;
  color: #fff !important;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.18);
  border: none;
  padding: 24rpx 0;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.payment-action-btn.btn-disabled {
  background: #eee !important;
  color: #aaa !important;
  box-shadow: none;
}

.action-btn-text {
  font-size: 28rpx;
}

.action-btn-icon {
  font-size: 20rpx;
  font-weight: 600;
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

@keyframes wave {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50rpx);
  }
}

@keyframes coinFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30rpx) rotate(180deg);
  }
}

@keyframes checkmarkShort {
  0% {
    height: 0;
  }
  100% {
    height: 20rpx;
  }
}

@keyframes checkmarkLong {
  0% {
    height: 0;
  }
  100% {
    height: 40rpx;
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