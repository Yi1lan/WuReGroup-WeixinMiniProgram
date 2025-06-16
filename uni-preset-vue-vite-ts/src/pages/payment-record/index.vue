<template>
  <view class="payment-record-container">
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
        <text class="page-title">缴费记录</text>
          <view class="nav-placeholder"></view>
      </view>
    </view>
    
      <!-- 缴费统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ totalRecords }}</text>
            <text class="stats-label">缴费次数</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">¥{{ totalAmount }}</text>
            <text class="stats-label">累计金额</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ currentYearRecords }}</text>
            <text class="stats-label">本年缴费</text>
          </view>
        </view>
      </view>

      <!-- 筛选区域 -->
    <view class="filter-section">
        <view class="filter-container">
          <button 
            class="filter-btn"
            :class="{ 'filter-active': showFilters }"
            @click="toggleFilters"
          >
            <view class="filter-icon">
              <view class="filter-lines"></view>
      </view>
            <text class="filter-text">筛选</text>
          </button>
          <button 
            class="filter-btn"
            @click="toggleYearPicker"
          >
            <text class="filter-text">{{ selectedYear || '全部年份' }}</text>
        <text class="filter-arrow">▼</text>
          </button>
          <button 
            class="filter-btn"
            @click="togglePropertyPicker"
          >
            <text class="filter-text">{{ selectedPropertyName || '全部房产' }}</text>
            <text class="filter-arrow">▼</text>
          </button>
      </view>
    </view>

      <!-- 缴费记录列表 -->
      <view class="records-section" v-if="filteredRecords.length > 0">
        <text class="section-title">缴费记录</text>
        <view class="record-list">
          <view 
            class="record-card"
            v-for="(record, index) in filteredRecords" 
            :key="record.id"
            @click="showRecordDetail(record)"
          >
            <!-- 状态标识 -->
            <view class="status-indicator">
              <view class="success-badge">
                <text class="status-text">已支付</text>
              </view>
            </view>

            <view class="card-content">
              <view class="card-header">
                <view class="record-info">
                  <text class="record-property">{{ getPropertyAddress(record.propertyId) }}</text>
                  <text class="record-period">{{ record.heatingPeriod }}</text>
                </view>
                <view class="record-date-container">
                  <view class="date-icon">
                    <view class="calendar-icon">
                      <view class="calendar-body"></view>
                      <view class="calendar-lines"></view>
                    </view>
                  </view>
                </view>
              </view>

              <view class="card-details">
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="payment-icon">
                        <view class="coin-icon">
                          <view class="coin-body"></view>
                          <view class="coin-symbol">¥</view>
                        </view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">缴费金额</text>
                      <text class="detail-value amount">¥{{ record.amount }}</text>
                    </view>
                  </view>
                </view>
                
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="method-icon">
                        <view class="payment-method-icon">
                          <view class="card-base"></view>
                          <view class="card-chip"></view>
                        </view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">支付方式</text>
                      <text class="detail-value">{{ record.paymentMethod }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="card-footer">
                <view class="payment-date">
                  <text class="date-text">{{ record.paymentDate }}</text>
                </view>
                <view class="action-buttons">
                  <button class="action-btn invoice-btn" @click.stop="viewInvoice(record)">
                    <view class="btn-icon">
                      <view class="document-icon">
                        <view class="doc-body"></view>
                        <view class="doc-lines"></view>
                      </view>
                    </view>
                    <text class="btn-text">发票</text>
                  </button>
                  <button class="action-btn detail-btn" @click.stop="showRecordDetail(record)">
                    <text class="btn-text">详情</text>
                    <text class="btn-arrow">→</text>
                  </button>
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
            <view class="receipt-icon">
              <view class="receipt-body"></view>
              <view class="receipt-header"></view>
              <view class="receipt-lines">
                <view class="receipt-line" v-for="n in 4" :key="n"></view>
              </view>
              <view class="receipt-tear"></view>
            </view>
          </view>
          <text class="empty-title">暂无缴费记录</text>
          <text class="empty-subtitle">{{ getEmptyMessage() }}</text>
          <button class="payment-btn" @click="goToPayment">
            <text class="payment-text">立即缴费</text>
          </button>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="footer-section">
        <view class="footer-card">
          <view class="footer-icon-container">
            <view class="help-icon">
              <view class="question-mark">?</view>
            </view>
          </view>
          <view class="footer-content">
            <text class="footer-title">需要帮助？</text>
            <text class="footer-subtitle">客服热线：960577</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 年份选择器 -->
    <view class="picker-mask" v-if="showYearPicker" @click="closeYearPicker"></view>
    <view class="picker-modal" v-if="showYearPicker">
      <view class="picker-header">
        <text class="picker-title">选择年份</text>
        <button class="picker-close-btn" @click="closeYearPicker">
          <text class="close-icon">×</text>
        </button>
      </view>
      <scroll-view class="picker-content" scroll-y="true">
      <view class="picker-options">
          <button class="picker-option" @click="selectYear('')">
            <text class="option-text">全部年份</text>
          <text class="option-check" v-if="selectedYear === ''">✓</text>
          </button>
          <button class="picker-option" v-for="year in availableYears" :key="year" @click="selectYear(year)">
          <text class="option-text">{{ year }}年</text>
          <text class="option-check" v-if="selectedYear === year">✓</text>
          </button>
        </view>
      </scroll-view>
    </view>
    
    <!-- 房产选择器 -->
    <view class="picker-mask" v-if="showPropertyPicker" @click="closePropertyPicker"></view>
    <view class="picker-modal" v-if="showPropertyPicker">
      <view class="picker-header">
        <text class="picker-title">选择房产</text>
        <button class="picker-close-btn" @click="closePropertyPicker">
          <text class="close-icon">×</text>
        </button>
      </view>
      <scroll-view class="picker-content" scroll-y="true">
      <view class="picker-options">
          <button class="picker-option" @click="selectProperty('')">
            <text class="option-text">全部房产</text>
          <text class="option-check" v-if="selectedProperty === ''">✓</text>
          </button>
          <button class="picker-option" v-for="property in properties" :key="property.id" @click="selectProperty(property.id)">
          <text class="option-text">{{ property.address }}</text>
          <text class="option-check" v-if="selectedProperty === property.id">✓</text>
          </button>
        </view>
      </scroll-view>
      </view>

    <!-- 缴费记录详情弹窗 -->
    <view class="detail-mask" v-if="showDetail" @click="closeDetail"></view>
    <view class="detail-modal" v-if="showDetail">
      <view class="modal-header">
        <view class="modal-title-container">
          <text class="modal-title">缴费详情</text>
          <view class="modal-badges">
            <view class="modal-status-badge">
              <text class="modal-status-text">{{ selectedRecord?.status }}</text>
            </view>
          </view>
        </view>
        <button class="modal-close-btn" @click="closeDetail">
          <text class="close-icon">×</text>
        </button>
    </view>
    
      <scroll-view class="modal-content" scroll-y="true">
        <view class="modal-info">
          <view class="modal-property-section">
            <view class="property-header">
              <view class="property-icon">
                <view class="building-icon">
                  <view class="building-body"></view>
                  <view class="building-windows"></view>
        </view>
        </view>
              <text class="property-title">房产信息</text>
          </view>
            <text class="property-address">{{ getPropertyAddress(selectedRecord?.propertyId) }}</text>
        </view>

          <view class="modal-divider"></view>

          <view class="modal-details-section">
            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="calendar-detail-icon">
                    <view class="calendar-body"></view>
                    <view class="calendar-lines"></view>
                  </view>
                </view>
                <text class="detail-label">供热期间</text>
              </view>
              <text class="detail-value">{{ selectedRecord?.heatingPeriod }}</text>
      </view>
      
            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="amount-detail-icon">
                    <view class="coin-body"></view>
                    <view class="coin-symbol">¥</view>
                  </view>
                </view>
                <text class="detail-label">缴费金额</text>
              </view>
              <text class="detail-value amount-text">¥{{ selectedRecord?.amount }}</text>
            </view>

            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="payment-detail-icon">
                    <view class="card-base"></view>
                    <view class="card-chip"></view>
                  </view>
                </view>
                <text class="detail-label">支付方式</text>
              </view>
              <text class="detail-value">{{ selectedRecord?.paymentMethod }}</text>
            </view>

            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="time-detail-icon">
                    <view class="clock-face"></view>
                    <view class="clock-hands"></view>
                  </view>
                </view>
                <text class="detail-label">缴费时间</text>
              </view>
              <text class="detail-value">{{ selectedRecord?.paymentDate }}</text>
            </view>

            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="invoice-detail-icon">
                    <view class="doc-body"></view>
                    <view class="doc-lines"></view>
                  </view>
                </view>
                <text class="detail-label">发票号码</text>
              </view>
              <text class="detail-value">{{ selectedRecord?.invoiceNo }}</text>
            </view>

            <view class="detail-row">
              <view class="detail-label-container">
                <view class="detail-icon">
                  <view class="transaction-detail-icon">
                    <view class="hash-lines">
                      <view class="hash-line" v-for="n in 3" :key="n"></view>
                    </view>
                  </view>
                </view>
                <text class="detail-label">交易单号</text>
              </view>
              <text class="detail-value">{{ selectedRecord?.transactionId }}</text>
            </view>
          </view>
      </view>
    </scroll-view>
      
      <view class="modal-footer">
        <button class="share-btn" @click="shareRecord">
          <view class="share-icon">
            <view class="share-circle"></view>
            <view class="share-arrow"></view>
          </view>
          <text class="share-text">分享记录</text>
        </button>
        <button class="close-btn" @click="closeDetail">
          <text class="close-text">关闭</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 模拟房产数据
const properties = ref([
  {
    id: '001',
    address: '龙域西城小区 3号楼2单元201',
  },
  {
    id: '002',
    address: '阳光花园小区 5号楼1单元102',
  },
  {
    id: '003',
    address: '明珠华府 8号楼3单元501',
  }
]);

// 模拟缴费记录数据 - 增强版本
const paymentRecords = ref([
  {
    id: 'p001',
    propertyId: '001',
    amount: '1200.00',
    paymentDate: '2024年12月15日',
    heatingPeriod: '2025年1月1日-2025年3月31日',
    status: '已支付',
    paymentMethod: '微信支付',
    invoiceNo: 'INV20241215001',
    transactionId: 'TXN20241215001'
  },
  {
    id: 'p002',
    propertyId: '002',
    amount: '890.00',
    paymentDate: '2024年12月10日',
    heatingPeriod: '2025年1月1日-2025年3月31日',
    status: '已支付',
    paymentMethod: '支付宝支付',
    invoiceNo: 'INV20241210001',
    transactionId: 'TXN20241210001'
  },
  {
    id: 'p003',
    propertyId: '003',
    amount: '1050.00',
    paymentDate: '2024年11月20日',
    heatingPeriod: '2025年1月1日-2025年3月31日',
    status: '已支付',
    paymentMethod: '微信支付',
    invoiceNo: 'INV20241120001',
    transactionId: 'TXN20241120001'
  },
  {
    id: 'p004',
    propertyId: '001',
    amount: '1150.00',
    paymentDate: '2023年12月15日',
    heatingPeriod: '2024年1月1日-2024年3月31日',
    status: '已支付',
    paymentMethod: '银行转账',
    invoiceNo: 'INV20231215001',
    transactionId: 'TXN20231215001'
  },
  {
    id: 'p005',
    propertyId: '002',
    amount: '820.00',
    paymentDate: '2023年11月30日',
    heatingPeriod: '2024年1月1日-2024年3月31日',
    status: '已支付',
    paymentMethod: '微信支付',
    invoiceNo: 'INV20231130001',
    transactionId: 'TXN20231130001'
  }
]);

// 筛选条件
const selectedYear = ref('');
const selectedProperty = ref('');
const showFilters = ref(false);

const selectedPropertyName = computed(() => {
  if (!selectedProperty.value) return '';
  const property = properties.value.find(p => p.id === selectedProperty.value);
  return property ? property.address : '';
});

// 统计数据
const totalRecords = computed(() => paymentRecords.value.length);

const totalAmount = computed(() => {
  return paymentRecords.value.reduce((sum, record) => {
    return sum + parseFloat(record.amount);
  }, 0).toFixed(2);
});

const currentYearRecords = computed(() => {
  const currentYear = new Date().getFullYear().toString();
  return paymentRecords.value.filter(record => {
    // 提取年份，支持"2024年12月15日"格式
    const yearMatch = record.paymentDate.match(/(\d{4})/);
    const recordYear = yearMatch ? yearMatch[1] : '';
    return recordYear === currentYear;
  }).length;
});

// 筛选选项
const availableYears = computed(() => {
  const years = new Set<string>();
  paymentRecords.value.forEach(record => {
    const year = record.paymentDate.substring(0, 4);
    years.add(year);
  });
  return Array.from(years).sort().reverse();
});

// 选择器状态
const showYearPicker = ref(false);
const showPropertyPicker = ref(false);

// 详情弹窗状态
const showDetail = ref(false);
const selectedRecord = ref(null);

// 根据筛选条件过滤记录
const filteredRecords = computed(() => {
  return paymentRecords.value.filter(record => {
    // 筛选年份
    if (selectedYear.value && !record.paymentDate.startsWith(selectedYear.value)) {
      return false;
    }
    
    // 筛选房产
    if (selectedProperty.value && record.propertyId !== selectedProperty.value) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // 按日期降序排列（最新的在前）
    return new Date(b.paymentDate.replace(/年|月|日/g, '')).getTime() - 
           new Date(a.paymentDate.replace(/年|月|日/g, '')).getTime();
  });
});

// 获取房产地址
const getPropertyAddress = (propertyId: string): string => {
  const property = properties.value.find(p => p.id === propertyId);
  return property ? property.address : '未知房产';
};

// 显示/隐藏年份选择器
const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value;
  showPropertyPicker.value = false;
};

const closeYearPicker = () => {
  showYearPicker.value = false;
};

const selectYear = (year: string) => {
  selectedYear.value = year;
  closeYearPicker();
};

// 显示/隐藏房产选择器
const togglePropertyPicker = () => {
  showPropertyPicker.value = !showPropertyPicker.value;
  showYearPicker.value = false;
};

const closePropertyPicker = () => {
  showPropertyPicker.value = false;
};

const selectProperty = (propertyId: string) => {
  selectedProperty.value = propertyId;
  closePropertyPicker();
};

// 查看缴费记录详情
const showRecordDetail = (record: any) => {
  selectedRecord.value = record;
  showDetail.value = true;
};

// 关闭详情弹窗
const closeDetail = () => {
  showDetail.value = false;
  selectedRecord.value = null;
};

// 分享记录
const shareRecord = () => {
  if (!selectedRecord.value) return;
  
  const shareContent = `${selectedRecord.value.status} - ${getPropertyAddress(selectedRecord.value.propertyId)}\n缴费金额：¥${selectedRecord.value.amount}\n缴费时间：${selectedRecord.value.paymentDate}`;
  
  uni.setClipboardData({
    data: shareContent,
    success: () => {
  uni.showToast({
        title: '记录已复制到剪贴板',
        icon: 'success'
      });
    }
  });
};

// 查看发票
const viewInvoice = (record: any) => {
  console.log('查看发票', record);
  uni.navigateTo({
    url: '/pages/electronic-invoice/index',
    success: () => {
      console.log('跳转到发票页面成功');
    },
    fail: (err) => {
      console.error('跳转到发票页面失败', err);
      uni.showToast({
        title: '跳转失败，请重试',
        icon: 'none'
      });
    }
  });
};

// 切换筛选器显示
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// 获取空状态信息
const getEmptyMessage = () => {
  if (selectedYear.value || selectedProperty.value) {
    return '当前筛选条件下暂无记录';
  }
  return '您还没有缴费记录，立即缴费享受温暖';
};

// 跳转到缴费页面
const goToPayment = () => {
  uni.navigateTo({
    url: '/pages/heat-payment/index'
  });
};

// 返回首页
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
  console.log('缴费记录页面已加载');
});
</script>

<style lang="scss">
// 页面级别背景设置
page {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
  overflow-x: hidden;
}

.payment-record-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
}

/* 现代化背景设计 */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
  overflow: hidden;
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  opacity: 0.95;
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  opacity: 0.95;
}

.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.pattern-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(10px);
}

.shape-1 {
  width: 350rpx;
  height: 350rpx;
  top: -175rpx;
  right: -175rpx;
  animation: float 18s ease-in-out infinite;
}

.shape-2 {
  width: 280rpx;
  height: 280rpx;
  bottom: -140rpx;
  left: -140rpx;
  animation: float 22s ease-in-out infinite reverse;
}

.pattern-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.line {
  position: absolute;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  height: 2rpx;
  animation: slide 8s ease-in-out infinite;
}

.line-1 {
  width: 200rpx;
  top: 30%;
  left: 10%;
  animation-delay: 0s;
}

.line-2 {
  width: 150rpx;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.line-3 {
  width: 180rpx;
  bottom: 25%;
  left: 50%;
  animation-delay: 4s;
}

.pattern-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.dot {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  animation: twinkle 3s ease-in-out infinite;
}

.dot:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
.dot:nth-child(2) { top: 25%; left: 70%; animation-delay: 0.5s; }
.dot:nth-child(3) { top: 40%; left: 35%; animation-delay: 1s; }
.dot:nth-child(4) { top: 55%; left: 15%; animation-delay: 1.5s; }
.dot:nth-child(5) { top: 70%; left: 80%; animation-delay: 2s; }
.dot:nth-child(6) { top: 85%; left: 45%; animation-delay: 2.5s; }
.dot:nth-child(7) { top: 20%; left: 50%; animation-delay: 3s; }
.dot:nth-child(8) { top: 35%; left: 85%; animation-delay: 3.5s; }
.dot:nth-child(9) { top: 65%; left: 25%; animation-delay: 4s; }
.dot:nth-child(10) { top: 80%; left: 65%; animation-delay: 4.5s; }
.dot:nth-child(11) { top: 10%; left: 75%; animation-delay: 5s; }
.dot:nth-child(12) { top: 90%; left: 30%; animation-delay: 5.5s; }

/* 内容区域 */
.content-area {
  height: 100vh;
  background: transparent;
}

/* 顶部导航 */
.header-section {
  padding: 180rpx 30rpx 30rpx;
  background: transparent;
}
  
.nav-container {
    display: flex;
    align-items: center;
  justify-content: space-between;
}
    
.nav-back-btn {
      display: flex;
      align-items: center;
  color: #222 !important;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.08);
}
      
      .back-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
  color: #222 !important;
}
      
      .back-text {
        font-size: 28rpx;
  color: #222 !important;
}
    
    .page-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #000000;
      margin: 0;
      text-align: center;
      flex: 1;
    }

.nav-placeholder {
  width: 120rpx;
}

/* 统计卡片 */
.statistics-section {
  padding: 0 30rpx 30rpx;
}

.stats-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.10);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stats-number {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--md-primary);
  line-height: 1.2;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 26rpx;
  color: var(--md-on-surface-variant);
  font-weight: 500;
}

.stats-divider {
  width: 2rpx;
  height: 60rpx;
  background: var(--md-outline-variant);
  margin: 0 20rpx;
}

/* 筛选区域 */
.filter-section {
  padding: 0 30rpx 30rpx;
}

.filter-container {
  display: flex;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 8rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.filter-btn {
  flex: 1;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  background: transparent;
  border: none;
    display: flex;
    align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 0.3s ease;
}

.filter-active {
  background: var(--md-primary) !important;
  box-shadow: 0 4rpx 12rpx rgba(255, 154, 86, 0.3);
}

.filter-icon {
  width: 20rpx;
  height: 20rpx;
  position: relative;
}

.filter-lines {
  position: absolute;
  width: 100%;
  height: 2rpx;
  background: currentColor;
}

.filter-lines::before,
.filter-lines::after {
  content: '';
  position: absolute;
  width: 70%;
  height: 2rpx;
  background: currentColor;
}

.filter-lines::before {
  top: -6rpx;
  left: 0;
}

.filter-lines::after {
  top: 6rpx;
  right: 0;
}

.filter-text {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.filter-active .filter-text {
  color: var(--md-on-primary);
  font-weight: 600;
    }
    
    .filter-arrow {
      font-size: 20rpx;
  color: var(--md-on-surface-variant);
  transition: transform 0.3s ease;
}

.filter-active .filter-arrow {
  color: var(--md-on-primary);
}

/* 缴费记录列表 */
.records-section {
  padding: 0 30rpx 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--md-on-primary);
  margin-bottom: 30rpx;
  display: block;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.record-card {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.10);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.record-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.16);
}

/* 状态标识 */
.status-indicator {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 2;
}

.success-badge {
  background: var(--success-green);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 600;
}

/* 卡片内容 */
.card-content {
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.record-info {
  flex: 1;
  margin-right: 20rpx;
}

.record-property {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--md-on-surface);
  line-height: 1.4;
  margin-bottom: 8rpx;
  display: block;
}

.record-period {
  font-size: 26rpx;
  color: var(--md-on-surface-variant);
  line-height: 1.3;
  display: block;
}

.record-date-container {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-icon {
  width: 48rpx;
  height: 48rpx;
  position: relative;
}

.calendar-icon {
  width: 100%;
  height: 100%;
  position: relative;
}

.calendar-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 8rpx;
  position: relative;
}

.calendar-lines {
  position: absolute;
  top: 12rpx;
  left: 8rpx;
  right: 8rpx;
  height: 2rpx;
  background: var(--md-on-primary);
}

.calendar-lines::after {
  content: '';
  position: absolute;
  top: 8rpx;
  left: 0;
  right: 0;
  height: 2rpx;
  background: var(--md-on-primary);
}

/* 详情信息 */
.card-details {
  margin-bottom: 24rpx;
}

.detail-row {
  margin-bottom: 16rpx;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-icon-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: var(--md-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

/* 支付图标 */
.payment-icon {
  width: 28rpx;
  height: 28rpx;
  position: relative;
}

.coin-icon {
  width: 100%;
  height: 100%;
  position: relative;
}

.coin-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-symbol {
  font-size: 16rpx;
  color: var(--md-on-primary);
  font-weight: 600;
}

/* 支付方式图标 */
.method-icon {
  width: 28rpx;
  height: 28rpx;
  position: relative;
}

.payment-method-icon {
  width: 100%;
  height: 100%;
  position: relative;
}

.card-base {
  width: 100%;
  height: 70%;
  background: var(--md-on-surface-variant);
  border-radius: 4rpx;
  position: absolute;
  bottom: 0;
}

.card-chip {
  width: 6rpx;
  height: 6rpx;
  background: var(--md-surface);
  border-radius: 2rpx;
  position: absolute;
  top: 8rpx;
  left: 6rpx;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 24rpx;
  color: var(--md-on-surface-variant);
  display: block;
  margin-bottom: 4rpx;
}

.detail-value {
  font-size: 28rpx;
  color: var(--md-on-surface);
  font-weight: 500;
  display: block;
}

.detail-value.amount {
  color: var(--md-primary);
  font-weight: 700;
  font-size: 32rpx;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-date {
  flex: 1;
}

.date-text {
  font-size: 24rpx;
  color: var(--md-on-surface-variant);
}

.action-buttons {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.invoice-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%) !important;
  color: #fff !important;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.3);
  border: 2rpx solid #ff6b35;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.action-btn.invoice-btn:active {
  background: linear-gradient(135deg, #ff8a50 0%, #ff6b35 100%) !important;
  box-shadow: 0 6rpx 16rpx rgba(255, 107, 53, 0.25);
}

.action-btn.detail-btn {
  background: #fff !important;
  color: #ff6b35 !important;
  border: 2rpx solid #ff6b35;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.10);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.action-btn.detail-btn:active {
  background: #ffe7d1 !important;
  color: #ff6b35 !important;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.18);
}

.btn-icon {
  width: 20rpx;
  height: 20rpx;
  position: relative;
}

.document-icon {
  width: 100%;
  height: 100%;
  position: relative;
}

.doc-body {
  width: 100%;
  height: 100%;
  background: currentColor;
  border-radius: 2rpx;
  position: relative;
}

.doc-lines {
  position: absolute;
  top: 6rpx;
  left: 4rpx;
  right: 4rpx;
  height: 1rpx;
  background: var(--md-surface);
}

.doc-lines::after {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 0;
  right: 0;
  height: 1rpx;
  background: var(--md-surface);
}

.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}

.btn-arrow {
  font-size: 20rpx;
}

/* 空状态 */
.empty-section {
  padding: 100rpx 30rpx;
  display: flex;
  justify-content: center;
}

.empty-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.10);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  padding: 60rpx 40rpx;
  text-align: center;
  max-width: 500rpx;
  width: 100%;
}

.empty-icon-container {
  margin-bottom: 30rpx;
  display: flex;
  justify-content: center;
}

.receipt-icon {
  width: 120rpx;
  height: 140rpx;
  position: relative;
}

.receipt-body {
  width: 100%;
  height: 100%;
  background: var(--md-outline);
  border-radius: 8rpx 8rpx 0 0;
  position: relative;
}

.receipt-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24rpx;
  background: var(--md-primary);
  border-radius: 8rpx 8rpx 0 0;
}

.receipt-lines {
  position: absolute;
  top: 36rpx;
  left: 16rpx;
  right: 16rpx;
  bottom: 24rpx;
}

.receipt-line {
  height: 2rpx;
  background: var(--md-surface);
  margin-bottom: 8rpx;
}

.receipt-line:nth-child(1) { width: 80%; }
.receipt-line:nth-child(2) { width: 60%; }
.receipt-line:nth-child(3) { width: 90%; }
.receipt-line:nth-child(4) { width: 40%; }

.receipt-tear {
  position: absolute;
  bottom: -8rpx;
  left: 0;
  right: 0;
  height: 8rpx;
  background: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 8rpx,
    var(--md-outline) 8rpx,
    var(--md-outline) 16rpx
  );
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--md-on-surface);
  margin-bottom: 16rpx;
  display: block;
}

.empty-subtitle {
  font-size: 28rpx;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
  margin-bottom: 40rpx;
  display: block;
}

.payment-btn {
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  border-radius: 25rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(255, 154, 86, 0.3);
  transition: all 0.3s ease;
}

.payment-btn:active {
  background: var(--warning-orange);
  transform: scale(0.95);
}

/* 底部提示 */
.footer-section {
  padding: 30rpx;
}

.footer-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.footer-icon-container {
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--md-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-mark {
  font-size: 24rpx;
  color: var(--md-on-primary);
  font-weight: 600;
}

.footer-content {
  flex: 1;
}

.footer-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--md-on-surface);
  margin-bottom: 6rpx;
  display: block;
}

.footer-subtitle {
  font-size: 26rpx;
  color: var(--md-primary);
  font-weight: 500;
  display: block;
}

/* 选择器弹窗 */
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.picker-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600rpx;
  height: 60%;
  max-height: 800rpx;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.18);
  border-radius: 24rpx;
  overflow: hidden;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}
  
  .picker-header {
  background: var(--md-primary);
  color: var(--md-on-primary);
  padding: 30rpx;
    display: flex;
    align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
    
    .picker-title {
      font-size: 32rpx;
  font-weight: 600;
}

.picker-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-primary);
}

.close-icon {
  font-size: 36rpx;
  font-weight: 300;
}

.picker-content {
  flex: 1;
  padding: 20rpx;
  }
  
  .picker-options {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
    
    .picker-option {
  background: transparent;
  border: none;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
      display: flex;
      align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}
      
.picker-option:active {
  background: var(--md-surface-variant);
      }
      
      .option-text {
        font-size: 28rpx;
  color: var(--md-on-surface);
  font-weight: 500;
      }
      
      .option-check {
        font-size: 32rpx;
  color: var(--md-primary);
  font-weight: 600;
}

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(180deg); }
}

@keyframes slide {
  0%, 100% { transform: translateX(-100%); opacity: 0; }
  50% { transform: translateX(0); opacity: 0.8; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 详情弹窗样式 */
.detail-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.detail-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 700rpx;
  height: 80vh;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.18);
  border-radius: 24rpx;
  overflow: hidden;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: var(--md-primary);
  color: var(--md-on-primary);
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 120rpx;
}

.modal-title-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--md-on-primary);
}

.modal-badges {
  display: flex;
  gap: 12rpx;
}

.modal-status-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 6rpx 12rpx;
}

.modal-status-text {
  font-size: 20rpx;
  font-weight: 500;
  color: var(--md-on-primary);
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-primary);
}

.modal-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  height: calc(80vh - 240rpx);
}

.modal-info {
  padding: 30rpx;
}

.modal-property-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 1px solid rgba(255, 154, 86, 0.2);
}

.property-header {
    display: flex;
    align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.property-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-icon {
  width: 32rpx;
  height: 32rpx;
  position: relative;
}

.building-body {
  width: 100%;
  height: 80%;
  background: var(--md-primary);
  border-radius: 4rpx 4rpx 2rpx 2rpx;
}

.building-windows {
  position: absolute;
  top: 20%;
  left: 20%;
  right: 20%;
  bottom: 30%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 4rpx,
    rgba(255, 255, 255, 0.8) 4rpx,
    rgba(255, 255, 255, 0.8) 6rpx
  ),
  repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 6rpx,
    rgba(255, 255, 255, 0.8) 6rpx,
    rgba(255, 255, 255, 0.8) 8rpx
  );
}

.property-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--md-on-surface);
}

.property-address {
      font-size: 26rpx;
  color: var(--md-on-surface-variant);
  line-height: 1.4;
    }

.modal-divider {
  height: 1rpx;
  background: var(--md-outline-variant);
  margin: 24rpx 0;
  }
  
.modal-details-section {
    display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.detail-row {
  display: flex;
  align-items: center;
    justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid rgba(255, 154, 86, 0.1);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label-container {
  display: flex;
    align-items: center;
  gap: 16rpx;
  flex: 1;
}

.detail-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 154, 86, 0.1);
  border-radius: 50%;
}

.calendar-detail-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.calendar-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 3rpx;
}

.calendar-lines {
  position: absolute;
  top: 30%;
  left: 20%;
  right: 20%;
  bottom: 20%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 3rpx,
    rgba(255, 255, 255, 0.8) 3rpx,
    rgba(255, 255, 255, 0.8) 4rpx
  );
}

.amount-detail-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.coin-body {
  width: 100%;
  height: 100%;
  background: var(--warning-orange);
  border-radius: 50%;
  border: 2rpx solid var(--md-primary);
}

.coin-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14rpx;
  font-weight: 600;
  color: white;
}

.payment-detail-icon {
  width: 24rpx;
  height: 16rpx;
  position: relative;
}

.card-base {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 2rpx;
}

.card-chip {
  position: absolute;
  top: 20%;
  left: 15%;
  width: 30%;
  height: 25%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rpx;
}

.time-detail-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.clock-face {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 50%;
  border: 2rpx solid var(--md-primary);
}

.clock-hands {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background: 
    linear-gradient(0deg, transparent 45%, white 45%, white 55%, transparent 55%),
    linear-gradient(90deg, transparent 45%, white 45%, white 55%, transparent 55%);
}

.invoice-detail-icon {
  width: 20rpx;
  height: 24rpx;
  position: relative;
}

.doc-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 2rpx 2rpx 2rpx 2rpx;
}

.doc-lines {
  position: absolute;
  top: 25%;
  left: 20%;
  right: 20%;
  bottom: 20%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 3rpx,
    rgba(255, 255, 255, 0.8) 3rpx,
    rgba(255, 255, 255, 0.8) 4rpx
  );
}

.transaction-detail-icon {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hash-lines {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.hash-line {
  height: 2rpx;
  background: var(--md-primary);
}

.hash-line:nth-child(1) { width: 16rpx; }
.hash-line:nth-child(2) { width: 12rpx; }
.hash-line:nth-child(3) { width: 20rpx; }

.detail-label {
  font-size: 26rpx;
  color: var(--md-on-surface-variant);
  font-weight: 500;
}

.detail-value {
  font-size: 26rpx;
  color: var(--md-on-surface);
  font-weight: 500;
  text-align: right;
  max-width: 300rpx;
  word-wrap: break-word;
}

.amount-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--md-primary);
}

.modal-footer {
  background: var(--md-surface);
  border-top: 1rpx solid var(--md-outline-variant);
  padding: 24rpx 30rpx;
  display: flex;
  gap: 20rpx;
  flex-shrink: 0;
  min-height: 120rpx;
}

.share-btn {
  flex: 1;
  background: rgba(255, 154, 86, 0.1);
  border: 1rpx solid var(--md-primary);
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  transition: all 0.3s ease;
}

.share-btn:active {
  background: rgba(255, 154, 86, 0.2);
  transform: scale(0.95);
}

.share-icon {
  width: 32rpx;
  height: 32rpx;
  position: relative;
}

.share-circle {
  width: 16rpx;
  height: 16rpx;
  background: var(--md-primary);
  border-radius: 50%;
  position: absolute;
  top: 8rpx;
  left: 8rpx;
}

.share-arrow {
  position: absolute;
  top: 12rpx;
  right: 4rpx;
  width: 0;
  height: 0;
  border-left: 6rpx solid var(--md-primary);
  border-top: 4rpx solid transparent;
  border-bottom: 4rpx solid transparent;
}

.share-text {
  font-size: 26rpx;
  color: var(--md-primary);
  font-weight: 500;
}

.close-btn {
  flex: 1;
  background: var(--md-primary);
  border: none;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  transition: all 0.3s ease;
}

.close-btn:active {
  background: var(--warning-orange);
  transform: scale(0.95);
}

.close-text {
  font-size: 26rpx;
  color: var(--md-on-primary);
  font-weight: 500;
}
</style> 