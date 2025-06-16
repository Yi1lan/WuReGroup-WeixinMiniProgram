<template>
  <view class="material-home-container">
    <!-- Material Design 背景层 -->
    <view class="material-background">
      <view class="primary-surface"></view>
      <view class="elevation-overlay"></view>
    </view>

    <!-- 顶部 App Bar -->
    <view class="material-app-bar" :class="{ 'scrolled': isScrolled }">
      <view class="app-bar-content">
        <view class="app-bar-leading">
          <view class="brand-container">
            <view class="brand-avatar">
              <image class="brand-logo" src="../../static/WuReGroup.png" mode="aspectFit"></image>
            </view>
            <view class="brand-text">
              <text class="brand-title">精准暖费速办</text>
              <text class="brand-subtitle">乌鲁木齐热力集团</text>
            </view>
          </view>
        </view>
        <view class="app-bar-actions">
          <view class="logout-button" @click="logout">
            <text class="logout-text">退出登录</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view 
      class="material-content" 
      scroll-y="true" 
      @scroll="handleScroll"
      enhanced="true"
      show-scrollbar="false"
    >
      <!-- Hero Card -->
      <view class="hero-section">
        <view class="hero-card material-elevation-4">
          <view class="hero-content">
            <view class="hero-headline">
              <text class="hero-title">暖心供热 · 智慧缴费</text>
              <text class="hero-subtitle">让每一度温暖都触手可及</text>
            </view>
            <view class="hero-features">
              <view class="feature-item">
                <view class="feature-icon-modern">
                  <image src="../../static/icons/home.png" mode="aspectFit" style="width:28rpx;height:28rpx;" />
                </view>
                <text class="feature-text">房产管理</text>
              </view>
              <view class="feature-item">
                <view class="feature-icon-modern">
                  <image src="../../static/icons/lightning.png" mode="aspectFit" style="width:28rpx;height:28rpx;" />
                </view>
                <text class="feature-text">闪电支付</text>
              </view>
              <view class="feature-item">
                <view class="feature-icon-modern">
                  <image src="../../static/icons/thermometer.png" mode="aspectFit" style="width:28rpx;height:28rpx;" />
                </view>
                <text class="feature-text">实时供热</text>
              </view>
            </view>
            <view class="hero-stats">
              <view class="stat-item">
                <text class="stat-number">24h</text>
                <text class="stat-label">不间断服务</text>
              </view>
              <view class="stat-divider"></view>
              <view class="stat-item">
                <text class="stat-number">960577</text>
                <text class="stat-label">暖心热线</text>
              </view>
            </view>
          </view>
          <!-- 供热动画元素 -->
          <view class="heating-particles">
            <view class="particle particle-1"></view>
            <view class="particle particle-2"></view>
            <view class="particle particle-3"></view>
            <view class="particle particle-4"></view>
          </view>
        </view>
      </view>

      <!-- Primary Actions - Material Card Design -->
      <view class="primary-actions-section">
        <view class="section-header">
          <text class="section-title">核心服务</text>
          <text class="section-subtitle">一键搞定，温暖到家</text>
        </view>
        
        <view class="primary-actions-grid">
          <view 
            class="material-card primary-action-card material-elevation-2" 
            @click="navigateToMyProperty"
            hover-class="card-hover"
          >
            <view class="card-media">
              <view class="material-icon-container priority-highest">
                <image src="../../static/icons/myhome.png" mode="aspectFit" style="width:48rpx;height:48rpx;" />
                <view class="heating-glow"></view>
              </view>
            </view>
            <view class="card-content">
              <text class="card-title">我的房产</text>
              <text class="card-subtitle">智能管理您的暖心小家</text>
            </view>
            <view class="card-actions">
              <view class="material-button text-button">
                <text class="button-label">立即查看</text>
              </view>
            </view>
            <view class="warmth-indicator">
              <view class="warmth-bar"></view>
            </view>
          </view>

          <view 
            class="material-card primary-action-card material-elevation-2" 
            @click="navigateToPayment"
            hover-class="card-hover"
          >
            <view class="card-media">
              <view class="material-icon-container priority-highest">
                <image src="../../static/icons/pay.png" mode="aspectFit" style="width:48rpx;height:48rpx;" />
                <view class="heating-glow"></view>
              </view>
            </view>
            <view class="card-content">
              <text class="card-title">暖费速缴</text>
              <text class="card-subtitle">一秒支付，温暖不等待</text>
            </view>
            <view class="card-actions">
              <view class="material-button text-button">
                <text class="button-label">快速缴费</text>
              </view>
            </view>
            <view class="warmth-indicator">
              <view class="warmth-bar"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- Material List - Announcements -->
      <view class="announcements-section">
        <view class="announcement-card material-elevation-1" @click="navigateToAnnouncements">
          <view class="list-item">
                          <view class="list-item-leading">
                <view class="material-icon-container priority-high">
                  <image src="../../static/icons/message.png" mode="aspectFit" style="width:40rpx;height:40rpx;" />
                  <view class="pulse-ring"></view>
                </view>
              </view>
            <view class="list-item-content">
              <text class="list-item-title">供热资讯</text>
              <text class="list-item-subtitle">全新智能供热缴费正式上线，体验便捷服务</text>
              <text class="list-item-supporting">刚刚发布</text>
            </view>
            <view class="list-item-trailing">
              <view class="badge-hot">HOT</view>
              <text class="material-icon">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Service Grid - Material Design Grid -->
      <view class="services-section">
        <view class="section-header">
          <text class="section-title">供热管家</text>
          <text class="section-subtitle">全方位暖心服务，贴心守护您的温暖生活</text>
        </view>
        
        <view class="services-grid">
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('paymentRecord')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-high">
              <image src="../../static/icons/subicons/list.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">暖费记录</text>
          </view>
          
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('invoice')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-high">
              <image src="../../static/icons/subicons/bills.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">电子账单</text>
          </view>
          
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('regulations')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-medium">
              <image src="../../static/icons/subicons/books.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">供热政策</text>
          </view>
          
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('guide')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-medium">
              <image src="../../static/icons/subicons/search.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">办事指南</text>
          </view>
          
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('officeLocation')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-low">
              <image src="../../static/icons/subicons/location.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">营业网点</text>
          </view>
          
          <view 
            class="service-card material-elevation-1" 
            @click="navigateToService('faq')"
            hover-class="card-hover"
          >
            <view class="service-icon-container priority-low">
              <image src="../../static/icons/subicons/question.png" mode="aspectFit" style="width:36rpx;height:36rpx;" />
            </view>
            <text class="service-label">暖心答疑</text>
          </view>
        </view>
      </view>

      <!-- Footer Section -->
      <view class="footer-section" style="display: flex; justify-content: center; align-items: center; padding: 24rpx 0 0 0;">
        <view class="material-button outlined-button" @click="openApiTest">
          <text class="material-icon">🔧</text>
          <text class="button-label">技术支持</text>
        </view>
      </view>

      <!-- Bottom Safe Area -->
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { apiService } from '@/api';
import { AuthUtils } from '@/utils/auth';

// Reactive data
const isScrolled = ref(false);

onMounted(() => {
  console.log('Material Design 首页已加载');
  checkAuthAndLoadData();
});

// 使用 UniApp 的 onShow 生命周期
onShow(() => {
  // 每次显示页面时检查登录状态
  if (!apiService.isLoggedIn()) {
    console.log('用户未登录，跳转到登录页面');
    uni.reLaunch({
      url: '/pages/login/index'
    });
    return;
  }
});

// 处理滚动事件
const handleScroll = (e: any) => {
  const scrollTop = e.detail.scrollTop;
  isScrolled.value = scrollTop > 20;
};

// 检查认证状态并加载数据
const checkAuthAndLoadData = async () => {
  // 检查登录状态
  if (!apiService.isLoggedIn()) {
    uni.reLaunch({
      url: '/pages/login/index'
    });
    return;
  }
  
  // 加载用户信息和其他数据
  try {
    // 可以在这里获取用户信息、系统配置等
    const userInfo = apiService.getUserInfoFromStorage();
    console.log('当前用户信息:', userInfo);
  } catch (error) {
    console.error('加载用户数据失败:', error);
  }
};

// 跳转到我的房产
const navigateToMyProperty = () => {
  uni.navigateTo({
    url: '/pages/property/index'
  });
};

// 跳转到缴费
const navigateToPayment = () => {
  uni.navigateTo({
    url: '/pages/heat-payment/index'
  });
};

// 跳转到公告页面
const navigateToAnnouncements = () => {
  uni.navigateTo({
    url: '/pages/announcements/index',
    success: () => {
      console.log('跳转到公告页面成功');
    },
    fail: (err) => {
      console.error('跳转到公告页面失败', err);
      uni.showToast({
        title: '跳转失败，请重试',
        icon: 'none'
      });
    }
  });
};

// 跳转到服务页面
const navigateToService = (serviceType: string) => {
  const serviceNames: {[key: string]: string} = {
    paymentRecord: '交费记录',
    invoice: '电子发票',
    regulations: '供热法规',
    guide: '办事指南',
    officeLocation: '营业厅地址',
    faq: '常见问题'
  };
  
  // 定义页面路由映射
  const serviceRoutes: {[key: string]: string} = {
    paymentRecord: '/pages/payment-record/index',
    invoice: '/pages/electronic-invoice/index',
    regulations: '/pages/heating-regulations/index',
    guide: '/pages/service-guide/index',
    officeLocation: '/pages/office-locations/index',
    faq: '/pages/faq/index'
  };
  
  // 检查是否有对应的页面路由
  if (serviceRoutes[serviceType]) {
    uni.navigateTo({
      url: serviceRoutes[serviceType],
      success: () => {
        console.log(`跳转到${serviceNames[serviceType]}页面成功`);
      },
      fail: (err) => {
        console.error(`跳转到${serviceNames[serviceType]}页面失败`, err);
        uni.showToast({
          title: '跳转失败，请重试',
          icon: 'none'
        });
      }
    });
    return;
  }
  
  // 如果没有对应的页面路由，显示开发中提示
  uni.showToast({
    title: `${serviceNames[serviceType]}功能正在开发中`,
    icon: 'none'
  });
};

// 打开API测试页面
const openApiTest = () => {
  uni.navigateTo({
    url: '/pages/api-test/index'
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 调用登出API并清除本地数据
          await AuthUtils.logout();
        } catch (error) {
          console.error('退出登录失败:', error);
          // 即使API调用失败，也要跳转到登录页
          uni.reLaunch({
            url: '/pages/login/index'
          });
        }
      }
    }
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
  --warm-glass-bg: rgba(255, 255, 255, 1);
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;
  --accent-primary: var(--md-primary);
  --accent-secondary: var(--md-primary-variant);
  --accent-warm: var(--md-secondary);
  
  /* 优先级渐变色系 - 用于图标和按钮 */
  --priority-highest: linear-gradient(135deg, #ff4500 0%, #ff6b35 100%);  /* 最高优先级 - 深橙红 */
  --priority-high: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%);     /* 高优先级 - 主色调 */
  --priority-medium: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);   /* 中等优先级 - 温暖橙 */
  --priority-low: linear-gradient(135deg, #ffcc80 0%, #ffd54f 100%);      /* 低优先级 - 浅暖黄 */
  --priority-minimal: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);  /* 最低优先级 - 极浅暖色 */
  
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

/* Material Design 样式类 */
.material-elevation-0 { box-shadow: var(--md-elevation-0); }
.material-elevation-1 { box-shadow: var(--md-elevation-1); }
.material-elevation-2 { box-shadow: var(--md-elevation-2); }
.material-elevation-3 { box-shadow: var(--md-elevation-3); }
.material-elevation-4 { box-shadow: var(--md-elevation-4); }
.material-elevation-5 { box-shadow: var(--md-elevation-5); }

/* Material Design 字体类 */
.headline-large { font-size: 32rpx; font-weight: 400; line-height: 1.25; }
.headline-medium { font-size: 28rpx; font-weight: 400; line-height: 1.3; }
.headline-small { font-size: 24rpx; font-weight: 400; line-height: 1.35; }
.title-large { font-size: 22rpx; font-weight: 500; line-height: 1.4; }
.title-medium { font-size: 16rpx; font-weight: 500; line-height: 1.5; }
.title-small { font-size: 14rpx; font-weight: 500; line-height: 1.4; }
.body-large { font-size: 16rpx; font-weight: 400; line-height: 1.5; }
.body-medium { font-size: 14rpx; font-weight: 400; line-height: 1.4; }
.body-small { font-size: 12rpx; font-weight: 400; line-height: 1.35; }
.label-large { font-size: 14rpx; font-weight: 500; line-height: 1.4; }
.label-medium { font-size: 12rpx; font-weight: 500; line-height: 1.35; }
.label-small { font-size: 11rpx; font-weight: 500; line-height: 1.3; }
.caption { font-size: 20rpx; font-weight: 400; color: var(--text-muted); line-height: 1.3; }
.body2 { font-size: 22rpx; font-weight: 400; color: var(--text-secondary); line-height: 1.4; }

/* Material Design 按钮状态 */
.card-hover {
  transform: translateY(-2rpx);
  box-shadow: var(--md-elevation-3);
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
.material-home-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  z-index: -10;
}

.material-home-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
}

/* 温暖渐变背景设计 */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: transparent !important;
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent !important;
  opacity: 1;
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent !important;
  opacity: 1;
}

/* 顶部 App Bar */
.material-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease;
}

.scrolled {
  background: linear-gradient(135deg, rgba(255, 248, 240, 0.95) 0%, rgba(255, 238, 213, 0.9) 100%);
  backdrop-filter: blur(20rpx);
  box-shadow: 0 6rpx 24rpx rgba(255, 138, 80, 0.2);
  border-bottom: 1rpx solid rgba(255, 138, 80, 0.15);
}

.app-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 160rpx 40rpx 20rpx; /* 增加顶部间距，避免被小程序状态栏遮挡 */
}

.app-bar-leading {
  display: flex;
  align-items: center;
}

.brand-container {
  display: flex;
  align-items: center;
}

.brand-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 15rpx;
  margin-right: 20rpx;
}

.brand-logo {
  width: 100%;
  height: 100%;
  border-radius: 15rpx;
}

.brand-text {
  flex: 1;
}

.brand-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
  letter-spacing: 1rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  display: block;
  font-size: 26rpx;
  color: var(--text-secondary);
  font-weight: 400;
}

.app-bar-actions {
  display: flex;
  align-items: center;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 10rpx 12rpx 10rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 1rpx solid rgba(0, 0, 0, 0.1);
  border-radius: 50rpx;
  backdrop-filter: blur(10rpx);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  min-width: 120rpx;
}

.logout-text {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
  width: 100%;
  text-align: center;
}

/* 内容区域 */
.material-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  padding: 200rpx 0 40rpx; /* 增加顶部间距，避免被App Bar遮挡 */
}

/* 区块标题 */
.section-header {
  padding: 0 40rpx;
  margin-bottom: 32rpx;
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  padding-left: 32rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%);
  border-radius: 3rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.3);
}

.section-subtitle {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 400;
}

/* 核心功能区 */
.primary-actions-section {
  margin-bottom: 50rpx;
}

.primary-actions-grid {
  padding: 0 40rpx;
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.material-card {
  background: #ffffff;
  border-radius: var(--border-radius);
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 200rpx;
}

.card-media {
  width: 80rpx;
  height: 80rpx;
  background: var(--priority-high); /* 核心功能使用高优先级渐变 */
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.3);
  position: relative;
  overflow: hidden;
}

.material-icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icon {
  font-size: 40rpx;
  line-height: 1;
  position: relative;
  z-index: 2;
}

.card-content {
  text-align: center;
  margin-bottom: 16rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.card-subtitle {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 400;
}

.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.material-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1rpx solid rgba(0, 0, 0, 0.1);
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  backdrop-filter: blur(10rpx);
  box-shadow: var(--shadow-sm);
}

.button-label {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

/* 公告卡片 */
.announcements-section {
  padding: 0 40rpx;
  margin-bottom: 50rpx;
}

.announcement-card {
  background: linear-gradient(135deg, #fbeee6 0%, #ffe7d1 100%) !important;
  border-left: 8rpx solid var(--md-primary);
  box-shadow: 0 8rpx 24rpx rgba(255, 183, 77, 0.13);
  border-radius: 32rpx;
  position: relative;
  overflow: hidden;
}

/* 资讯卡片角落柔光装饰 */
.announcement-card::before {
  content: '';
  position: absolute;
  top: -40rpx;
  left: -40rpx;
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle, #ffe0b2 0%, rgba(255,255,255,0.1) 80%, transparent 100%);
  z-index: 0;
}

.announcement-card::after {
  content: '';
  position: absolute;
  bottom: -30rpx;
  right: -30rpx;
  width: 80rpx;
  height: 80rpx;
  background: radial-gradient(circle, #ffd180 0%, rgba(255,255,255,0.08) 80%, transparent 100%);
  z-index: 0;
}

.list-item {
  display: flex;
  align-items: center;
}

.list-item-leading {
  margin-right: 20rpx;
}

.list-item-content {
  flex: 1;
}

.list-item-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.list-item-subtitle {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 400;
}

.list-item-supporting {
  display: block;
  font-size: 24rpx;
  color: var(--text-muted);
}

.list-item-trailing {
  display: flex;
  align-items: center;
}

.badge-new {
  background: var(--accent-secondary);
  color: #fff;
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

/* 服务网格 */
.services-section {
  margin-bottom: 60rpx;
}

.services-grid {
  padding: 0 40rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20rpx;
}

.service-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 16rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(255, 167, 38, 0.12);
  border: 1rpx solid rgba(255, 167, 38, 0.15);
  transition: all 0.3s ease;
  position: relative;
  min-height: 140rpx;
  backdrop-filter: blur(8rpx);
}

.service-card:active {
  transform: translateY(-4rpx);
  box-shadow: var(--shadow-lg);
}

.service-icon-container {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%); /* 默认渐变色 */
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 6rpx 16rpx rgba(255, 167, 38, 0.3);
  color: #ffffff;
}

/* 为不同服务图标设置不同的渐变色 */
.service-card:nth-child(1) .service-icon-container {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%); /* 缴费 - 主橙色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.3);
}

.service-card:nth-child(2) .service-icon-container {
  background: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%); /* 公告 - 中橙色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 167, 38, 0.3);
}

.service-card:nth-child(3) .service-icon-container {
  background: linear-gradient(135deg, #ffcc80 0%, #ffd54f 100%); /* 服务指南 - 浅橙色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 204, 128, 0.3);
}

.service-card:nth-child(4) .service-icon-container {
  background: linear-gradient(135deg, #ff9800 0%, #ffc107 100%); /* 办事网点 - 黄橙色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 152, 0, 0.3);
}

.service-card:nth-child(5) .service-icon-container {
  background: linear-gradient(135deg, #ffb74d 0%, #ffc947 100%); /* 供热法规 - 暖黄色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 183, 77, 0.3);
}

.service-card:nth-child(6) .service-icon-container {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); /* 常见问题 - 极浅暖色 */
  box-shadow: 0 6rpx 16rpx rgba(255, 243, 224, 0.3);
  color: #ff6b35; /* 图标颜色改为深橙色以保证对比度 */
}

.service-icon {
  font-size: 32rpx;
  line-height: 1;
}

.service-label {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}

/* 底部区域 */
.footer-section {
  padding: 0 0rpx 0rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-card {
  background: #ffffff;
  border-radius: var(--border-radius);
  padding: 0rpx 0rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.developer-section {
  margin-bottom: 0rpx;
}

.material-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
  padding: 16rpx 4rpx;
  backdrop-filter: blur(10rpx);
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.footer-info {
  text-align: center;
}

.footer-text,
.footer-copyright {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8rpx;
}

.footer-slogan {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8rpx;
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

@keyframes warmGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes heatPulse {
  0%, 100% {
    background: rgba(255, 138, 80, 0.1);
    transform: scale(1);
  }
  50% {
    background: rgba(255, 167, 38, 0.2);
    transform: scale(1.05);
  }
}

@keyframes heatFlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes heatRise {
  0% {
    opacity: 0;
    transform: translateY(20rpx);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-20rpx);
  }
}

@keyframes iconGlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 供热主题动画 */
@keyframes heroGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes heatingParticles {
  0% {
    transform: translateY(100rpx) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100rpx) scale(1);
    opacity: 0;
  }
}

@keyframes heatingGlow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes warmthFlow {
  0% {
    width: 0%;
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0.5;
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes temperatureRise {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8rpx);
    opacity: 1;
  }
}

@keyframes materialRipple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Hero Section Styles */
.hero-section {
  padding: 120rpx 40rpx 40rpx;
  animation: slideInDown 0.8s ease-out;
}

.hero-card {
  background: linear-gradient(135deg, #ff5a1f 0%, #ff8a50 100%) !important;
  border-radius: 24rpx !important;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.18) !important;
  border: 1rpx solid rgba(255, 167, 38, 0.25) !important;
  color: #fff !important;
  position: relative !important;
  z-index: 100 !important;
  overflow: visible !important;
  margin-top: 4rpx !important;
  margin-bottom: 4rpx !important;
  padding: 42rpx 40rpx !important;
}
.hero-card::before,
.hero-card::after {
  display: none !important;
}
.material-background,
.primary-surface,
.elevation-overlay {
  background: transparent !important;
}

.hero-content { position: relative; z-index: 2; }

.hero-headline {
  text-align: center;
  margin-bottom: 40rpx;
}

.hero-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  display: block;
  font-size: 26rpx;
  font-weight: 400;
  opacity: 0.9;
}

.hero-features {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.feature-icon {
  font-size: 40rpx;
  line-height: 1;
  margin-bottom: 8rpx;
}

.feature-icon-modern {
  width: 48rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.icon-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

/* 现代化图标样式 */
.modern-icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-icon {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.button-icon-modern {
  width: 32rpx;
  height: 32rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8rpx;
}

.button-icon-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #ffffff;
}

.announcement-icon-modern {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-icon-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.feature-text {
  display: block;
  font-size: 22rpx;
  font-weight: 400;
  opacity: 0.8;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
  color: var(--md-on-primary);
}

.stat-item {
  text-align: center;
}

.hero-stats .stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
  color: var(--md-on-primary);
}

.hero-stats .stat-label {
  display: block;
  font-size: 22rpx;
  font-weight: 400;
  opacity: 0.8;
  margin-top: 8rpx;
  color: var(--md-on-primary);
}

.stat-divider {
  width: 2rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1rpx;
}

/* Enhanced Primary Actions */
.primary-actions-grid {
  padding: 0 40rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.primary-action-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 240rpx;
  border: 1rpx solid rgba(255, 167, 38, 0.2);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
}

.primary-action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.primary-action-card.card-hover::before {
  transform: translateX(100%);
}

/* Material Icons */
.material-icon {
  font-family: 'Material Icons', 'Material Icons Outlined', 'Segoe UI', system-ui, sans-serif;
  font-size: 40rpx;
  line-height: 1;
  display: inline-block;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* 兼容性图标映射 */
.material-icon:before {
  content: attr(data-icon);
}

/* Material Icons 通过直接在模板中使用emoji实现，无需CSS选择器 */

/* 供热主题特殊样式 */
.heating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: heatingParticles 3s infinite ease-in-out;
}

.particle-1 {
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  left: 40%;
  animation-delay: 0.8s;
}

.particle-3 {
  left: 60%;
  animation-delay: 1.6s;
}

.particle-4 {
  left: 80%;
  animation-delay: 2.4s;
}

.heating-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 167, 38, 0.3) 0%, transparent 70%);
  border-radius: inherit;
  animation: heatingGlow 2s ease-in-out infinite;
}

.warmth-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6rpx;
  background: rgba(255, 167, 38, 0.2);
  border-radius: 0 0 var(--md-corner-radius-large) var(--md-corner-radius-large);
  overflow: hidden;
}

.warmth-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--md-primary) 0%, var(--md-secondary) 100%);
  animation: warmthFlow 2s ease-in-out infinite;
}

.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4rpx solid var(--md-secondary);
  border-radius: inherit;
  animation: pulseRing 2s ease-out infinite;
}

.badge-hot {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%);
  color: var(--md-on-primary);
  font-size: 18rpx;
  font-weight: 700;
  padding: 8rpx 18rpx 8rpx 18rpx;
  border-radius: 20rpx;
  text-transform: uppercase;
  letter-spacing: 1rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.3);
  animation: heatingGlow 1.5s ease-in-out infinite;
  margin-right: 12rpx;
}

.service-temp-indicator {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  font-size: 20rpx;
  animation: temperatureRise 2s ease-in-out infinite;
}

/* 增强的主题色彩 */
:root {
  /* 供热主题色彩增强 */
  --heating-primary: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%);
  --heating-secondary: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);
  --heating-accent: linear-gradient(135deg, #ff9800 0%, #ffc107 100%);
  --warm-surface: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  --heating-shadow: 0 4rpx 20rpx rgba(255, 107, 53, 0.25);
}

/* 核心服务板块的特殊样式 */
.primary-action-card:first-child {
  background: linear-gradient(135deg, #ff8a50 0%, #ffb74d 100%);
  color: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.3);
}

.primary-action-card:last-child {
  background: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);
  color: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(255, 167, 38, 0.3);
}

/* 优先级图标样式系统 */
.icon-priority-highest,
.material-icon-container.priority-highest {
  background: var(--priority-highest) !important;
  box-shadow: 0 8rpx 20rpx rgba(255, 69, 0, 0.4) !important;
}

/* 新增：核心服务卡片图标更浅色 */
.primary-action-card .material-icon-container.priority-highest {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%) !important;
  box-shadow: 0 4rpx 10rpx rgba(232, 185, 55, 0.18) !important;
}

.icon-priority-high,
.material-icon-container.priority-high {
  background: var(--priority-high) !important;
  box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.3) !important;
}

.icon-priority-medium,
.material-icon-container.priority-medium {
  background: var(--priority-medium) !important;
  box-shadow: 0 4rpx 12rpx rgba(255, 167, 38, 0.25) !important;
}

.icon-priority-low,
.material-icon-container.priority-low {
  background: var(--priority-low) !important;
  box-shadow: 0 3rpx 8rpx rgba(255, 204, 128, 0.2) !important;
}

.icon-priority-minimal,
.material-icon-container.priority-minimal {
  background: var(--priority-minimal) !important;
  box-shadow: 0 2rpx 6rpx rgba(255, 243, 224, 0.15) !important;
}

.service-icon-container {
  background: var(--heating-primary);
  box-shadow: var(--heating-shadow);
  position: relative;
  overflow: visible;
}

.hero-card {
  background: var(--heating-primary);
  position: relative;
  overflow: hidden;
}

.primary-action-card {
  background: var(--warm-surface);
  border: 2rpx solid rgba(255, 167, 38, 0.1);
  position: relative;
  overflow: hidden;
}

.announcement-card {
  background: var(--warm-surface);
  border-left: 8rpx solid var(--md-primary);
  box-shadow: var(--heating-shadow);
}

.service-card {
  background: var(--warm-surface);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-4rpx);
  box-shadow: var(--heating-shadow);
  border-color: var(--md-primary);
}

/* 热力图标专业化设计 */
.heat-icon {
  position: relative;
  width: 48rpx;
  height: 48rpx;
  z-index: 2;
}

.heat-waves {
  position: relative;
  width: 100%;
  height: 100%;
}

.wave-circle {
  position: absolute;
  border: 3rpx solid var(--md-primary);
  border-radius: 50%;
  animation: heatPulse 2s ease-in-out infinite;
}

.wave-1 {
  width: 16rpx;
  height: 16rpx;
  top: 16rpx;
  left: 16rpx;
  animation-delay: 0s;
}

.wave-2 {
  width: 28rpx;
  height: 28rpx;
  top: 10rpx;
  left: 10rpx;
  animation-delay: 0.5s;
}

.wave-3 {
  width: 40rpx;
  height: 40rpx;
  top: 4rpx;
  left: 4rpx;
  animation-delay: 1s;
}

@keyframes heatPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

/* 响应式供热主题 */
@media (max-width: 750rpx) {
  .hero-features {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  
  .feature-text {
    font-size: 24rpx;
  }
}

.material-button.outlined-button {
  color: #222 !important;
}
</style>
