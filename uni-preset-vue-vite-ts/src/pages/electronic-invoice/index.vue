<template>
  <view class="electronic-invoice-container">
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
          <button class="nav-back-btn" @click="backToPrevious">
            <text class="back-icon">←</text>
          <text class="back-text">返回</text>
          </button>
          <text class="page-title">电子账单</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>
    
      <!-- 账单统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ totalInvoices }}</text>
            <text class="stats-label">账单总数</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">¥{{ totalAmount }}</text>
            <text class="stats-label">累计金额</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ currentYearInvoices }}</text>
            <text class="stats-label">本年账单</text>
          </view>
      </view>
    </view>
    
      <!-- 账单详情 -->
    <view class="invoice-detail" v-if="currentInvoice">
      <view class="invoice-card">
        <view class="invoice-header">
          <view class="invoice-title-area">
              <view class="company-info">
                <view class="company-icon">
                  <view class="building-icon">
                    <view class="building-body"></view>
                    <view class="building-windows"></view>
          </view>
                </view>
                <view class="company-text">
                  <text class="company-name">乌鲁木齐热力集团有限公司</text>
                  <text class="invoice-type">电子账单（普通发票）</text>
                </view>
              </view>
              <view class="invoice-status-badge">
                <text class="status-text">已开具</text>
              </view>
            </view>
        </view>
        
        <view class="invoice-divider"></view>
        
        <view class="invoice-content">
          <view class="invoice-row invoice-code-row">
            <text class="invoice-label">发票代码：</text>
            <text class="invoice-value">{{ currentInvoice.invoiceCode }}</text>
            <view class="invoice-status-badge" v-if="currentInvoice.status">
              <text class="status-text">{{ currentInvoice.status }}</text>
            </view>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">发票号码：</text>
            <text class="invoice-value">{{ currentInvoice.invoiceNo }}</text>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">开票日期：</text>
            <text class="invoice-value">{{ currentInvoice.issueDate }}</text>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">购买方名称：</text>
            <text class="invoice-value">{{ currentInvoice.buyerName }}</text>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">购买方税号：</text>
            <text class="invoice-value">{{ currentInvoice.buyerTaxNo || '—' }}</text>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">销售方名称：</text>
            <text class="invoice-value">乌鲁木齐热力集团有限公司</text>
          </view>
          <view class="invoice-row">
            <text class="invoice-label">销售方税号：</text>
            <text class="invoice-value">91650100299937166U</text>
          </view>
        </view>
        
        <view class="invoice-divider"></view>
        
        <view class="invoice-table">
          <view class="table-header">
            <text class="table-cell name">项目名称</text>
            <text class="table-cell unit">单位</text>
            <text class="table-cell price">单价</text>
            <text class="table-cell quantity">数量</text>
            <text class="table-cell amount">金额</text>
          </view>
          <view class="table-row">
            <text class="table-cell name">暖气费</text>
            <text class="table-cell unit">平方米</text>
            <text class="table-cell price">{{ currentInvoice.unitPrice }}</text>
            <text class="table-cell quantity">{{ currentInvoice.area }}</text>
            <text class="table-cell amount">{{ currentInvoice.amount }}</text>
          </view>
          <view class="table-footer">
            <text class="total-label">合计：</text>
            <text class="total-amount">¥{{ currentInvoice.amount }}</text>
          </view>
        </view>
        
        <view class="invoice-divider"></view>
        
        <view class="invoice-remark">
          <text class="remark-title">备注：</text>
          <text class="remark-content">{{ currentInvoice.remark || '暖气费' }}</text>
        </view>
        
        <view class="invoice-divider"></view>
        
        <view class="invoice-qrcode">
          <image class="qrcode-image" :src="currentInvoice.qrCodeUrl || '/static/qrcode-placeholder.png'" mode="aspectFit"></image>
          <text class="qrcode-hint">扫描二维码验证发票真伪</text>
        </view>
      </view>
      
      <view class="invoice-actions">
        <button class="action-btn download" @click="downloadInvoice">下载发票</button>
        <button class="action-btn share" @click="shareInvoice">分享发票</button>
      </view>
    </view>
    
      <!-- 筛选区域 -->
      <view class="filter-section" v-if="!currentInvoice">
        <view class="filter-container">
          <button 
            class="filter-btn"
            @click="toggleYearPicker"
          >
            <view class="filter-icon">
              <view class="calendar-filter-icon">
                <view class="calendar-body"></view>
                <view class="calendar-lines"></view>
              </view>
            </view>
            <text class="filter-text">{{ selectedYear || '全部年份' }}</text>
          <text class="filter-arrow">▼</text>
          </button>
          <button 
            class="filter-btn"
            @click="togglePropertyPicker"
          >
            <view class="filter-icon">
              <view class="building-filter-icon">
                <view class="building-body"></view>
                <view class="building-windows"></view>
        </view>
            </view>
            <text class="filter-text">{{ selectedPropertyName || '全部房产' }}</text>
          <text class="filter-arrow">▼</text>
          </button>
        </view>
      </view>

      <!-- 账单列表 -->
      <view class="invoices-section" v-if="!currentInvoice">
        <text class="section-title">电子账单</text>
        <view class="invoice-list" v-if="filteredInvoices.length > 0">
          <view 
            class="invoice-card"
            v-for="(invoice, index) in filteredInvoices" 
            :key="invoice.id"
            @click="viewInvoiceDetail(invoice)"
          >
            <!-- 状态标识 -->
            <view class="status-indicator">
              <view class="invoice-badge">
                <text class="status-text">{{ invoice.status }}</text>
              </view>
            </view>

            <view class="card-content">
              <view class="card-header">
                <view class="invoice-info">
                  <text class="invoice-property">{{ getPropertyAddress(invoice.propertyId) }}</text>
                  <text class="invoice-period">{{ invoice.heatingPeriod || '2024-2025供热季' }}</text>
                </view>
                <view class="invoice-date-container">
                  <view class="date-icon">
                    <view class="calendar-icon">
                      <view class="calendar-body"></view>
                      <view class="calendar-lines"></view>
                    </view>
                  </view>
                  <text class="invoice-date">{{ invoice.issueDate }}</text>
                </view>
              </view>

              <view class="card-details">
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="invoice-number-icon">
                        <view class="doc-body"></view>
                        <view class="doc-lines"></view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">发票号码</text>
                      <text class="detail-value">{{ invoice.invoiceNo }}</text>
                    </view>
                  </view>
                </view>
                
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="amount-icon">
                        <view class="coin-body"></view>
                        <view class="coin-symbol">¥</view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">开票金额</text>
                      <text class="detail-value amount">¥{{ invoice.amount }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="card-footer">
                <view class="invoice-type">
                  <text class="type-text">电子发票</text>
                </view>
                <view class="action-buttons">
                  <button class="action-btn download-btn" @click.stop="downloadInvoice(invoice)">
                    <view class="btn-icon">
                      <view class="download-icon">
                        <view class="download-arrow"></view>
                        <view class="download-line"></view>
                      </view>
                    </view>
                    <text class="btn-text">下载</text>
                  </button>
                  <button class="action-btn detail-btn" @click.stop="viewInvoiceDetail(invoice)">
                    <text class="btn-text">详情</text>
                    <text class="btn-arrow">→</text>
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 年份选择器 -->
      <view class="picker-mask" v-if="showYearPicker" @click="closeYearPicker"></view>
      <view class="picker-container" v-if="showYearPicker">
        <view class="picker-header">
          <text class="picker-title">选择年份</text>
          <text class="picker-close" @click="closeYearPicker">×</text>
        </view>
        <view class="picker-options">
          <view class="picker-option" @click="selectYear('')" :class="{selected: selectedYear === ''}">
            <text class="option-text">所有年份</text>
            <text class="option-check" v-if="selectedYear === ''">✓</text>
          </view>
          <view class="picker-option" v-for="year in availableYears" :key="year" @click="selectYear(year)" :class="{selected: selectedYear === year}">
            <text class="option-text">{{ year }}年</text>
            <text class="option-check" v-if="selectedYear === year">✓</text>
          </view>
        </view>
      </view>
      
      <!-- 房产选择器 -->
      <view class="picker-mask" v-if="showPropertyPicker" @click="closePropertyPicker"></view>
      <view class="picker-container" v-if="showPropertyPicker">
        <view class="picker-header">
          <text class="picker-title">选择房产</text>
          <text class="picker-close" @click="closePropertyPicker">×</text>
        </view>
        <view class="picker-options">
          <view class="picker-option" @click="selectProperty('')" :class="{selected: selectedProperty === ''}">
            <text class="option-text">所有房产</text>
            <text class="option-check" v-if="selectedProperty === ''">✓</text>
          </view>
          <view class="picker-option" v-for="property in properties" :key="property.id" @click="selectProperty(property.id)" :class="{selected: selectedProperty === property.id}">
            <text class="option-text">{{ property.address }}</text>
            <text class="option-check" v-if="selectedProperty === property.id">✓</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-section" v-if="!currentInvoice && filteredInvoices.length === 0">
        <view class="empty-card">
          <view class="empty-icon-container">
            <view class="invoice-empty-icon">
              <view class="invoice-body"></view>
              <view class="invoice-header"></view>
              <view class="invoice-lines">
                <view class="invoice-line" v-for="n in 4" :key="n"></view>
          </view>
              <view class="invoice-stamp"></view>
          </view>
          </view>
          <text class="empty-title">暂无电子账单</text>
          <text class="empty-subtitle">{{ getEmptyMessage() }}</text>
          <button class="view-payment-btn" @click="goToPayment">
            <text class="payment-text">查看缴费记录</text>
          </button>
        </view>
        </view>
      </scroll-view>
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

// 模拟发票数据
const invoices = ref([
  {
    id: 'inv001',
    propertyId: '001',
    invoiceNo: 'INV20241215001',
    invoiceCode: '123456789012',
    amount: '1200.00',
    issueDate: '2024年12月15日',
    status: '已开票',
    buyerName: '张三',
    buyerTaxNo: '',
    unitPrice: '26.00',
    area: '46.15',
    remark: '2025年1月1日-2025年3月31日暖气费',
    qrCodeUrl: ''
  },
  {
    id: 'inv002',
    propertyId: '002',
    invoiceNo: 'INV20241210001',
    invoiceCode: '123456789013',
    amount: '890.00',
    issueDate: '2024年12月10日',
    status: '已开票',
    buyerName: '李四',
    buyerTaxNo: '',
    unitPrice: '26.00',
    area: '34.23',
    remark: '2025年1月1日-2025年3月31日暖气费',
    qrCodeUrl: ''
  },
  {
    id: 'inv003',
    propertyId: '003',
    invoiceNo: 'INV20231220001',
    invoiceCode: '123456789014',
    amount: '1050.00',
    issueDate: '2023年12月20日',
    status: '已开票',
    buyerName: '王五',
    buyerTaxNo: '',
    unitPrice: '26.00',
    area: '40.38',
    remark: '2024年1月1日-2024年3月31日暖气费',
    qrCodeUrl: ''
  },
  {
    id: 'inv004',
    propertyId: '001',
    invoiceNo: 'INV20231215001',
    invoiceCode: '123456789015',
    amount: '1150.00',
    issueDate: '2023年12月15日',
    status: '已开票',
    buyerName: '张三',
    buyerTaxNo: '',
    unitPrice: '26.00',
    area: '44.23',
    remark: '2024年1月1日-2024年3月31日暖气费',
    qrCodeUrl: ''
  }
]);

// 当前查看的发票
const currentInvoice = ref(null);

// 筛选条件
const selectedYear = ref('');
const selectedProperty = ref('');
const selectedPropertyName = computed(() => {
  if (!selectedProperty.value) return '';
  const property = properties.value.find(p => p.id === selectedProperty.value);
  return property ? property.address : '';
});

// 筛选选项
const availableYears = computed(() => {
  const years = new Set<string>();
  invoices.value.forEach(invoice => {
    const year = invoice.issueDate.substring(0, 4);
    years.add(year);
  });
  return Array.from(years).sort().reverse();
});

// 选择器状态
const showYearPicker = ref(false);
const showPropertyPicker = ref(false);

// 统计数据
const totalInvoices = computed(() => invoices.value.length);

const totalAmount = computed(() => {
  return invoices.value.reduce((sum, invoice) => {
    return sum + parseFloat(invoice.amount);
  }, 0).toFixed(2);
});

const currentYearInvoices = computed(() => {
  const currentYear = new Date().getFullYear().toString();
  return invoices.value.filter(invoice => {
    const yearMatch = invoice.issueDate.match(/(\d{4})/);
    const invoiceYear = yearMatch ? yearMatch[1] : '';
    return invoiceYear === currentYear;
  }).length;
});

// 根据筛选条件过滤发票
const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    // 筛选年份
    if (selectedYear.value && !invoice.issueDate.startsWith(selectedYear.value)) {
      return false;
    }
    
    // 筛选房产
    if (selectedProperty.value && invoice.propertyId !== selectedProperty.value) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // 按日期降序排列（最新的在前）
    return new Date(b.issueDate.replace(/年|月|日/g, '')).getTime() - 
           new Date(a.issueDate.replace(/年|月|日/g, '')).getTime();
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

// 查看发票详情
const viewInvoiceDetail = (invoice: any) => {
  currentInvoice.value = invoice;
};

// 返回发票列表
const backToPrevious = () => {
  if (currentInvoice.value) {
    currentInvoice.value = null;
  } else {
    uni.navigateBack({
      success: () => {
        console.log('返回成功');
      },
      fail: () => {
        uni.redirectTo({
          url: '/pages/payment-record/index'
        });
      }
    });
  }
};

// 下载发票（支持通用和特定发票）
const downloadInvoice = (invoice: any = null) => {
  const targetInvoice = invoice || currentInvoice.value;
  if (!targetInvoice) {
    uni.showToast({
      title: '请选择要下载的发票',
      icon: 'none'
    });
    return;
  }
  
  console.log('下载发票', targetInvoice);
  uni.showToast({
    title: '发票下载中...',
    icon: 'loading',
    duration: 2000
  });
  
  setTimeout(() => {
    uni.showToast({
      title: '发票已保存到相册',
      icon: 'success'
    });
  }, 2000);
};

// 获取空状态信息
const getEmptyMessage = () => {
  if (selectedYear.value && selectedProperty.value) {
    return `${selectedYear.value}年该房产暂无账单`;
  } else if (selectedYear.value) {
    return `${selectedYear.value}年暂无账单记录`;
  } else if (selectedProperty.value) {
    return '该房产暂无账单记录';
  }
  return '暂无账单记录，请先完成缴费';
};

// 跳转到缴费页面
const goToPayment = () => {
  uni.navigateTo({
    url: '/pages/payment-record/index'
  });
};

// 分享发票
const shareInvoice = () => {
  if (!currentInvoice.value) return;
  
  const shareContent = `电子发票 - ${getPropertyAddress(currentInvoice.value.propertyId)}\n发票号码：${currentInvoice.value.invoiceNo}\n开票金额：¥${currentInvoice.value.amount}`;
  
  uni.setClipboardData({
    data: shareContent,
    success: () => {
      uni.showToast({
        title: '发票信息已复制到剪贴板',
        icon: 'success'
      });
    }
  });
};

onMounted(() => {
  console.log('电子发票页面已加载');
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
.electronic-invoice-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--warm-gradient);
  z-index: -10;
}

.electronic-invoice-container {
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
  left: 5%;
  width: 90%;
  height: 40%;
}

.line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  animation: slide 6s ease-in-out infinite;
}

.line-1 {
  width: 100rpx;
  height: 2rpx;
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.line-2 {
  width: 150rpx;
  height: 2rpx;
  top: 50%;
  right: 0;
  animation-delay: 2s;
}

.line-3 {
  width: 80rpx;
  height: 2rpx;
  bottom: 0;
  left: 30%;
  animation-delay: 4s;
}

.pattern-dots {
  position: absolute;
  top: 20%;
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
  animation: twinkle 3s ease-in-out infinite;
}

.dot:nth-child(odd) {
  animation-delay: 0.5s;
}

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20rpx) rotate(180deg); }
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

/* 顶部导航区域 */
.content-area {
  height: 100vh;
  background: transparent;
}

.header-section {
  padding: 180rpx 30rpx 30rpx;
  background: transparent;
}

.nav-container {
    display: flex;
    align-items: center;
  justify-content: space-between;
  height: 88rpx;
}
    
.nav-back-btn {
      display: flex;
      align-items: center;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 44rpx;
  padding: 12rpx 24rpx;
  transition: all 0.3s ease;
}

.nav-back-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}
      
      .back-icon {
  font-size: 32rpx;
  color: #222 !important;
  margin-right: 8rpx;
  font-weight: 300;
      }
      
      .back-text {
        font-size: 28rpx;
  color: #222 !important;
  font-weight: 500;
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
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stats-item {
  text-align: center;
  flex: 1;
}

.stats-number {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: var(--md-primary);
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.stats-divider {
  width: 1rpx;
  height: 60rpx;
  background: var(--md-outline-variant);
  margin: 0 20rpx;
}

/* 筛选区域 */
.filter-section {
  padding: 0 30rpx 20rpx;
}

.filter-container {
  display: flex;
  gap: 20rpx;
}

.filter-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: var(--md-corner-radius-large);
  padding: 20rpx;
    display: flex;
    align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  box-shadow: var(--md-elevation-1);
}

.filter-btn:active {
  background: rgba(255, 255, 255, 1);
  transform: scale(0.98);
  box-shadow: var(--md-elevation-2);
}

.filter-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-filter-icon,
.building-filter-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.calendar-body,
.building-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 3rpx;
}

.calendar-lines,
.building-windows {
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

.filter-text {
  flex: 1;
  font-size: 26rpx;
  color: var(--md-on-surface);
  font-weight: 500;
    }
    
    .filter-arrow {
      font-size: 20rpx;
  color: var(--md-on-surface-variant);
}

/* 列表区域 */
.invoices-section {
  padding: 0 30rpx 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  margin-bottom: 20rpx;
  display: block;
}

.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 发票卡片设计 */
.invoice-card {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.10);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  padding: 0 0 32rpx 0;
}

.invoice-card:active {
  transform: scale(0.98);
}

.status-indicator {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 2;
}

.invoice-badge {
  background: var(--md-primary);
  border-radius: 12rpx;
  padding: 6rpx 12rpx;
}

.status-text {
  font-size: 20rpx;
  color: white;
  font-weight: 500;
}

.card-content {
  padding: 32rpx 32rpx 0 32rpx;
  background: #fff;
  border-radius: 0 0 16rpx 16rpx;
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.invoice-info {
  flex: 1;
  margin-right: 60rpx;
}

.invoice-property {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--md-on-surface);
  margin-bottom: 6rpx;
  line-height: 1.3;
  display: block;
}

.invoice-period {
  font-size: 24rpx;
  color: var(--md-on-surface-variant);
  display: block;
}

.invoice-date-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.date-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.calendar-icon {
  position: relative;
  width: 16rpx;
  height: 14rpx;
  background: var(--accent-primary);
  border-radius: 1rpx;
  display: flex;
  flex-direction: column;
}

.invoice-date {
  font-size: 22rpx;
  color: var(--md-on-surface-variant);
  text-align: center;
}

.card-details {
  margin: 20rpx 0;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.detail-row:last-child {
  margin-bottom: 0;
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

.invoice-number-icon,
.amount-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-body {
  width: 16rpx;
  height: 20rpx;
  background: var(--accent-primary);
  border-radius: 2rpx;
  position: relative;
}

.doc-body::before {
  content: "";
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  width: 6rpx;
  height: 6rpx;
  background: var(--accent-primary);
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
}

.doc-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10rpx;
  height: 8rpx;
}

.doc-lines::before,
.doc-lines::after {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 1rpx;
  background: #fff;
}

.doc-lines::before {
  top: 2rpx;
}

.doc-lines::after {
  bottom: 2rpx;
}

.coin-body {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: var(--accent-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.coin-symbol {
  font-size: 12rpx;
  font-weight: 700;
  color: #fff;
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

.detail-value.amount {
  color: var(--accent-primary);
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

.invoice-type {
  flex: 1;
}

.type-text {
  font-size: 24rpx;
  color: var(--text-muted);
  font-weight: 500;
  padding: 6rpx 12rpx;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12rpx;
}

.action-buttons {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1rpx solid transparent;
}

.action-btn.download-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%) !important;
  color: #fff !important;
  box-shadow: 0 12rpx 32rpx rgba(255, 138, 80, 0.3);
  border: 2rpx solid #ff6b35;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.action-btn.download-btn:active {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-icon {
  position: relative;
  width: 16rpx;
  height: 16rpx;
}

.download-arrow {
  width: 0;
  height: 0;
  border-left: 4rpx solid transparent;
  border-right: 4rpx solid transparent;
  border-top: 6rpx solid currentColor;
  position: absolute;
  top: 2rpx;
  left: 50%;
  transform: translateX(-50%);
}

.download-line {
  width: 12rpx;
  height: 2rpx;
  background: currentColor;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}

.btn-arrow {
  font-size: 20rpx;
  font-weight: 600;
}

/* 选择器样式 */
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  backdrop-filter: blur(4rpx);
}

.picker-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  z-index: 1001;
  animation: slideInUp 0.3s ease-out;
  max-height: 60vh;
  overflow: hidden;
}
  
  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  padding: 24rpx 40rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
}
    
    .picker-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
    }
    
    .picker-close {
      font-size: 40rpx;
  color: var(--text-muted);
  font-weight: 300;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  }
  
  .picker-options {
  max-height: 400rpx;
    overflow-y: auto;
}
    
    .picker-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
  padding: 24rpx 40rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  transition: background 0.2s ease;
  background: #fff !important;
  border: 1px solid #f0f0f0;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.picker-option:active,
.picker-option.selected {
  background: #fff6ed !important;
  border-color: #ffb88c;
}
      
      .option-text {
        font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
      }
      
      .option-check {
  font-size: 24rpx;
  color: var(--accent-primary);
  font-weight: 600;
}

/* 空状态 */
.empty-section {
  padding: 80rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.5s both;
}

.empty-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 240, 0.8) 100%);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
}

.empty-icon-container {
  margin-bottom: 32rpx;
  display: flex;
  justify-content: center;
}

.invoice-empty-icon {
  position: relative;
  width: 120rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.invoice-body {
  width: 100%;
  height: 120rpx;
  background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%);
  border-radius: 8rpx;
  position: relative;
  margin-bottom: 8rpx;
}

.invoice-header {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  padding: 32rpx;
  color: var(--md-on-primary);
  border-radius: 24rpx 24rpx 0 0;
}

.invoice-title-area {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.company-text {
  flex: 1;
  min-width: 0;
}

.company-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 2rpx;
  color: var(--md-on-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.invoice-type {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.invoice-status-badge {
  align-self: flex-end;
  margin-top: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
  max-width: 120rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-text {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--md-on-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.invoice-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1px solid #f5e0c8;
  gap: 12rpx;
}

.invoice-label {
  min-width: 140rpx;
  color: #888;
  font-size: 26rpx;
  font-weight: 500;
  flex-shrink: 0;
}

.invoice-value {
  flex: 1;
  color: #222;
  font-size: 26rpx;
  font-weight: 600;
  word-break: break-all;
  min-width: 0;
}

.invoice-row.invoice-code-row {
  align-items: flex-start;
}

.invoice-row.invoice-code-row .invoice-value {
  flex: none;
  max-width: 60%;
  min-width: 0;
}

.invoice-row.invoice-code-row .invoice-status-badge {
  margin-left: auto;
  align-self: center;
  max-width: 120rpx;
}

.invoice-divider {
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  margin: 0 32rpx;
}
  
  .invoice-table {
  margin: 0 32rpx 0 32rpx;
  border-radius: 12rpx;
  background: #fff8f0;
  box-shadow: 0 2rpx 8rpx rgba(255, 167, 38, 0.06);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 16rpx;
  padding: 16rpx 0;
  align-items: center;
}

.table-header {
  border-bottom: 2rpx solid var(--accent-primary);
    }
    
    .table-row {
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}
      
      .table-cell {
  font-size: 24rpx;
        text-align: center;
}

.table-header .table-cell {
  font-weight: 600;
  color: var(--accent-primary);
}

.table-row .table-cell {
  font-weight: 500;
  color: var(--text-primary);
}

.table-cell.name {
  text-align: left;
    }
    
    .table-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
  gap: 20rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid var(--accent-primary);
}
      
      .total-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
      }
      
      .total-amount {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--accent-primary);
  }
  
  .invoice-remark {
  margin: 0 32rpx 0 32rpx;
  border-radius: 12rpx;
  background: #fff8f0;
  padding: 24rpx;
}
    
    .remark-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
  display: block;
    }
    
    .remark-content {
  font-size: 26rpx;
  color: var(--text-primary);
  line-height: 1.6;
  }
  
  .invoice-qrcode {
  margin: 0 32rpx 0 32rpx;
  border-radius: 12rpx;
  background: #fff8f0;
  padding: 24rpx 0 0 0;
}
    
    .qrcode-image {
      width: 200rpx;
      height: 200rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  margin: 0 auto 16rpx;
  display: block;
    }
    
    .qrcode-hint {
      font-size: 24rpx;
  color: var(--text-muted);
  font-weight: 500;
}

.invoice-actions {
  padding: 32rpx;
  display: flex;
  gap: 20rpx;
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}
  
  .action-btn {
    flex: 1;
  padding: 20rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  border: 1rpx solid transparent;
}

.action-btn.download {
  background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%);
  color: var(--md-on-primary);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.4);
}

.action-btn.share {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: var(--shadow-sm);
}

.action-btn:active {
  transform: scale(0.95);
}

/* 动画定义 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20rpx) rotate(5deg);
  }
}

@keyframes slide {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateX(20rpx);
    opacity: 0.8;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style> 