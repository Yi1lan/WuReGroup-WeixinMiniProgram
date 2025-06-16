<template>
  <view class="office-locations-container">
    <!-- 现代化背景设计 -->
    <view class="material-background">
      <view class="primary-surface"></view>
      <view class="elevation-overlay"></view>
      <view class="geometric-pattern">
        <view class="pattern-shape shape-1"></view>
        <view class="pattern-shape shape-2"></view>
        <view class="pattern-lines">
          <view class="line line-1"></view>
          <view class="line line-2"></view>
          <view class="line line-3"></view>
        </view>
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
          <text class="page-title">营业网点</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 统计概览卡片 -->
      <view class="overview-section">
        <view class="overview-card">
          <view class="overview-item">
            <text class="overview-number">{{ totalOffices }}</text>
            <text class="overview-label">营业厅</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-number">{{ workingDays }}</text>
            <text class="overview-label">工作日</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-number">09-18</text>
            <text class="overview-label">营业时间</text>
          </view>
        </view>
      </view>

      <!-- 快速功能区 -->
      <view class="quick-actions-section">
        <text class="section-title">快速功能</text>
        <view class="quick-actions-grid">
          <view class="quick-action-card" @click="findNearestOffice">
            <view class="action-icon-container">
              <view class="action-icon nearest-icon">
                <view class="location-pin"></view>
                <view class="location-circle"></view>
              </view>
            </view>
            <text class="action-title">就近营业厅</text>
            <text class="action-subtitle">GPS定位推荐</text>
          </view>
          <view class="quick-action-card" @click="showAllOnMap">
            <view class="action-icon-container">
              <view class="action-icon map-icon">
                <view class="map-base"></view>
                <view class="map-marker"></view>
              </view>
            </view>
            <text class="action-title">地图总览</text>
            <text class="action-subtitle">所有网点位置</text>
          </view>
          <view class="quick-action-card" @click="showWorkingHours">
            <view class="action-icon-container">
              <view class="action-icon time-icon">
                <view class="clock-face"></view>
                <view class="clock-hand"></view>
              </view>
            </view>
            <text class="action-title">营业时间</text>
            <text class="action-subtitle">时间安排表</text>
          </view>
      </view>
    </view>
    
    <!-- 区域筛选 -->
    <view class="filter-section">
        <text class="filter-title">按区域筛选</text>
        <view class="filter-tabs">
          <view 
            class="filter-tab"
            v-for="district in districts" 
            :key="district.id"
            :class="{ active: selectedDistrict === district.id }"
            @click="selectDistrict(district.id)"
          >
            <view class="tab-icon-container">
              <view class="tab-icon district-icon">
                <view class="building-shape"></view>
                <view class="building-windows"></view>
      </view>
      </view>
            <text class="tab-text">{{ district.name }}</text>
            <view class="tab-count">{{ getDistrictCount(district.id) }}</view>
      </view>
      </view>
      </view>

      <!-- 营业厅列表 -->
      <view class="offices-section">
        <view class="offices-header">
          <text class="offices-title">
            {{ selectedDistrict === 'all' ? '全部营业厅' : getDistrictName(selectedDistrict) }}
          </text>
          <text class="offices-count">{{ filteredOffices.length }}个网点</text>
    </view>
    
        <view class="offices-list">
          <view 
            class="office-card"
            v-for="(office, index) in filteredOffices" 
            :key="office.id"
          >
            <!-- 营业厅头部 -->
        <view class="office-header">
              <view class="office-icon-container">
                <view class="office-icon">
                  <view class="building-main"></view>
                  <view class="building-roof"></view>
                  <view class="building-door"></view>
                </view>
              </view>
              <view class="office-basic-info">
          <text class="office-name">{{ office.name }}</text>
                <view class="office-status">
                  <view class="status-indicator" :class="{ working: isOfficeWorking(office) }"></view>
                  <text class="status-text">{{ getOfficeStatus(office) }}</text>
                </view>
              </view>
              <view class="office-distance-info">
                <text class="distance-value">{{ office.distance }}</text>
                <text class="distance-label">距离</text>
          </view>
        </view>
        
            <!-- 营业厅详细信息 -->
            <view class="office-details">
              <view class="detail-item">
                <view class="detail-icon">
                  <view class="address-icon">
                    <view class="pin-top"></view>
                    <view class="pin-bottom"></view>
          </view>
          </view>
                <text class="detail-text">{{ office.address }}</text>
              </view>
              <view class="detail-item">
                <view class="detail-icon">
                  <view class="phone-icon">
                    <view class="phone-body"></view>
                    <view class="phone-screen"></view>
                  </view>
                </view>
                <text class="detail-text">{{ office.phone }}</text>
              </view>
              <view class="detail-item">
                <view class="detail-icon">
                  <view class="time-icon">
                    <view class="clock-body"></view>
                    <view class="clock-pointer"></view>
                  </view>
                </view>
                <text class="detail-text">{{ office.hours }}</text>
          </view>
        </view>
        
            <!-- 服务范围标签 -->
            <view class="office-services">
              <view 
                class="service-tag"
                v-for="service in office.serviceTypes" 
                :key="service"
              >
                <text class="service-text">{{ service }}</text>
              </view>
            </view>

            <!-- 操作按钮 -->
        <view class="office-actions">
              <button class="action-btn secondary" @click="callOffice(office)">
                <view class="btn-icon">
                  <view class="call-icon">
                    <view class="phone-shape"></view>
                    <view class="call-waves"></view>
                  </view>
                </view>
            <text class="btn-text">一键拨号</text>
          </button>
              <button class="action-btn primary" @click="navigateToOffice(office)">
                <view class="btn-icon">
                  <view class="navigate-icon">
                    <view class="arrow-shape"></view>
                    <view class="arrow-tail"></view>
                  </view>
                </view>
            <text class="btn-text">导航前往</text>
          </button>
            </view>
        </view>
      </view>
      
        <!-- 空状态 -->
      <view class="empty-state" v-if="filteredOffices.length === 0">
          <view class="empty-icon-container">
            <view class="empty-icon">
              <view class="search-icon">
                <view class="search-circle"></view>
                <view class="search-handle"></view>
      </view>
            </view>
          </view>
          <text class="empty-title">暂无营业厅</text>
          <text class="empty-subtitle">该区域暂时没有营业厅信息</text>
          <button class="empty-action" @click="selectDistrict('all')">
            <text class="empty-action-text">查看全部营业厅</text>
          </button>
        </view>
      </view>

      <!-- 营业厅详情弹窗 -->
      <view class="detail-modal" v-if="showDetail" @click="closeDetail">
        <view class="detail-content" @click.stop>
      <view class="detail-header">
            <view class="detail-icon-container">
              <view class="detail-office-icon">
                <view class="modal-building"></view>
                <view class="modal-flag"></view>
              </view>
            </view>
            <view class="detail-title-area">
        <text class="detail-title">{{ currentOffice.name }}</text>
              <text class="detail-subtitle">详细信息</text>
            </view>
            <button class="detail-close" @click="closeDetail">
              <text class="close-icon">×</text>
            </button>
      </view>
      
          <view class="detail-body">
            <!-- 地图区域 -->
            <view class="detail-map-section">
              <view class="map-container">
                <view class="map-placeholder">
                  <view class="map-icon">
                    <view class="map-grid"></view>
                    <view class="map-pin"></view>
                  </view>
                  <text class="map-text">点击查看地图位置</text>
                </view>
          </view>
        </view>
        
            <!-- 详细信息 -->
        <view class="detail-info-section">
              <view class="info-group">
                <text class="info-group-title">基本信息</text>
                <view class="info-item">
                  <text class="info-label">营业厅地址</text>
                  <text class="info-value">{{ currentOffice.address }}</text>
          </view>
                <view class="info-item">
                  <text class="info-label">联系电话</text>
                  <text class="info-value">{{ currentOffice.phone }}</text>
          </view>
                <view class="info-item">
                  <text class="info-label">营业时间</text>
                  <text class="info-value">{{ currentOffice.hours }}</text>
          </view>
              </view>

              <view class="info-group">
                <text class="info-group-title">服务内容</text>
                <text class="info-description">{{ currentOffice.services }}</text>
                <view class="service-features">
                  <view 
                    class="feature-item"
                    v-for="feature in currentOffice.features" 
                    :key="feature"
                  >
                    <view class="feature-dot"></view>
                    <text class="feature-text">{{ feature }}</text>
                  </view>
                </view>
          </view>
        </view>
        
            <!-- 操作按钮 -->
        <view class="detail-actions">
              <button class="detail-btn secondary" @click="callOffice(currentOffice)">
                <view class="detail-btn-icon">
                  <view class="detail-call-icon">
                    <view class="call-body"></view>
                    <view class="call-signal"></view>
                  </view>
                </view>
                <text class="detail-btn-text">拨打电话</text>
          </button>
              <button class="detail-btn primary" @click="navigateToOffice(currentOffice)">
                <view class="detail-btn-icon">
                  <view class="detail-nav-icon">
                    <view class="nav-arrow"></view>
                    <view class="nav-path"></view>
                  </view>
                </view>
                <text class="detail-btn-text">导航前往</text>
          </button>
        </view>
      </view>
    </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 选中的区域
const selectedDistrict = ref('all');

// 详情弹窗状态
const showDetail = ref(false);
const currentOffice = ref<any>({});

// 区域数据
const districts = ref([
  { id: 'all', name: '全部' },
  { id: 'tianshan', name: '天山区' },
  { id: 'saybag', name: '沙依巴克区' },
  { id: 'shuimogou', name: '水磨沟区' },
  { id: 'toutunhe', name: '头屯河区' },
  { id: 'xinshi', name: '新市区' }
]);

// 营业厅数据
const offices = ref([
  {
    id: '001',
    name: '总部营业厅',
    district: 'shuimogou',
    address: '乌鲁木齐市水磨沟区南湖北路133号',
    phone: '0991-2867777',
    hours: '周一至周五 09:00-18:00',
    distance: '3.5km',
    services: '办理供热报装、缴费、报修、投诉建议等全套业务',
    serviceTypes: ['报装', '缴费', '报修', '投诉'],
    features: ['全业务办理', '专业技术支持', '投诉处理', '政策咨询'],
    coordinates: {
      latitude: 43.825592,
      longitude: 87.600970
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '10:00-16:00'
    }
  },
  {
    id: '002',
    name: '天山区营业厅',
    district: 'tianshan',
    address: '乌鲁木齐市天山区解放北路365号',
    phone: '0991-2867888',
    hours: '周一至周五 09:00-18:00',
    distance: '2.1km',
    services: '办理供热报装、缴费、报修等常规业务',
    serviceTypes: ['报装', '缴费', '报修'],
    features: ['常规业务办理', '快速缴费', '故障报修'],
    coordinates: {
      latitude: 43.793566,
      longitude: 87.615238
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '休息'
    }
  },
  {
    id: '003',
    name: '沙依巴克区营业厅',
    district: 'saybag',
    address: '乌鲁木齐市沙依巴克区友好北路235号',
    phone: '0991-2867999',
    hours: '周一至周五 09:00-18:00',
    distance: '4.3km',
    services: '办理供热报装、缴费、报修等常规业务',
    serviceTypes: ['报装', '缴费', '报修'],
    features: ['常规业务办理', '快速缴费', '技术咨询'],
    coordinates: {
      latitude: 43.801380,
      longitude: 87.582483
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '休息'
    }
  },
  {
    id: '004',
    name: '水磨沟区第二营业厅',
    district: 'shuimogou',
    address: '乌鲁木齐市水磨沟区南湖东路89号',
    phone: '0991-2868000',
    hours: '周一至周五 09:00-18:00',
    distance: '5.2km',
    services: '办理供热缴费、报修等基础业务',
    serviceTypes: ['缴费', '报修'],
    features: ['快速缴费', '故障报修', '便民服务'],
    coordinates: {
      latitude: 43.815672,
      longitude: 87.614358
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '休息'
    }
  },
  {
    id: '005',
    name: '头屯河区营业厅',
    district: 'toutunhe',
    address: '乌鲁木齐市头屯河区西环路233号',
    phone: '0991-2868111',
    hours: '周一至周五 09:00-18:00',
    distance: '8.7km',
    services: '办理供热报装、缴费、报修等常规业务',
    serviceTypes: ['报装', '缴费', '报修'],
    features: ['常规业务办理', '新用户服务', '技术支持'],
    coordinates: {
      latitude: 43.778543,
      longitude: 87.425873
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '休息'
    }
  },
  {
    id: '006',
    name: '新市区营业厅',
    district: 'xinshi',
    address: '乌鲁木齐市新市区北京北路188号',
    phone: '0991-2868222',
    hours: '周一至周五 09:00-18:00',
    distance: '6.8km',
    services: '办理供热缴费、报修、咨询等业务',
    serviceTypes: ['缴费', '报修', '咨询'],
    features: ['快速缴费', '在线咨询', '便民服务'],
    coordinates: {
      latitude: 43.856789,
      longitude: 87.593456
    },
    workingHours: {
      weekday: '09:00-18:00',
      weekend: '休息'
    }
  }
]);

// 计算属性
const totalOffices = computed(() => offices.value.length);
const workingDays = computed(() => '5天');

const filteredOffices = computed(() => {
  if (selectedDistrict.value === 'all') {
    return offices.value;
  }
  return offices.value.filter(office => office.district === selectedDistrict.value);
});

// 方法
const selectDistrict = (district: string) => {
  selectedDistrict.value = district;
};

const getDistrictCount = (districtId: string) => {
  if (districtId === 'all') {
    return offices.value.length;
  }
  return offices.value.filter(office => office.district === districtId).length;
};

const getDistrictName = (districtId: string) => {
  const district = districts.value.find(d => d.id === districtId);
  return district ? district.name : '未知区域';
};

const isOfficeWorking = (office: any) => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0是周日，1-6是周一到周六
  
  // 周一到周五
  if (day >= 1 && day <= 5) {
    return hour >= 9 && hour < 18;
  }
  
  // 周末（只有总部营业厅工作）
  if (office.id === '001' && (day === 0 || day === 6)) {
    return hour >= 10 && hour < 16;
  }
  
  return false;
};

const getOfficeStatus = (office: any) => {
  return isOfficeWorking(office) ? '营业中' : '已停业';
};

const showOfficeDetail = (office: any) => {
  currentOffice.value = office;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
};

const callOffice = (office: any) => {
  uni.makePhoneCall({
    phoneNumber: office.phone,
    success: () => {
      console.log('拨打电话成功');
    },
    fail: (err) => {
      console.error('拨打电话失败', err);
      uni.showToast({
        title: '拨打电话失败，请重试',
        icon: 'none'
      });
    }
  });
};

const navigateToOffice = (office: any) => {
  uni.openLocation({
    latitude: office.coordinates.latitude,
    longitude: office.coordinates.longitude,
    name: office.name,
    address: office.address,
    success: () => {
      console.log('导航成功');
    },
    fail: (err) => {
      console.error('导航失败', err);
  uni.showToast({
        title: '打开地图失败，请重试',
    icon: 'none'
      });
    }
  });
};

const findNearestOffice = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log('获取位置成功', res);
      // 这里可以根据用户位置计算最近的营业厅
      uni.showToast({
        title: '正在为您推荐最近的营业厅',
        icon: 'none'
      });
      
      // 模拟推荐最近的营业厅（这里简单选择第一个）
      setTimeout(() => {
        if (offices.value.length > 0) {
          showOfficeDetail(offices.value[0]);
        }
      }, 1500);
    },
    fail: (err) => {
      console.error('获取位置失败', err);
      uni.showToast({
        title: '获取位置失败，请检查权限设置',
        icon: 'none'
      });
    }
  });
};

const showAllOnMap = () => {
  uni.showToast({
    title: '地图总览功能开发中',
    icon: 'none'
  });
};

const showWorkingHours = () => {
  uni.showModal({
    title: '营业时间',
    content: '周一至周五：09:00-18:00\n总部营业厅周末：10:00-16:00\n其他营业厅周末休息',
    showCancel: false
  });
};

const backToHome = () => {
  uni.navigateBack({
    success: () => {
      console.log('返回成功');
    },
    fail: () => {
      uni.redirectTo({
        url: '/pages/index/index'
      });
    }
  });
};

onMounted(() => {
  console.log('营业网点页面已加载');
});
</script>

<style lang="scss">
/* Material Design CSS变量系统 */
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
  --md-outline: #ddd;
  --md-outline-variant: #eee;
  --md-surface-variant: #f5f5f5;
  --md-on-surface-variant: #666;
  
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
  --warning-orange: #ff8a65;
  --success-green: #4caf50;
  
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
  background: var(--warm-gradient) !important;
  overflow-x: hidden;
}

/* 备用背景保障 */
view, scroll-view {
  background: transparent;
}

/* 确保根级容器背景 */
.office-locations-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--warm-gradient);
  z-index: -10;
}

.office-locations-container {
  min-height: 100vh;
  background: var(--warm-gradient);
  padding-top: 180rpx; /* 增加顶部间距，避免与微信小程序导航栏冲突 */
  position: relative;
  overflow: hidden;
}

/* 现代化背景设计 */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: var(--warm-gradient) !important;
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--warm-gradient);
  opacity: 0.95;
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--warm-gradient);
  opacity: 0.95;
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

.pattern-lines {
  position: absolute;
  top: 30%;
  left: 60%;
  width: 200rpx;
  height: 200rpx;
}

.line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  animation: slide 6s ease-in-out infinite;
}

.line-1 {
  width: 80rpx;
  height: 2rpx;
  top: 20rpx;
  left: 0;
  animation-delay: 0s;
}

.line-2 {
  width: 120rpx;
  height: 2rpx;
  top: 40rpx;
  left: 20rpx;
  animation-delay: 2s;
}

.line-3 {
  width: 60rpx;
  height: 2rpx;
  top: 60rpx;
  left: 10rpx;
  animation-delay: 4s;
}

.pattern-dots {
  position: absolute;
  top: 60%;
  right: 15%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  animation: twinkle 3s ease-in-out infinite;
}

.dot:nth-child(odd) {
  animation-delay: 0.5s;
}

.dot:nth-child(even) {
  animation-delay: 1.5s;
}

/* 内容区域 */
.content-area {
  position: relative;
  z-index: 1;
  height: 100vh;
  padding: 60rpx 0 40rpx;
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
  transition: all 0.3s ease;
}

.nav-back-btn:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-md);
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

/* 统计概览卡片 */
.overview-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.overview-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  padding: 32rpx;
  box-shadow: var(--shadow-lg);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.overview-number {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.3);
}

.overview-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.overview-divider {
  width: 1rpx;
  height: 40rpx;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  margin: 0 24rpx;
}

/* 快速功能区 */
.quick-actions-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.3s both;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24rpx;
  padding-left: 8rpx;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.quick-action-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.quick-action-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.action-icon-container {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
  margin-bottom: 16rpx;
}

.action-icon {
  position: relative;
  width: 28rpx;
  height: 28rpx;
}

.action-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6rpx;
}

.action-subtitle {
  font-size: 20rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* CSS绘制快速功能图标 */
.nearest-icon {
  .location-pin {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 8rpx;
    height: 12rpx;
    background: var(--md-on-primary);
    border-radius: 4rpx 4rpx 0 0;
  }
  
  .location-circle {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 16rpx;
    height: 16rpx;
    border: 2rpx solid var(--md-on-primary);
    border-radius: 50%;
  }
}

.map-icon {
  .map-base {
    width: 80%;
    height: 70%;
    border: 2rpx solid var(--md-on-primary);
    border-radius: 4rpx;
    margin: 15% auto 0;
  }
  
  .map-marker {
    position: absolute;
    top: 30%;
    right: 25%;
    width: 6rpx;
    height: 6rpx;
    background: var(--md-on-primary);
    border-radius: 50%;
  }
}

.time-icon {
  .clock-face {
    width: 80%;
    height: 80%;
    border: 2rpx solid var(--md-on-primary);
    border-radius: 50%;
    margin: 10% auto;
    position: relative;
  }
  
  .clock-hand {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rpx;
    height: 40%;
    background: var(--md-on-primary);
    transform-origin: bottom center;
    transform: translate(-50%, -100%) rotate(45deg);
  }
}

/* 筛选区域 */
.filter-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.filter-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24rpx;
  padding-left: 8rpx;
}

.filter-tabs {
  display: flex;
  overflow-x: auto;
  gap: 16rpx;
  padding-bottom: 8rpx;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-tab {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-sm);
  padding: 16rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 140rpx;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tab.active {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border: 1rpx solid var(--accent-primary);
  box-shadow: var(--warm-shadow);
}

.filter-tab:active {
  transform: scale(0.98);
}

.tab-icon-container {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  position: relative;
  width: 20rpx;
  height: 20rpx;
}

.district-icon {
  .building-shape {
    width: 100%;
    height: 70%;
    background: var(--text-primary);
    border-radius: 2rpx 2rpx 0 0;
  }
  
  .building-windows {
        position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 30%;
    background: var(--md-background);
    border-radius: 1rpx;
  }
}

.filter-tab.active .district-icon {
  .building-shape {
    background: var(--md-on-primary);
  }
  
  .building-windows {
    background: rgba(255, 255, 255, 0.8);
  }
}

.tab-text {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.filter-tab.active .tab-text {
  color: var(--md-on-primary);
  font-weight: 600;
}

.tab-count {
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12rpx;
  padding: 2rpx 8rpx;
  font-size: 18rpx;
  color: var(--accent-primary);
  font-weight: 600;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: var(--md-on-primary);
}

/* 营业厅列表 */
.offices-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.5s both;
}

.offices-header {
    display: flex;
    align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 0 8rpx;
}

.offices-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.offices-count {
  font-size: 22rpx;
  color: var(--text-muted);
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12rpx;
  padding: 4rpx 12rpx;
}

.offices-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.office-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: var(--border-radius);
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.office-card:active {
  transform: translateY(-4rpx);
  box-shadow: var(--md-elevation-3);
}

.office-card::before {
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

.office-card:active::before {
  transform: translateX(100%);
}

/* 卡片头部 */
.office-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.office-info {
  flex: 1;
}

.office-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.office-hours {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.location-arrow {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.arrow {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 600;
}

/* 卡片详情 */
.office-details {
  margin-bottom: 24rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
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

.detail-text {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
}

/* 服务标签 */
.office-services {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.service-tag {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border: 1rpx solid rgba(255, 167, 38, 0.1);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  backdrop-filter: blur(10rpx);
}

.service-text {
  font-size: 22rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 操作按钮 */
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

.action-btn.primary {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%) !important;
  color: #fff !important;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.3);
  border: 2rpx solid #ff6b35;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.action-btn.secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  color: var(--text-primary) !important;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.15);
  border: 2rpx solid rgba(255, 167, 38, 0.2);
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.action-btn:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}

.btn-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  font-size: 26rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-icon-container {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 107, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}
  
  .empty-icon {
  position: relative;
  width: 40rpx;
  height: 40rpx;
}

.search-icon {
  .search-circle {
    width: 24rpx;
    height: 24rpx;
    border: 3rpx solid var(--accent-primary);
    border-radius: 50%;
    margin: 8rpx auto 0;
  }
  
  .search-handle {
    position: absolute;
    bottom: 8rpx;
    right: 8rpx;
    width: 12rpx;
    height: 3rpx;
    background: var(--accent-primary);
    border-radius: 2rpx;
    transform: rotate(45deg);
  }
}

.empty-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.empty-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 32rpx;
  line-height: 1.5;
}

.empty-action {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border: none;
  border-radius: 24rpx;
  padding: 16rpx 32rpx;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  margin: 0;
}

.empty-action:active {
  transform: scale(0.98);
}

.empty-action-text {
  font-size: 24rpx;
  color: var(--md-on-primary);
  font-weight: 500;
}

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8rpx);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.detail-content {
  background: var(--glass-bg);
  backdrop-filter: blur(30rpx);
  border-radius: var(--md-corner-radius-extra-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--md-elevation-5);
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideInScale 0.4s ease-out;
}
  
  .detail-header {
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  gap: 16rpx;
}

.detail-icon-container {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--warm-shadow);
  flex-shrink: 0;
}

.detail-office-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.modal-building {
  width: 80%;
  height: 70%;
  background: var(--md-on-primary);
  border-radius: 2rpx 2rpx 0 0;
  margin: 15% auto 0;
}

.modal-flag {
  position: absolute;
  top: 5%;
  right: 10%;
  width: 8rpx;
  height: 16rpx;
  background: var(--md-on-primary);
  border-radius: 1rpx;
}

.detail-title-area {
  flex: 1;
}
    
    .detail-title {
  display: block;
      font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.detail-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
    }
    
    .detail-close {
  width: 48rpx;
  height: 48rpx;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: 0;
}

.detail-close:active {
  transform: scale(0.9);
  background: rgba(0, 0, 0, 0.1);
}

.close-icon {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 300;
}

.detail-body {
  max-height: calc(80vh - 120rpx);
    overflow-y: auto;
}

/* 地图区域 */
.detail-map-section {
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.map-container {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.map-placeholder {
  width: 100%;
  height: 300rpx;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
        display: flex;
  flex-direction: column;
        align-items: center;
        justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-placeholder:active {
  transform: scale(0.98);
}

.map-icon {
  position: relative;
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 16rpx;
}

.map-grid {
  width: 100%;
  height: 80%;
  border: 3rpx solid var(--accent-primary);
  border-radius: 4rpx;
  margin: 10% auto 0;
  background: rgba(255, 107, 53, 0.1);
}

.map-pin {
  position: absolute;
  top: 20%;
  right: 20%;
  width: 8rpx;
  height: 8rpx;
  background: var(--accent-primary);
  border-radius: 50%;
  box-shadow: 0 0 0 4rpx rgba(255, 107, 53, 0.3);
}

.map-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 详细信息 */
    .detail-info-section {
  padding: 32rpx;
}
      
.info-group {
  margin-bottom: 32rpx;
}
        
.info-group:last-child {
          margin-bottom: 0;
        }
        
.info-group-title {
  display: block;
          font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16rpx;
  padding-bottom: 8rpx;
  border-bottom: 2rpx solid rgba(255, 107, 53, 0.2);
}

.info-item {
  margin-bottom: 16rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
          display: block;
  font-size: 22rpx;
  color: var(--text-muted);
  margin-bottom: 8rpx;
  font-weight: 500;
}

.info-value {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.5;
}

.info-description {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.service-features {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.feature-dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: var(--accent-primary);
  flex-shrink: 0;
}

.feature-text {
  font-size: 22rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 详情操作按钮 */
    .detail-actions {
  padding: 32rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
      display: flex;
  gap: 16rpx;
}
      
      .detail-btn {
        flex: 1;
  border: none;
  border-radius: 28rpx;
  padding: 20rpx 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
  gap: 10rpx;
  transition: all 0.3s ease;
        margin: 0;
}

.detail-btn.secondary {
  background: rgba(255, 107, 53, 0.1);
  border: 1rpx solid var(--accent-primary);
}

.detail-btn.primary {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  box-shadow: var(--shadow-sm);
}

.detail-btn:active {
  transform: scale(0.98);
}

.detail-btn-icon {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-btn-text {
  font-size: 26rpx;
  font-weight: 600;
}

.detail-btn.secondary .detail-btn-text {
  color: var(--accent-primary);
}

.detail-btn.primary .detail-btn-text {
  color: var(--md-on-primary);
}

/* CSS绘制详情按钮图标 */
.detail-call-icon {
  .call-body {
    width: 16rpx;
    height: 16rpx;
    border: 2rpx solid var(--accent-primary);
    border-radius: 4rpx;
    position: relative;
  }
  
  .call-signal {
    position: absolute;
    top: -3rpx;
    right: -5rpx;
    width: 8rpx;
    height: 3rpx;
    border: 1rpx solid var(--accent-primary);
    border-radius: 2rpx;
    border-bottom: none;
  }
}

.detail-btn.primary .detail-call-icon {
  .call-body {
    border-color: var(--md-on-primary);
  }
  
  .call-signal {
    border-color: var(--md-on-primary);
  }
}

.detail-nav-icon {
  .nav-arrow {
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-bottom: 16rpx solid var(--accent-primary);
    transform: rotate(45deg);
  }
  
  .nav-path {
    position: absolute;
    bottom: 3rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 10rpx;
    height: 2rpx;
    background: var(--accent-primary);
  }
}

.detail-btn.primary .detail-nav-icon {
  .nav-arrow {
    border-bottom-color: var(--md-on-primary);
  }
  
  .nav-path {
    background: var(--md-on-primary);
  }
}

/* 动画定义 */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20rpx) rotate(180deg); }
}

@keyframes slide {
  0%, 100% { transform: translateX(0); opacity: 0.3; }
  50% { transform: translateX(20rpx); opacity: 1; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes slideInDown {
  from { transform: translateY(-30rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(30rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInScale {
  from { 
    transform: translateY(30rpx) scale(0.9); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
}
</style> 