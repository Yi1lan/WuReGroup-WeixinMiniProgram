<template>
  <view class="service-guide-container">
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
        <text class="page-title">办事指南</text>
          <view class="nav-placeholder"></view>
      </view>
    </view>
    
      <!-- 服务统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ serviceCategories.length }}</text>
            <text class="stats-label">服务类型</text>
      </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">24</text>
            <text class="stats-label">小时服务</text>
      </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">960577</text>
            <text class="stats-label">服务热线</text>
      </view>
        </view>
      </view>

      <!-- 服务分类卡片 -->
      <view class="categories-section">
        <text class="section-title">服务指南</text>
        <view class="category-grid">
      <view 
            class="category-card"
            v-for="(category, index) in serviceCategories" 
            :key="category.id"
            @click="selectCategory(category.id)"
          >
            <view class="category-icon-container">
              <view class="category-icon" :class="category.iconClass">
                <view class="icon-shape"></view>
                <view class="icon-details"></view>
              </view>
            </view>
            <view class="category-content">
              <text class="category-title">{{ category.title }}</text>
              <text class="category-subtitle">{{ category.subtitle }}</text>
            </view>
            <view class="category-arrow">
              <text class="arrow-icon">→</text>
            </view>
          </view>
      </view>
    </view>
    
      <!-- 详细内容区域 -->
      <view class="guide-content-section" v-if="selectedCategory">
      <!-- 新用户报装 -->
        <view v-if="selectedCategory === 'newConnect'">
          <view class="content-header">
            <view class="header-icon-container">
              <view class="connect-icon">
                <view class="pipe-main"></view>
                <view class="pipe-branch"></view>
                <view class="pipe-valve"></view>
        </view>
            </view>
            <view class="header-text">
              <text class="content-title">新用户供热报装</text>
              <text class="content-subtitle">一站式服务，轻松接入供热系统</text>
            </view>
          </view>
          
          <!-- 流程步骤 -->
          <view class="process-section">
            <text class="process-title">办理流程</text>
            <view class="process-timeline">
              <view 
                class="process-step"
                v-for="(step, index) in newConnectSteps" 
                :key="index"
              >
                <view class="step-indicator">
                  <view class="step-number">{{ index + 1 }}</view>
                  <view class="step-line" v-if="index < newConnectSteps.length - 1"></view>
                </view>
            <view class="step-content">
                  <view class="step-header">
                    <text class="step-title">{{ step.title }}</text>
                    <view class="step-time">
                      <text class="time-text">{{ step.time }}</text>
            </view>
          </view>
                  <text class="step-description">{{ step.description }}</text>
            </view>
          </view>
            </view>
          </view>
          
          <!-- 所需材料 -->
          <view class="materials-section">
            <text class="materials-title">所需材料</text>
            <view class="materials-list">
              <view 
                class="material-item"
                v-for="(material, index) in requiredMaterials" 
                :key="index"
              >
                <view class="material-icon">
                  <view class="document-icon">
                    <view class="doc-body"></view>
                    <view class="doc-corner"></view>
            </view>
          </view>
                <text class="material-name">{{ material }}</text>
        </view>
            </view>
        </view>
        
          <!-- 温馨提示 -->
          <view class="tips-section">
            <view class="tips-header">
              <view class="tips-icon">
                <view class="bulb-icon">
                  <view class="bulb-body"></view>
                  <view class="bulb-light"></view>
          </view>
          </view>
              <text class="tips-title">温馨提示</text>
          </view>
            <view class="tips-list">
              <text 
                class="tip-item"
                v-for="(tip, index) in newConnectTips" 
                :key="index"
              >{{ tip }}</text>
          </view>
        </view>
      </view>
      
      <!-- 缴费指南 -->
        <view v-if="selectedCategory === 'paymentGuide'">
          <view class="content-header">
            <view class="header-icon-container">
              <view class="payment-icon">
                <view class="coin-body"></view>
                <view class="coin-symbol">¥</view>
        </view>
            </view>
            <view class="header-text">
              <text class="content-title">热费缴纳指南</text>
              <text class="content-subtitle">多种缴费方式，便民又贴心</text>
            </view>
          </view>
          
          <!-- 缴费方式 -->
          <view class="payment-methods-section">
            <text class="methods-title">缴费方式</text>
            <view class="methods-list">
              <view 
                class="method-card"
                v-for="(method, index) in paymentMethods" 
                :key="index"
              >
            <view class="method-icon-container">
                  <view class="method-icon" :class="method.iconClass">
                    <view class="icon-main"></view>
                    <view class="icon-accent"></view>
            </view>
            </view>
                <view class="method-content">
                  <text class="method-name">{{ method.name }}</text>
                  <text class="method-description">{{ method.description }}</text>
          </view>
                <view class="method-badge">
                  <text class="badge-text">{{ method.badge }}</text>
            </view>
            </view>
          </view>
        </view>
        
          <!-- 常见问题 -->
          <view class="faq-section">
            <text class="faq-title">常见问题</text>
            <view class="faq-list">
              <view 
                class="faq-item"
                v-for="(faq, index) in faqs" 
                :key="index"
                @click="toggleFaq(index)"
              >
            <view class="faq-question">
                  <view class="question-icon">
                    <text class="q-mark">Q</text>
            </view>
                  <text class="question-text">{{ faq.question }}</text>
                  <view class="question-arrow" :class="{ 'expanded': expandedFaq === index }">
                    <text class="arrow">▼</text>
          </view>
            </view>
                <view class="faq-answer" v-if="expandedFaq === index">
                  <text class="answer-text">{{ faq.answer }}</text>
          </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 报修流程 -->
        <view v-if="selectedCategory === 'repair'">
          <view class="content-header">
            <view class="header-icon-container">
              <view class="repair-icon">
                <view class="tool-handle"></view>
                <view class="tool-head"></view>
                <view class="repair-spark"></view>
        </view>
            </view>
            <view class="header-text">
              <text class="content-title">供热报修服务</text>
              <text class="content-subtitle">24小时响应，专业维修服务</text>
            </view>
          </view>
          
          <!-- 服务承诺 -->
          <view class="service-promise-section">
            <text class="promise-title">服务承诺</text>
            <view class="promise-grid">
              <view 
                class="promise-item"
                v-for="(promise, index) in servicePromises" 
                :key="index"
              >
                <view class="promise-icon">
                  <view class="clock-icon" v-if="promise.type === 'time'">
                    <view class="clock-face"></view>
                    <view class="clock-hand"></view>
            </view>
                  <view class="phone-icon" v-if="promise.type === 'phone'">
                    <view class="phone-body"></view>
                    <view class="phone-screen"></view>
          </view>
                  <view class="quality-icon" v-if="promise.type === 'quality'">
                    <view class="star-icon"></view>
            </view>
          </view>
                <text class="promise-text">{{ promise.text }}</text>
            </view>
          </view>
        </view>
        
          <!-- 报修类型 -->
          <view class="repair-types-section">
            <text class="types-title">常见报修类型</text>
            <view class="types-grid">
              <view 
                class="type-card"
                v-for="(type, index) in repairTypes" 
                :key="index"
              >
                <view class="type-icon-container">
                  <view class="type-icon" :class="type.iconClass">
                    <view class="icon-element-1"></view>
                    <view class="icon-element-2"></view>
            </view>
            </view>
                <text class="type-name">{{ type.name }}</text>
                <text class="type-description">{{ type.description }}</text>
            </view>
            </view>
        </view>
      </view>
      
      <!-- 联系我们 -->
        <view v-if="selectedCategory === 'contact'">
          <view class="content-header">
            <view class="header-icon-container">
              <view class="contact-icon">
                <view class="phone-body"></view>
                <view class="phone-wave"></view>
        </view>
            </view>
            <view class="header-text">
              <text class="content-title">联系我们</text>
              <text class="content-subtitle">全天候为您提供优质服务</text>
            </view>
          </view>
          
          <!-- 联系方式 -->
          <view class="contact-methods-section">
            <text class="contact-title">联系方式</text>
            <view class="contact-list">
              <view 
                class="contact-item"
                v-for="(contact, index) in contactMethods" 
                :key="index"
              >
            <view class="contact-icon-container">
                  <view class="contact-method-icon" :class="contact.iconClass">
                    <view class="icon-base"></view>
                    <view class="icon-detail"></view>
                  </view>
            </view>
            <view class="contact-details">
                  <text class="contact-type">{{ contact.type }}</text>
                  <text class="contact-value">{{ contact.value }}</text>
            </view>
                <button class="contact-action" @click="contactAction(contact)">
                  <text class="action-text">{{ contact.action }}</text>
                </button>
          </view>
            </view>
          </view>
          
          <!-- 营业厅信息 -->
          <view class="offices-section">
            <text class="offices-title">营业厅信息</text>
            <view class="offices-list">
              <view 
                class="office-card"
                v-for="(office, index) in officeLocations" 
                :key="index"
                @click="viewOfficeLocation(office)"
              >
                <view class="office-header">
                  <view class="office-icon">
                    <view class="building-icon">
                      <view class="building-body"></view>
                      <view class="building-windows"></view>
            </view>
            </view>
                  <view class="office-info">
                    <text class="office-name">{{ office.name }}</text>
                    <text class="office-hours">{{ office.hours }}</text>
          </view>
                  <view class="location-arrow">
                    <text class="arrow">→</text>
        </view>
            </view>
                <text class="office-address">{{ office.address }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 返回按钮 -->
        <view class="back-to-categories">
          <button class="back-btn" @click="backToCategories">
            <text class="back-btn-text">返回服务分类</text>
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 当前选中的分类
const selectedCategory = ref('');

// FAQ展开状态
const expandedFaq = ref(-1);

// 服务分类数据
const serviceCategories = ref([
  {
    id: 'newConnect',
    title: '新用户报装',
    subtitle: '供热系统接入申请',
    iconClass: 'connect-category-icon'
  },
  {
    id: 'paymentGuide',
    title: '缴费指南',
    subtitle: '热费缴纳方式说明',
    iconClass: 'payment-category-icon'
  },
  {
    id: 'repair',
    title: '报修流程',
    subtitle: '供热故障报修服务',
    iconClass: 'repair-category-icon'
  },
  {
    id: 'contact',
    title: '联系我们',
    subtitle: '客服热线及营业厅',
    iconClass: 'contact-category-icon'
  }
]);

// 新用户报装流程
const newConnectSteps = ref([
  {
    title: '提交申请',
    time: '1个工作日',
    description: '用户携带房产证、身份证等材料到供热营业厅提交供热申请'
  },
  {
    title: '现场勘察',
    time: '3-5个工作日',
    description: '供热公司工作人员上门勘察供热条件，确定施工方案'
  },
  {
    title: '签订合同',
    time: '1个工作日',
    description: '用户与供热公司签订供热合同，并缴纳相关费用'
  },
  {
    title: '施工安装',
    time: '7-10个工作日',
    description: '供热公司进行管道安装和入户施工'
  },
  {
    title: '竣工验收',
    time: '1-2个工作日',
    description: '工程完成后，进行供热系统调试和验收'
  }
]);

// 所需材料
const requiredMaterials = ref([
  '房产证或购房合同',
  '业主身份证原件及复印件',
  '房屋平面图',
  '委托他人办理的需提供委托书'
]);

// 温馨提示
const newConnectTips = ref([
  '新用户报装需提前15个工作日申请',
  '施工周期一般为7-10个工作日，具体视现场情况而定',
  '供热季内可能暂停新用户报装，请提前咨询'
]);

// 缴费方式
const paymentMethods = ref([
  {
    name: '微信小程序缴费',
    description: '通过"精准暖费速办"小程序在线缴纳热费',
    badge: '推荐',
    iconClass: 'mobile-method-icon'
  },
  {
    name: '营业厅缴费',
    description: '前往乌鲁木齐热力集团各营业厅缴纳热费',
    badge: '传统',
    iconClass: 'hall-method-icon'
  },
  {
    name: '银行代缴',
    description: '通过工商银行、农业银行等合作银行代缴',
    badge: '便民',
    iconClass: 'bank-method-icon'
  }
]);

// 常见问题
const faqs = ref([
  {
    question: '热费如何计算？',
    answer: '热费按照房屋建筑面积计算，每平方米单价为26元/采暖季。特殊情况如顶层、角户等会有相应补贴。'
  },
  {
    question: '采暖期有多长？',
    answer: '根据乌鲁木齐市政府规定，采暖期为每年10月15日至次年4月15日，共计183天。'
  },
  {
    question: '如何查询缴费记录？',
    answer: '可通过"精准暖费速办"小程序中的"缴费记录"功能查询历史缴费记录，也可携带相关证件到营业厅查询。'
  },
  {
    question: '可以分期缴费吗？',
    answer: '可以分期缴纳热费，具体分期方案请咨询营业厅工作人员或拨打客服热线960577。'
  }
]);

// 服务承诺
const servicePromises = ref([
  {
    type: 'time',
    text: '24小时服务热线：960577'
  },
  {
    type: 'phone',
    text: '接报后30分钟内响应'
  },
  {
    type: 'time',
    text: '一般故障2小时内到达现场'
  },
  {
    type: 'quality',
    text: '严格执行首问负责制'
  }
]);

// 报修类型
const repairTypes = ref([
  {
    name: '暖气不热',
    description: '室内温度偏低',
    iconClass: 'radiator-type-icon'
  },
  {
    name: '管道漏水',
    description: '供热管道渗漏',
    iconClass: 'leak-type-icon'
  },
  {
    name: '阀门故障',
    description: '阀门无法正常开关',
    iconClass: 'valve-type-icon'
  },
  {
    name: '管道噪音',
    description: '供热管道异响',
    iconClass: 'noise-type-icon'
  }
]);

// 联系方式
const contactMethods = ref([
  {
    type: '客服热线',
    value: '960577',
    action: '拨打',
    iconClass: 'phone-contact-icon'
  },
  {
    type: '报修电话',
    value: '0991-960577',
    action: '拨打',
    iconClass: 'repair-contact-icon'
  },
  {
    type: '投诉建议',
    value: '0991-2867778',
    action: '拨打',
    iconClass: 'complaint-contact-icon'
  },
  {
    type: '电子邮箱',
    value: 'wlmqrlgs@xinjiang.gov.cn',
    action: '发送',
    iconClass: 'email-contact-icon'
  }
]);

// 营业厅位置信息
const officeLocations = ref([
  {
    name: '总部营业厅',
    address: '乌鲁木齐市水磨沟区南湖北路133号',
    hours: '周一至周五 09:00-18:00',
    coordinates: {
      latitude: 43.825592,
      longitude: 87.600970
    }
  },
  {
    name: '天山区营业厅',
    address: '乌鲁木齐市天山区解放北路365号',
    hours: '周一至周五 09:00-18:00',
    coordinates: {
      latitude: 43.793566,
      longitude: 87.615238
    }
  },
  {
    name: '沙依巴克区营业厅',
    address: '乌鲁木齐市沙依巴克区友好北路235号',
    hours: '周一至周五 09:00-18:00',
    coordinates: {
      latitude: 43.801380,
      longitude: 87.582483
    }
  },
  {
    name: '水磨沟区营业厅',
    address: '乌鲁木齐市水磨沟区南湖东路89号',
    hours: '周一至周五 09:00-18:00',
    coordinates: {
      latitude: 43.782340,
      longitude: 87.595123
    }
  }
]);

// 选择服务分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
};

// 返回服务分类
const backToCategories = () => {
  selectedCategory.value = '';
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

// 切换FAQ展开状态
const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? -1 : index;
};

// 联系操作
const contactAction = (contact: any) => {
  if (contact.type.includes('电话') || contact.type.includes('热线')) {
    uni.makePhoneCall({
      phoneNumber: contact.value
    });
  } else if (contact.type.includes('邮箱')) {
    uni.setClipboardData({
      data: contact.value,
      success: () => {
        uni.showToast({
          title: '邮箱地址已复制',
          icon: 'success'
        });
      }
    });
  }
};

// 查看营业厅位置
const viewOfficeLocation = (office: any) => {
  uni.openLocation({
    latitude: office.coordinates.latitude,
    longitude: office.coordinates.longitude,
    name: office.name,
    address: office.address
  });
};

onMounted(() => {
  console.log('办事指南页面已加载');
});
</script>

<style lang="scss">
page {
  background-color: #f8f8f8;
}

.service-guide-container {
  min-height: 100vh;
  background: var(--warm-gradient);
  padding-top: 0rpx; /* 增加顶部间距，避免与微信小程序导航栏冲突 */
  position: relative;
  overflow: hidden;
}

/* ==================== 现代化背景设计 ==================== */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: var(--warm-gradient);
  overflow: hidden;
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--warm-gradient);
  opacity: 0.95;
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--warm-gradient);
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
  width: 250rpx;
  height: 250rpx;
  bottom: -125rpx;
  left: -125rpx;
  animation: float 15s ease-in-out infinite reverse;
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
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  height: 1rpx;
  width: 100%;
  animation: flow 20s linear infinite;
}

.line-1 {
  top: 20%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  animation-delay: -6s;
}

.line-3 {
  top: 80%;
  animation-delay: -12s;
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
  width: 8rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

.dot:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.dot:nth-child(2) { top: 20%; left: 30%; animation-delay: 0.5s; }
.dot:nth-child(3) { top: 30%; left: 50%; animation-delay: 1s; }
.dot:nth-child(4) { top: 40%; left: 70%; animation-delay: 1.5s; }
.dot:nth-child(5) { top: 50%; left: 90%; animation-delay: 2s; }
.dot:nth-child(6) { top: 60%; left: 80%; animation-delay: 2.5s; }
.dot:nth-child(7) { top: 70%; left: 60%; animation-delay: 3s; }
.dot:nth-child(8) { top: 80%; left: 40%; animation-delay: 3.5s; }
.dot:nth-child(9) { top: 90%; left: 20%; animation-delay: 4s; }
.dot:nth-child(10) { top: 100%; left: 0%; animation-delay: 4.5s; }
.dot:nth-child(11) { top: 0%; left: 80%; animation-delay: 5s; }
.dot:nth-child(12) { top: 10%; left: 60%; animation-delay: 5.5s; }

/* ==================== 顶部导航区域 ==================== */
.header-section {
  padding: 180rpx 30rpx 30rpx;
  position: relative;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-back-btn {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-large);
  border: none;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  transition: all 0.3s ease;
}

.nav-back-btn:active {
  transform: scale(0.98);
  box-shadow: var(--md-elevation-1);
}

.back-icon {
  font-size: 36rpx;
  color: var(--accent-primary);
  margin-right: 8rpx;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-placeholder {
  width: 120rpx;
}

/* ==================== 动画效果 ==================== */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30rpx, 30rpx);
  }
}

@keyframes flow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

/* 统计卡片 */
.statistics-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.stats-card {
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

.stats-item {
  flex: 1;
  text-align: center;
}

.stats-number {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.3);
}

.stats-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.stats-divider {
  width: 1rpx;
  height: 40rpx;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  margin: 0 24rpx;
}

/* 服务分类 */
.categories-section {
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

.category-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.category-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  transition: all 0.3s ease;
}

.category-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.category-icon-container {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
}

.category-icon {
      position: relative;
  width: 28rpx;
  height: 28rpx;
}

.connect-category-icon .icon-shape {
  width: 100%;
  height: 8rpx;
  background: var(--md-on-primary);
  border-radius: 4rpx;
  position: relative;
}

.connect-category-icon .icon-details {
        position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12rpx;
  height: 12rpx;
  border: 2rpx solid var(--md-on-primary);
  border-radius: 50%;
}

.category-content {
  flex: 1;
}

.category-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6rpx;
}

.category-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.category-arrow {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 20rpx;
  color: var(--text-muted);
  font-weight: 600;
}

/* 详细内容区域 */
.guide-content-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.header-icon-container {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
}

.header-text {
  flex: 1;
}

.content-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.content-subtitle {
  font-size: 26rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* CSS绘制图标 */
.connect-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.pipe-main {
  position: absolute;
  width: 80%;
  height: 6rpx;
  background: var(--md-on-primary);
  border-radius: 3rpx;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
}

.pipe-branch {
  position: absolute;
        width: 6rpx;
  height: 40%;
  background: var(--md-on-primary);
        border-radius: 3rpx;
  top: 30%;
  right: 15%;
}

.pipe-valve {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  border: 2rpx solid var(--md-on-primary);
  border-radius: 50%;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

.payment-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.coin-body {
  width: 80%;
  height: 80%;
  border: 3rpx solid var(--md-on-primary);
  border-radius: 50%;
  margin: 10% auto;
}

.coin-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16rpx;
  font-weight: 700;
  color: var(--md-on-primary);
}

.repair-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.tool-handle {
  position: absolute;
  width: 4rpx;
  height: 70%;
  background: var(--md-on-primary);
  border-radius: 2rpx;
  bottom: 0;
  left: 30%;
}

.tool-head {
  position: absolute;
  width: 60%;
  height: 8rpx;
  background: var(--md-on-primary);
  border-radius: 4rpx;
  top: 20%;
  right: 10%;
  transform: rotate(30deg);
}

.repair-spark {
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: var(--md-on-primary);
  border-radius: 50%;
  top: 10%;
  right: 20%;
}

.contact-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.phone-body {
  position: absolute;
  width: 60%;
  height: 80%;
  background: var(--md-on-primary);
  border-radius: 8rpx;
  top: 10%;
  left: 20%;
}

.phone-wave {
  position: absolute;
  width: 12rpx;
  height: 3rpx;
  border: 2rpx solid var(--md-on-primary);
  border-radius: 2rpx;
  top: 25%;
  right: 10%;
  border-bottom: none;
}

/* 流程步骤 */
.process-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.process-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24rpx;
}

.process-timeline {
  position: relative;
}
  
  .process-step {
    display: flex;
  position: relative;
  margin-bottom: 32rpx;
}
    
.process-step:last-child {
      margin-bottom: 0;
    }

.step-indicator {
  position: relative;
  margin-right: 24rpx;
    }
    
    .step-number {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  color: var(--md-on-primary);
  font-size: 24rpx;
  font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
}

.step-line {
  position: absolute;
  top: 48rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 2rpx;
  height: 40rpx;
  background: linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    }
    
    .step-content {
      flex: 1;
  padding-top: 4rpx;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
      
      .step-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.step-time {
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12rpx;
  padding: 4rpx 12rpx;
}

.time-text {
  font-size: 20rpx;
  color: var(--accent-primary);
  font-weight: 500;
}

.step-description {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.5;
      }
      
/* 材料清单 */
.materials-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.materials-title {
        font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20rpx;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: rgba(255, 107, 53, 0.05);
  border-radius: var(--md-corner-radius-medium);
  border: 1rpx solid rgba(255, 107, 53, 0.1);
}

.material-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon {
  position: relative;
  width: 24rpx;
  height: 28rpx;
}

.doc-body {
  width: 100%;
  height: 100%;
  background: var(--accent-primary);
  border-radius: 2rpx;
}

.doc-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-top: 6rpx solid var(--md-background);
}

.material-name {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 500;
}

/* 温馨提示 */
.tips-section {
  background: var(--warm-glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 138, 80, 0.2);
  box-shadow: var(--warm-shadow);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.tips-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bulb-icon {
  position: relative;
  width: 20rpx;
  height: 28rpx;
}

.bulb-body {
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 14rpx;
  height: 16rpx;
  background: var(--warning-orange);
  border-radius: 7rpx 7rpx 2rpx 2rpx;
}

.bulb-light {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6rpx;
  height: 4rpx;
  background: var(--warning-orange);
  border-radius: 3rpx;
}

.tips-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--warning-orange);
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tip-item {
  font-size: 24rpx;
  color: var(--text-secondary);
        line-height: 1.5;
  padding-left: 20rpx;
  position: relative;
}

.tip-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--warning-orange);
  font-weight: 700;
}

/* FAQ问答 */
.faq-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.faq-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20rpx;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.faq-item {
  border: 1rpx solid rgba(0, 0, 0, 0.05);
  border-radius: var(--md-corner-radius-medium);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: rgba(255, 107, 53, 0.02);
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-question:active {
  background: rgba(255, 107, 53, 0.05);
}

.question-icon {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.q-mark {
  font-size: 14rpx;
  color: var(--md-on-primary);
  font-weight: 700;
  }

.question-text {
  flex: 1;
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.question-arrow {
  width: 24rpx;
  height: 24rpx;
    display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.question-arrow.expanded {
  transform: rotate(180deg);
}

.arrow {
  font-size: 16rpx;
  color: var(--text-muted);
}

.faq-answer {
  padding: 0 20rpx 20rpx;
  background: var(--md-surface);
  animation: slideDown 0.3s ease-out;
}

.answer-text {
  font-size: 22rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 返回按钮 */
.back-to-categories {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
}

.back-btn {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.back-btn:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-md);
}

.back-btn-text {
  font-size: 26rpx;
  color: var(--md-on-primary);
  font-weight: 600;
}

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes slide {
  0%, 100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(10rpx);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-50rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
}

// 缴费方式样式
.payment-methods {
  margin-bottom: 30rpx;
  
  .methods-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .method-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .method-icon-container {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background-color: rgba(231, 51, 35, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .method-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .method-details {
      flex: 1;
      
      .method-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 6rpx;
        display: block;
      }
      
      .method-desc {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}

// FAQ样式
.payment-faq {
  .faq-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .faq-item {
    border-bottom: 1rpx solid #f0f0f0;
    padding: 20rpx 0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .question-text {
        font-size: 28rpx;
        color: #333;
      }
      
      .question-arrow {
        font-size: 32rpx;
        color: #999;
        transition: all 0.3s;
        transform: rotate(90deg);
        
        &.arrow-down {
          transform: rotate(270deg);
        }
      }
    }
    
    .faq-answer {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      padding: 16rpx 0 0;
      display: block;
    }
  }
}

// 报修类型样式
.repair-types {
  margin-bottom: 30rpx;
  
  .types-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .type-grid {
    display: flex;
    flex-wrap: wrap;
    
    .type-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20rpx;
      
      .type-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
      }
      
      .type-name {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

// 服务承诺样式
.service-promise {
  background-color: #fff9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  
  .promise-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #e73323;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .promise-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    display: block;
  }
}

// 联系方式样式
.contact-methods {
  margin-bottom: 30rpx;
  
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .contact-icon-container {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background-color: rgba(231, 51, 35, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .contact-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .contact-details {
      flex: 1;
      
      .contact-type {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 6rpx;
        display: block;
      }
      
      .contact-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
}

// 营业厅地址样式
.office-locations {
  margin-bottom: 30rpx;
  
  .locations-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .location-item {
    background-color: #f9f9f9;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .location-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .location-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }
      
      .location-arrow {
        font-size: 32rpx;
        color: #999;
      }
    }
    
    .location-details {
      .location-address {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 6rpx;
        display: block;
      }
      
      .location-hours {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 公司信息样式
.company-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 0;
  
  .company-logo {
    width: 200rpx;
    height: 60rpx;
    margin-bottom: 20rpx;
  }
  
  .company-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .company-address, .company-postcode {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 6rpx;
  }
}

/* 缴费方式卡片 */
.payment-methods-section,
.service-promise-section,
.repair-types-section,
.contact-methods-section,
.offices-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--border-radius);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.methods-title,
.promise-title,
.types-title,
.contact-title,
.offices-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20rpx;
}

.methods-list,
.contact-list,
.offices-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.method-card,
.contact-item,
.office-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: rgba(255, 107, 53, 0.02);
  border-radius: var(--md-corner-radius-medium);
  border: 1rpx solid rgba(255, 107, 53, 0.1);
  transition: all 0.3s ease;
}

.method-card:active,
.contact-item:active,
.office-card:active {
  background: rgba(255, 107, 53, 0.05);
  transform: scale(0.98);
}

.method-icon-container,
.contact-icon-container {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
}

.method-content,
.contact-details {
  flex: 1;
}

.method-name,
.contact-type {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.method-description,
.contact-value {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.method-badge {
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12rpx;
  padding: 4rpx 12rpx;
}

.badge-text {
  font-size: 20rpx;
  color: var(--accent-primary);
  font-weight: 600;
}

.contact-action {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 20rpx;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.contact-action:active {
  transform: scale(0.95);
}

.action-text {
  font-size: 22rpx;
  color: var(--md-on-primary);
  font-weight: 500;
}

/* 服务承诺网格 */
.promise-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.promise-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20rpx;
  background: rgba(255, 107, 53, 0.02);
  border-radius: var(--md-corner-radius-medium);
  border: 1rpx solid rgba(255, 107, 53, 0.1);
}

.promise-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promise-text {
  font-size: 22rpx;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 报修类型网格 */
.types-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24rpx;
  background: rgba(255, 107, 53, 0.02);
  border-radius: var(--md-corner-radius-medium);
  border: 1rpx solid rgba(255, 107, 53, 0.1);
  transition: all 0.3s ease;
}

.type-card:active {
  background: rgba(255, 107, 53, 0.05);
  transform: scale(0.98);
}

.type-icon-container {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-name {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6rpx;
}

.type-description {
  font-size: 20rpx;
  color: var(--text-secondary);
}

/* 营业厅卡片 */
.office-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  width: 100%;
  margin-bottom: 8rpx;
}

.office-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.building-body {
  width: 100%;
  height: 80%;
  background: var(--accent-primary);
  border-radius: 2rpx 2rpx 0 0;
}

.building-windows {
  position: absolute;
  top: 20%;
  left: 25%;
  width: 50%;
  height: 40%;
  background: var(--md-on-primary);
  border-radius: 1rpx;
}

.office-info {
  flex: 1;
}

.office-name {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.office-hours {
  font-size: 20rpx;
  color: var(--text-secondary);
}

.location-arrow {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.office-address {
  font-size: 22rpx;
  color: var(--text-secondary);
  padding-left: 56rpx;
}

/* 更多CSS绘制图标 */
.clock-icon {
  position: relative;
  width: 28rpx;
  height: 28rpx;
}

.clock-face {
  width: 100%;
  height: 100%;
  border: 2rpx solid var(--accent-primary);
  border-radius: 50%;
}

.clock-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2rpx;
  height: 40%;
  background: var(--accent-primary);
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(45deg);
}

.phone-icon .phone-body {
  width: 20rpx;
  height: 28rpx;
  background: var(--accent-primary);
  border-radius: 4rpx;
}

.phone-icon .phone-screen {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 50%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rpx;
}

.star-icon {
  position: relative;
  width: 28rpx;
  height: 28rpx;
}

.star-icon::before {
  content: '★';
  font-size: 24rpx;
  color: var(--accent-primary);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 分类图标变体 */
.payment-category-icon .icon-shape {
  width: 80%;
  height: 80%;
  border: 3rpx solid var(--md-on-primary);
  border-radius: 50%;
  margin: 10% auto;
}

.payment-category-icon .icon-details {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12rpx;
  font-weight: 700;
  color: var(--md-on-primary);
}

.repair-category-icon .icon-shape {
  width: 60%;
  height: 6rpx;
  background: var(--md-on-primary);
  border-radius: 3rpx;
  transform: rotate(30deg);
  margin: 40% auto 20%;
}

.repair-category-icon .icon-details {
  width: 3rpx;
  height: 40%;
  background: var(--md-on-primary);
  border-radius: 2rpx;
  margin: 0 auto;
}

.contact-category-icon .icon-shape {
  width: 60%;
  height: 80%;
  background: var(--md-on-primary);
  border-radius: 6rpx;
  margin: 10% auto;
}

.contact-category-icon .icon-details {
  position: absolute;
  top: 25%;
  right: 15%;
  width: 8rpx;
  height: 2rpx;
  border: 1rpx solid var(--md-on-primary);
  border-radius: 1rpx;
  border-bottom: none;
}

/* ==================== 分类标签 ==================== */
.category-tabs {
  display: flex;
  background: var(--warm-glass-bg);
  padding: 20rpx 30rpx;
  overflow-x: auto;
  white-space: nowrap;
  backdrop-filter: blur(20rpx);
  box-shadow: var(--warm-shadow);
  border-radius: var(--border-radius);
  margin: 0 30rpx 30rpx;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .category-tab {
    padding: 20rpx 0;
    margin-right: 30rpx;
    position: relative;
    
    .tab-text {
      font-size: 28rpx;
      color: var(--text-secondary);
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    
    &.active {
      .tab-text {
        color: var(--accent-primary);
        font-weight: bold;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4rpx;
        background: var(--primary-gradient);
        border-radius: 2rpx;
        box-shadow: var(--warm-shadow);
      }
    }
  }
}

/* ==================== 指南列表 ==================== */
.guide-list {
  padding: 0 30rpx;
  
  .guide-item {
    background: var(--warm-glass-bg);
    border-radius: var(--border-radius);
    padding: 30rpx;
    margin-bottom: 24rpx;
    backdrop-filter: blur(20rpx);
    box-shadow: var(--warm-shadow);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: translateY(-4rpx);
      box-shadow: var(--md-elevation-3);
    }
    
    &::before {
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
    
    &:active::before {
      transform: translateX(100%);
    }
    
    .guide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .guide-title {
        font-size: 32rpx;
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .guide-status {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: 500;
        
        &.status-active {
          background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%);
          color: var(--accent-success);
          border: 1rpx solid rgba(79, 172, 254, 0.3);
        }
        
        &.status-inactive {
          background: linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(250, 112, 154, 0.2) 100%);
          color: var(--accent-danger);
          border: 1rpx solid rgba(245, 87, 108, 0.3);
        }
      }
    }
    
    .guide-content {
      .guide-desc {
        font-size: 28rpx;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20rpx;
      }
      
      .guide-meta {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          
          .meta-icon {
            font-size: 24rpx;
            color: var(--text-muted);
          }
          
          .meta-text {
            font-size: 24rpx;
            color: var(--text-muted);
          }
        }
      }
    }
  }
}

/* ==================== 空状态 ==================== */
.empty-section {
  padding: 60rpx 30rpx;
  
  .empty-card {
    background: var(--warm-glass-bg);
    border-radius: var(--border-radius);
    padding: 60rpx 40rpx;
    text-align: center;
    backdrop-filter: blur(20rpx);
    box-shadow: var(--warm-shadow);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
    
    .empty-icon {
      width: 120rpx;
      height: 120rpx;
      margin: 0 auto 30rpx;
      background: var(--accent-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--warm-shadow);
      
      .icon-inner {
        font-size: 48rpx;
        color: #fff;
      }
    }
    
    .empty-text {
      font-size: 32rpx;
      color: var(--text-primary);
      margin-bottom: 20rpx;
    }
    
    .empty-desc {
      font-size: 28rpx;
      color: var(--text-secondary);
      margin-bottom: 40rpx;
    }
    
    .refresh-btn {
      background: var(--primary-gradient);
      color: #fff;
      border: none;
      border-radius: 50rpx;
      padding: 20rpx 48rpx;
      font-size: 28rpx;
      font-weight: 600;
      box-shadow: var(--shadow-md);
      
      &:active {
        transform: scale(0.98);
        box-shadow: var(--shadow-sm);
      }
    }
  }
}

/* ==================== 底部服务信息 ==================== */
.footer-section {
  padding: 30rpx;
  
  .footer-card {
    background: var(--warm-glass-bg);
    border-radius: var(--border-radius);
    padding: 30rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    backdrop-filter: blur(20rpx);
    box-shadow: var(--warm-shadow);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
    
    .footer-icon {
      width: 60rpx;
      height: 60rpx;
      background: var(--accent-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
      
      .icon-inner {
        font-size: 32rpx;
        color: #fff;
      }
    }
    
    .footer-content {
      flex: 1;
      
      .footer-title {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8rpx;
      }
      
      .footer-subtitle {
        font-size: 24rpx;
        color: var(--text-secondary);
      }
    }
  }
}
</style> 