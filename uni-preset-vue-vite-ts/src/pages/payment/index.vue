<template>
  <view class="payment-container">
    <!-- Material Design 温暖背景设计 -->
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

    <!-- 顶部区域 -->
    <view class="header">
      <view class="header-content">
        <view class="nav-back" @click="backToHome">
          <text class="back-icon">←</text>
          <text class="back-text">返回首页</text>
        </view>
        <text class="page-title">缴纳热费</text>
      </view>
    </view>
    
    <!-- 房产选择区域 -->
    <view class="property-selection" v-if="propertyList.length > 1">
      <view class="selection-header">
        <text class="selection-title">选择需要缴费的房产</text>
        <text class="select-all" @click="toggleSelectAll">{{isAllSelected ? '取消全选' : '全选'}}</text>
      </view>
      
      <view class="property-list">
        <view 
          class="property-item" 
          v-for="(property, index) in propertyList" 
          :key="index"
          @click="toggleSelect(index)"
        >
          <view class="checkbox" :class="{'checkbox-selected': property.selected}">
            <text v-if="property.selected" class="checkbox-inner">✓</text>
          </view>
          
          <view class="property-info">
            <text class="property-address">{{property.address}}</text>
            <text class="property-amount">¥{{property.amount}}</text>
          </view>
        </view>
      </view>
      
      <view class="selection-summary">
        <text class="summary-text">已选择 {{selectedCount}} 个房产，合计：</text>
        <text class="summary-amount">¥{{totalAmount}}</text>
      </view>
    </view>
    
    <!-- 单房产显示区域 -->
    <view class="payment-card" v-if="propertyList.length === 1 || isSingleMode">
      <view class="card-header">
        <text class="header-title">房产信息</text>
      </view>
      
      <view class="property-info">
        <text class="property-address">{{ currentProperty.address }}</text>
        <view class="info-row">
          <view class="info-item">
            <text class="info-label">面积</text>
            <text class="info-value">{{ currentProperty.area }}㎡</text>
          </view>
          <view class="info-item">
            <text class="info-label">用暖期间</text>
            <text class="info-value">{{ currentProperty.heatingPeriod }}</text>
          </view>
        </view>
      </view>
      
      <view class="fee-details">
        <view class="fee-header">
          <text class="fee-title">费用明细</text>
        </view>
        
        <view class="fee-row">
          <text class="fee-name">暖气费用</text>
          <text class="fee-value">¥{{ currentProperty.basicAmount }}</text>
        </view>
        
        <view class="fee-row">
          <text class="fee-name">服务费</text>
          <text class="fee-value">¥{{ currentProperty.serviceFee }}</text>
        </view>
        
        <view class="fee-divider"></view>
        
        <view class="fee-row total-row">
          <text class="fee-name">应付总额</text>
          <text class="fee-value total-value">¥{{ currentProperty.totalAmount }}</text>
        </view>
      </view>
    </view>
    
    <!-- 多房产付款汇总 -->
    <view class="payment-card" v-if="propertyList.length > 1 && !isSingleMode">
      <view class="card-header">
        <text class="header-title">费用明细</text>
      </view>
      
      <view class="fee-details">
        <view class="fee-row" v-for="(property, index) in selectedProperties" :key="index">
          <text class="fee-name">{{property.address}}</text>
          <text class="fee-value">¥{{property.amount}}</text>
        </view>
        
        <view class="fee-divider" v-if="selectedProperties.length > 0"></view>
        
        <view class="fee-row total-row" v-if="selectedProperties.length > 0">
          <text class="fee-name">应付总额</text>
          <text class="fee-value total-value">¥{{totalAmount}}</text>
        </view>
        
        <view class="empty-selection" v-if="selectedProperties.length === 0">
          <text class="empty-text">请至少选择一个待缴费房产</text>
        </view>
      </view>
    </view>
    
    <!-- 切换模式按钮 -->
    <view class="mode-switch" v-if="propertyList.length > 1">
      <text class="switch-text" @click="toggleMode">{{isSingleMode ? '批量缴费模式' : '详细信息模式'}}</text>
    </view>
    
    <!-- 支付方式 -->
    <view class="payment-methods">
      <view class="method-header">
        <text class="method-title">支付方式</text>
      </view>
      
      <view class="method-list">
        <view class="method-item" :class="{'method-selected': paymentMethod === 'wechat'}" @click="selectPaymentMethod('wechat')">
          <view class="method-icon-container">
            <image class="method-icon" src="/static/icon-wechat-pay.svg" mode="aspectFit"></image>
          </view>
          <text class="method-name">微信支付</text>
          <text v-if="paymentMethod === 'wechat'" class="method-selected-icon">✓</text>
        </view>
        
        <view class="method-item" :class="{'method-selected': paymentMethod === 'alipay'}" @click="selectPaymentMethod('alipay')">
          <view class="method-icon-container method-disabled">
            <image class="method-icon" src="/static/icon-alipay.svg" mode="aspectFit"></image>
          </view>
          <text class="method-name method-disabled">支付宝</text>
          <text v-if="paymentMethod === 'alipay'" class="method-selected-icon">✓</text>
        </view>
      </view>
    </view>
    
    <!-- 底部支付按钮 -->
    <view class="payment-action">
      <view class="total-amount">
        <text class="amount-label">实付金额：</text>
        <text class="amount-value">¥{{ totalAmount }}</text>
      </view>
      <button class="pay-button" :disabled="isPayButtonDisabled" :class="{'button-disabled': isPayButtonDisabled}" @click="handlePayment">立即支付</button>
    </view>
    
    <!-- 温馨提示 -->
    <view class="payment-tips">
      <text class="tips-title">温馨提示：</text>
      <text class="tips-content">1. 请确认房产信息无误后再进行支付</text>
      <text class="tips-content">2. 支付成功后系统将自动为您开具电子发票</text>
      <text class="tips-content">3. 如有疑问，请拨打客服热线：960577</text>
    </view>
    
    <!-- 支付确认弹窗 -->
    <view class="payment-modal" v-if="showModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">确认支付</text>
          <text class="modal-close" @click="cancelPayment">×</text>
        </view>
        <view class="modal-body">
          <text class="modal-amount">¥{{ totalAmount }}</text>
          <text class="modal-desc">使用微信支付缴纳暖气费用</text>
          <view class="modal-property-list" v-if="selectedProperties.length > 1">
            <text class="property-count">共{{selectedProperties.length}}个房产</text>
            <view class="property-item" v-for="(property, index) in selectedProperties" :key="index">
              <text class="property-name">{{property.address}}</text>
              <text class="property-amount">¥{{property.amount}}</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-cancel" @click="cancelPayment">取消</button>
          <button class="modal-confirm" @click="confirmPayment">确认支付</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';

// 支付方式
const paymentMethod = ref('wechat');
const showModal = ref(false);
const isSingleMode = ref(true);

// 获取页面传参
const query = ref<any>({});

// 模拟房产信息
const currentProperty = reactive({
  id: '',
  address: '龙域西城小区 3号楼2单元201',
  area: 120,
  heatingPeriod: '2025年1月1日-2025年3月31日',
  basicAmount: '1150.00',
  serviceFee: '50.00',
  totalAmount: '1200.00'
});

// 房产列表
const propertyList = ref<any[]>([]);

// 计算已选择的房产数量
const selectedCount = computed(() => {
  return propertyList.value.filter(item => item.selected).length;
});

// 计算已选择的房产
const selectedProperties = computed(() => {
  return propertyList.value.filter(item => item.selected);
});

// 计算总金额
const totalAmount = computed(() => {
  if (propertyList.value.length === 1 || isSingleMode.value) {
    return currentProperty.totalAmount;
  }
  
  let total = 0;
  propertyList.value.forEach(property => {
    if (property.selected) {
      total += parseFloat(property.amount);
    }
  });
  
  return total.toFixed(2);
});

// 是否全选
const isAllSelected = computed(() => {
  return propertyList.value.length > 0 && propertyList.value.every(item => item.selected);
});

// 禁用支付按钮条件
const isPayButtonDisabled = computed(() => {
  if (propertyList.value.length === 1 || isSingleMode.value) {
    return false;
  }
  
  return selectedCount.value === 0;
});

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // @ts-ignore
  query.value = currentPage.options;
  
  // 处理接收到的房产信息
  if (query.value.propertyIds) {
    const ids = query.value.propertyIds.split(',');
    const addresses = decodeURIComponent(query.value.propertyAddresses).split(',');
    const amounts = query.value.amounts.split(',');
    
    // 多房产处理
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        propertyList.value.push({
          id: ids[i],
          address: addresses[i] || '未知地址',
          amount: amounts[i] || '0.00',
          selected: true
        });
      }
      
      // 设置第一个房产作为当前展示房产
      if (propertyList.value.length > 0) {
        currentProperty.id = propertyList.value[0].id;
        currentProperty.address = propertyList.value[0].address;
        currentProperty.totalAmount = propertyList.value[0].amount;
        
        // 模拟计算基础金额和服务费
        currentProperty.basicAmount = (parseFloat(propertyList.value[0].amount) * 0.96).toFixed(2);
        currentProperty.serviceFee = (parseFloat(propertyList.value[0].amount) * 0.04).toFixed(2);
      }
      
      // 如果只有一个房产，默认单房产模式，否则批量缴费模式
      if (propertyList.value.length === 1) {
        isSingleMode.value = true;
      } else {
        isSingleMode.value = false;
      }
      
      // 如果是从房产页面批量缴费跳转过来的，自动设置为批量模式
      if (query.value.clear === 'true') {
        isSingleMode.value = false;
      }
    }
  } else {
    // 兼容旧版本的参数
    if (query.value.propertyId) {
      currentProperty.id = query.value.propertyId;
      propertyList.value.push({
        id: query.value.propertyId,
        address: currentProperty.address,
        amount: query.value.amount || currentProperty.totalAmount,
        selected: true
      });
    }
    
    if (query.value.amount) {
      currentProperty.totalAmount = query.value.amount;
      // 模拟计算基础金额和服务费
      currentProperty.basicAmount = (parseFloat(query.value.amount) * 0.96).toFixed(2);
      currentProperty.serviceFee = (parseFloat(query.value.amount) * 0.04).toFixed(2);
    }
  }
  
  console.log('缴费页面已加载');
});

// 选择/取消选择单个房产
const toggleSelect = (index: number) => {
  propertyList.value[index].selected = !propertyList.value[index].selected;
};

// 全选/取消全选
const toggleSelectAll = () => {
  const newState = !isAllSelected.value;
  propertyList.value.forEach(property => {
    property.selected = newState;
  });
};

// 切换模式
const toggleMode = () => {
  isSingleMode.value = !isSingleMode.value;
};

// 选择支付方式
const selectPaymentMethod = (method: string) => {
  if (method === 'alipay') {
    uni.showToast({
      title: '暂不支持支付宝支付',
      icon: 'none'
    });
    return;
  }
  paymentMethod.value = method;
};

// 返回首页
const backToHome = () => {
  uni.navigateBack({
    success: () => {
      console.log('返回上一页成功');
    },
    fail: () => {
      console.error('返回上一页失败，尝试重定向');
      uni.redirectTo({
        url: '/pages/index/index'
      });
    }
  });
};

// 处理支付
const handlePayment = () => {
  if (paymentMethod.value === 'wechat') {
    if ((propertyList.value.length > 1 && !isSingleMode.value && selectedCount.value === 0)) {
      uni.showToast({
        title: '请至少选择一个房产',
        icon: 'none'
      });
      return;
    }
    
    showModal.value = true;
  } else {
    uni.showToast({
      title: '请选择支付方式',
      icon: 'none'
    });
  }
};

// 取消支付
const cancelPayment = () => {
  showModal.value = false;
};

// 确认支付
const confirmPayment = () => {
  // 隐藏弹窗
  showModal.value = false;
  
  // 显示加载
  uni.showLoading({
    title: '支付处理中...'
  });
  
  // 模拟支付过程
  setTimeout(() => {
    uni.hideLoading();
    
    // 支付成功
    uni.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000
    });
    
    // 延迟跳转回房产页面
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/property/index'
      });
    }, 2000);
  }, 2000);
  
  // 真实环境中应调用微信支付API
  // 如: uni.requestPayment({...})
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

.payment-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
}

/* Material Design 温暖背景设计 */
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
  opacity: 0.95;
}

.elevation-overlay {
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

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20rpx) rotate(180deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

// 顶部区域样式
.header {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  padding: 180rpx 30rpx 30rpx;
  position: relative;
  z-index: 1;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .nav-back {
      display: flex;
      align-items: center;
      
      .back-icon {
        font-size: 36rpx;
        color: var(--text-primary);
        margin-right: 6rpx;
      }
      
      .back-text {
        font-size: 28rpx;
        color: var(--text-primary);
      }
    }
    
    .page-title {
      font-size: 36rpx;
      font-weight: bold;
      color: var(--text-primary);
      text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    }
  }
}

// 房产选择区域
.property-selection {
  margin: 30rpx;
  background: var(--warm-glass-bg);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  overflow: hidden;
  backdrop-filter: blur(20rpx);
  box-shadow: var(--warm-shadow);
  
      .selection-header {
      padding: 20rpx 30rpx;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .selection-title {
        font-size: 30rpx;
        font-weight: bold;
        color: var(--text-primary);
      }
      
      .select-all {
        font-size: 26rpx;
        color: var(--accent-primary);
      }
    }
  
  .property-list {
    padding: 20rpx 30rpx;
    
    .property-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .checkbox {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        border: 2rpx solid #ddd;
        margin-right: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.checkbox-selected {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
        }
        
        .checkbox-inner {
          color: #fff;
          font-size: 24rpx;
        }
      }
      
      .property-info {
        flex: 1;
        
        .property-address {
          font-size: 28rpx;
          color: var(--text-primary);
          margin-bottom: 10rpx;
          display: block;
        }
        
        .property-amount {
          font-size: 32rpx;
          color: var(--accent-primary);
          font-weight: bold;
        }
      }
    }
  }
  
  .selection-summary {
    padding: 20rpx 30rpx;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    .summary-text {
      font-size: 28rpx;
      color: var(--text-secondary);
    }
    
    .summary-amount {
      font-size: 36rpx;
      color: var(--accent-primary);
      font-weight: bold;
      margin-left: 10rpx;
    }
  }
}

// 模式切换按钮
.mode-switch {
  text-align: center;
  margin-bottom: 20rpx;
  
  .switch-text {
    display: inline-block;
    font-size: 26rpx;
    color: var(--accent-primary);
    padding: 10rpx 30rpx;
    background: var(--warm-glass-bg);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
    border-radius: 30rpx;
    backdrop-filter: blur(20rpx);
    box-shadow: var(--warm-shadow);
  }
}

// 付款信息卡片
.payment-card {
  margin: 30rpx;
  background: var(--warm-glass-bg);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  overflow: hidden;
  backdrop-filter: blur(20rpx);
  box-shadow: var(--warm-shadow);
  
  .card-header {
    padding: 20rpx 30rpx;
    background: rgba(255, 255, 255, 0.2);
    
    .header-title {
      font-size: 30rpx;
      font-weight: bold;
      color: var(--text-primary);
    }
  }
  
  .property-info {
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
    
    .property-address {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .info-row {
      display: flex;
      
      .info-item {
        flex: 1;
        
        .info-label {
          font-size: 26rpx;
          color: #999;
          margin-right: 10rpx;
        }
        
        .info-value {
          font-size: 26rpx;
          color: #333;
        }
      }
    }
  }
  
  .fee-details {
    padding: 30rpx;
    
    .fee-header {
      margin-bottom: 20rpx;
      
      .fee-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }
    }
    
    .fee-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16rpx;
      
      &.total-row {
        margin-top: 10rpx;
      }
      
      .fee-name {
        font-size: 28rpx;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
      }
      
      .fee-value {
        font-size: 28rpx;
        color: #333;
        
        &.total-value {
          font-size: 36rpx;
          font-weight: bold;
          color: #e73323;
        }
      }
    }
    
    .fee-divider {
      height: 1px;
      background-color: #f0f0f0;
      margin: 20rpx 0;
    }
    
    .empty-selection {
      padding: 40rpx 0;
      text-align: center;
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
}

// 支付方式
.payment-methods {
  margin: 0 30rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .method-header {
    padding: 20rpx 30rpx;
    background-color: #f9f9f9;
    
    .method-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .method-list {
    padding: 20rpx 30rpx;
    
    .method-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      position: relative;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.method-selected {
        background-color: #fff9f9;
      }
      
      .method-icon-container {
        width: 60rpx;
        height: 60rpx;
        margin-right: 20rpx;
        
        &.method-disabled {
          opacity: 0.5;
        }
        
        .method-icon {
          width: 100%;
          height: 100%;
        }
      }
      
      .method-name {
        font-size: 28rpx;
        color: #333;
        
        &.method-disabled {
          color: #999;
        }
      }
      
      .method-selected-icon {
        position: absolute;
        right: 20rpx;
        font-size: 40rpx;
        color: #e73323;
      }
    }
  }
}

// 底部支付按钮
.payment-action {
  display: flex;
  align-items: center;
  background: var(--warm-glass-bg);
  backdrop-filter: blur(20rpx);
  padding: 36rpx 30rpx 44rpx 30rpx;
  min-height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: var(--warm-shadow);
  
  .total-amount {
    flex: 1;
    
    .amount-label {
      font-size: 28rpx;
      color: var(--text-secondary);
    }
    
    .amount-value {
      font-size: 36rpx;
      font-weight: bold;
      color: var(--accent-primary);
    }
  }
  
  .pay-button {
    background: var(--primary-gradient);
    color: var(--md-on-primary);
    font-size: 32rpx;
    padding: 0 60rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    border: none;
    box-shadow: var(--warm-shadow);
    transition: all 0.3s ease;
    
    &.button-disabled {
      background: #e5e5e5;
      color: #999;
      border: 1rpx solid #ddd;
      box-shadow: none;
    }
  }
}

// 温馨提示
.payment-tips {
  margin: 30rpx;
  padding-bottom: 130rpx; // 为底部支付按钮留出空间
  
  .tips-title {
    font-size: 26rpx;
    color: #666;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .tips-content {
    font-size: 24rpx;
    color: #999;
    display: block;
    margin-bottom: 6rpx;
  }
}

// 支付确认弹窗
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-content {
    width: 80%;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    
    .modal-header {
      position: relative;
      padding: 30rpx;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
      
      .modal-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
      }
      
      .modal-close {
        position: absolute;
        right: 30rpx;
        top: 30rpx;
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .modal-body {
      padding: 40rpx 30rpx;
      text-align: center;
      
      .modal-amount {
        font-size: 48rpx;
        font-weight: bold;
        color: var(--accent-primary);
        display: block;
        margin-bottom: 20rpx;
      }
      
      .modal-desc {
        font-size: 28rpx;
        color: #666;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .modal-property-list {
        margin-top: 20rpx;
        text-align: left;
        max-height: 300rpx;
        overflow-y: auto;
        
        .property-count {
          font-size: 26rpx;
          color: #999;
          display: block;
          margin-bottom: 10rpx;
          text-align: center;
        }
        
        .property-item {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          padding: 10rpx 0;
          border-bottom: 1px dashed #eee;
          
          &:last-child {
            border-bottom: none;
          }
          
          .property-name {
            color: #666;
            max-width: 70%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .property-amount {
            color: var(--accent-primary);
            font-weight: bold;
          }
        }
      }
    }
    
    .modal-footer {
      display: flex;
      border-top: 1px solid #f0f0f0;
      
      .modal-cancel, .modal-confirm {
        flex: 1;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 32rpx;
        border: none;
        border-radius: 0;
      }
      
      .modal-cancel {
        background-color: #f5f5f5;
        color: #666;
      }
      
      .modal-confirm {
        background: var(--primary-gradient);
        color: var(--md-on-primary);
      }
    }
  }
}
</style> 