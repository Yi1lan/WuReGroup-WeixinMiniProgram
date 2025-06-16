<template>
  <view class="faq-container">
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
          <view class="dot" v-for="n in 15" :key="n"></view>
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
          <text class="page-title">暖心答疑</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 统计概览卡片 -->
      <view class="overview-section">
        <view class="overview-card">
          <view class="overview-item">
            <text class="overview-number">{{ totalQuestions }}</text>
            <text class="overview-label">问题总数</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-number">{{ answeredCount }}</text>
            <text class="overview-label">已解答</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-number">{{ categoryCount }}</text>
            <text class="overview-label">分类数</text>
          </view>
        </view>
      </view>

      <!-- 智能搜索区 -->
      <view class="search-section">
        <text class="section-title">智能搜索</text>
        <view class="search-card">
          <view class="search-input-container">
            <view class="search-icon-container">
              <view class="search-icon">
                <view class="search-circle"></view>
                <view class="search-handle"></view>
              </view>
            </view>
            <input 
              class="search-input" 
              type="text" 
              placeholder="输入关键词，智能匹配答案..." 
              v-model="searchQuery"
              confirm-type="search"
              @input="handleSearchInput"
              @confirm="handleSearch"
            />
            <button class="search-clear-btn" v-if="searchQuery" @click="clearSearch">
              <text class="clear-icon">×</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 快速问题区 -->
      <view class="quick-questions-section" v-if="!searchQuery">
        <text class="section-title">常见问题</text>
        <view class="quick-questions-grid">
          <view 
            class="quick-question-card" 
            v-for="(item, index) in hotQuestions" 
            :key="index"
            @click="expandQuestion(item)"
          >
            <view class="question-icon-container">
              <view class="question-icon" :class="`icon-${getCategoryIcon(item.category)}`">
                <view class="icon-shape"></view>
                <view class="icon-detail"></view>
              </view>
            </view>
            <text class="question-preview">{{ item.question }}</text>
            <view class="question-tag">
              <text class="tag-text">{{ getCategoryName(item.category) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 分类筛选 -->
      <view class="category-section">
        <text class="section-title">{{ searchQuery ? '搜索结果' : '问题分类' }}</text>
        <view class="category-filters" v-if="!searchQuery">
          <view 
            class="category-filter"
            v-for="category in categories" 
            :key="category.id"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <view class="filter-icon-container">
              <view class="filter-icon" :class="`category-${category.id}`">
                <view class="icon-main"></view>
                <view class="icon-accent"></view>
              </view>
            </view>
            <text class="filter-text">{{ category.name }}</text>
            <view class="filter-count">{{ getCategoryQuestionCount(category.id) }}</view>
          </view>
        </view>
      </view>

      <!-- 问题列表 -->
      <view class="questions-section">
        <view class="questions-header" v-if="filteredQuestions.length > 0">
          <text class="questions-title">
            {{ searchQuery ? `找到 ${filteredQuestions.length} 个相关问题` : getActiveCategoryName() }}
          </text>
        </view>
        
        <view class="questions-list">
          <view 
            class="question-card"
            v-for="(item, index) in filteredQuestions" 
            :key="index"
            :class="{ expanded: expandedQuestions.includes(index) }"
          >
            <!-- 问题头部 -->
            <view class="question-header" @click="toggleQuestion(index)">
              <view class="question-icon-wrapper">
                <view class="question-number">{{ index + 1 }}</view>
              </view>
              <view class="question-content">
                <text class="question-title">{{ item.question }}</text>
                <view class="question-meta">
                  <view class="meta-tag">
                    <text class="meta-text">{{ getCategoryName(item.category) }}</text>
                  </view>
                  <view class="meta-hot" v-if="item.hot">
                    <view class="hot-icon">
                      <view class="flame"></view>
                    </view>
                    <text class="hot-text">热门</text>
                  </view>
                </view>
              </view>
              <view class="expand-indicator">
                <view class="expand-icon" :class="{ rotated: expandedQuestions.includes(index) }">
                  <view class="arrow-line"></view>
                </view>
              </view>
            </view>

            <!-- 答案内容 -->
            <view class="answer-content" v-if="expandedQuestions.includes(index)">
              <view class="answer-divider"></view>
              <view class="answer-wrapper">
                <view class="answer-icon-container">
                  <view class="answer-icon">
                    <view class="bulb-base"></view>
                    <view class="bulb-light"></view>
                  </view>
                </view>
                <view class="answer-text-container">
                  <text class="answer-text">{{ item.answer }}</text>
                </view>
              </view>
              
              <!-- 操作按钮 -->
              <view class="answer-actions">
                <button class="action-btn helpful" @click="markHelpful(item)">
                  <view class="btn-icon">
                    <view class="thumb-icon">
                      <view class="thumb-shape"></view>
                    </view>
                  </view>
                  <text class="btn-text">有帮助</text>
                </button>
                <button class="action-btn contact" @click="contactService(item)">
                  <view class="btn-icon">
                    <view class="service-icon">
                      <view class="person-head"></view>
                      <view class="person-body"></view>
                    </view>
                  </view>
                  <text class="btn-text">联系客服</text>
                </button>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="filteredQuestions.length === 0">
          <view class="empty-icon-container">
            <view class="empty-icon">
              <view class="question-mark">
                <view class="mark-dot"></view>
                <view class="mark-curve"></view>
              </view>
            </view>
          </view>
          <text class="empty-title">{{ searchQuery ? '没有找到相关问题' : '暂无问题' }}</text>
          <text class="empty-subtitle">{{ searchQuery ? '请尝试其他关键词或联系客服' : '该分类下暂时没有问题' }}</text>
          <button class="empty-action" @click="searchQuery ? clearSearch() : contactService()">
            <text class="empty-action-text">{{ searchQuery ? '清空搜索' : '联系客服' }}</text>
          </button>
        </view>
      </view>

      <!-- 帮助中心 -->
      <view class="help-center-section" v-if="!searchQuery && filteredQuestions.length > 0">
        <view class="help-center-card">
          <view class="help-header">
            <view class="help-icon-container">
              <view class="help-icon">
                <view class="support-circle"></view>
                <view class="support-person"></view>
              </view>
            </view>
            <view class="help-content">
              <text class="help-title">还有疑问？</text>
              <text class="help-subtitle">我们的客服团队随时为您服务</text>
            </view>
          </view>
          
          <view class="help-actions">
            <button class="help-btn phone" @click="callService">
              <view class="help-btn-icon">
                <view class="phone-icon">
                  <view class="phone-body"></view>
                  <view class="phone-speaker"></view>
                </view>
              </view>
              <text class="help-btn-text">拨打热线</text>
              <text class="help-btn-detail">960577</text>
            </button>
            <button class="help-btn online" @click="onlineService">
              <view class="help-btn-icon">
                <view class="chat-icon">
                  <view class="chat-bubble"></view>
                  <view class="chat-dots"></view>
                </view>
              </view>
              <text class="help-btn-text">在线客服</text>
              <text class="help-btn-detail">即时回复</text>
            </button>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 搜索和筛选
const searchQuery = ref('');
const activeCategory = ref('all');
const expandedQuestions = ref<number[]>([]);

// 分类数据
const categories = ref([
  { id: 'all', name: '全部问题', icon: 'all' },
  { id: 'payment', name: '缴费问题', icon: 'payment' },
  { id: 'service', name: '服务问题', icon: 'service' },
  { id: 'heating', name: '供暖问题', icon: 'heating' },
  { id: 'account', name: '账户问题', icon: 'account' }
]);

// 问题数据
const questions = ref([
  // 缴费问题
  {
    question: '如何在小程序上缴纳热费？',
    answer: '在小程序首页，点击"缴纳热费"按钮，选择需要缴费的房产，确认金额后，选择支付方式完成缴费。支付成功后，系统会自动生成电子发票，可在"电子发票"中查看。',
    category: 'payment',
    hot: true,
    helpful: 0
  },
  {
    question: '热费是如何计算的？',
    answer: '热费根据房屋建筑面积计算，每平方米的收费标准为26元/采暖季。特殊房型如顶层、角户等会有相应的补贴政策。如有疑问，可咨询客服热线960577获取详细信息。',
    category: 'payment',
    hot: true,
    helpful: 0
  },
  {
    question: '热费可以分期缴纳吗？',
    answer: '可以。我们提供全额缴纳和分期缴纳两种方式。分期缴纳可分为两期，第一期在供暖季开始前缴纳60%，第二期在12月31日前缴纳剩余40%。选择分期缴纳需在营业厅办理相关手续。',
    category: 'payment',
    helpful: 0
  },
  {
    question: '缴费后多久生效？',
    answer: '通过小程序或线上渠道缴费后，系统会实时更新缴费状态，一般在1小时内生效。通过银行或第三方支付渠道缴费可能需要1-2个工作日进行账务处理。',
    category: 'payment',
    helpful: 0
  },
  {
    question: '已缴费但系统显示未缴费怎么办？',
    answer: '请保留好缴费凭证，可通过以下方式处理：1. 在小程序"我的"-"缴费记录"中查看缴费状态；2. 拨打客服热线960577进行咨询；3. 携带缴费凭证前往就近营业厅处理。',
    category: 'payment',
    helpful: 0
  },
  
  // 服务问题
  {
    question: '家中暖气不热怎么办？',
    answer: '您可以：1. 检查暖气阀门是否打开；2. 检查是否需要排气；3. 拨打报修电话960577；4. 通过小程序"服务"-"报修"功能提交报修申请。工作人员将在受理后尽快上门检修。',
    category: 'service',
    hot: true,
    helpful: 0
  },
  {
    question: '如何申请新房暖气安装？',
    answer: '新房暖气安装需携带房产证、身份证等材料到就近营业厅提交申请。工作人员将安排现场勘察，确定施工方案后签订合同，缴纳相关费用后进行安装。详细流程可查看"办事指南"-"新用户报装"。',
    category: 'service',
    helpful: 0
  },
  {
    question: '暖气管道漏水如何紧急处理？',
    answer: '发现暖气管道漏水，请：1. 关闭暖气阀门减少漏水；2. 用容器接住漏水，防止渗漏楼下；3. 立即拨打24小时报修电话960577；4. 工作人员将在1小时内赶到现场处理。',
    category: 'service',
    helpful: 0
  },
  {
    question: '报修后多久能上门维修？',
    answer: '根据服务承诺，报修后30分钟内响应，一般故障2小时内到达现场，紧急故障（如漏水）1小时内到达现场。具体时间可能因天气、路况等因素有所调整，工作人员会提前与您电话确认。',
    category: 'service',
    hot: true,
    helpful: 0
  },
  
  // 供暖问题
  {
    question: '供暖季具体时间是什么时候？',
    answer: '根据乌鲁木齐市政府规定，正常供暖期为每年10月15日至次年4月15日，共计183天。特殊天气情况下，政府可能会适当调整供暖开始或结束时间，调整信息会通过官方渠道及时通知。',
    category: 'heating',
    hot: true,
    helpful: 0
  },
  {
    question: '室内温度标准是多少？',
    answer: '根据《乌鲁木齐市集中供热管理办法》规定，供暖期内室内温度标准不低于18℃。如测量温度低于标准，可拨打客服热线960577申请上门检测并处理。',
    category: 'heating',
    helpful: 0
  },
  {
    question: '供暖初期为什么暖气不够热？',
    answer: '供暖初期（约3-5天）属于系统调试阶段，需要逐步升温以确保系统安全稳定运行。此阶段温度可能不够稳定，属于正常现象。如5天后仍不达标，请及时报修。',
    category: 'heating',
    helpful: 0
  },
  {
    question: '暖气片需要自己排气吗？',
    answer: '是的，供暖初期暖气片内可能存在空气，导致供热不均。您可以：1. 关闭进水阀；2. 打开排气阀，排出空气（有嘶嘶声）；3. 直到有水流出，关闭排气阀；4. 打开进水阀。如不会操作，可申请上门服务。',
    category: 'heating',
    helpful: 0
  },
  
  // 账户问题
  {
    question: '如何修改账户绑定的手机号码？',
    answer: '登录小程序后，进入"我的"-"个人信息"-"手机号码"-"修改"，按提示操作即可更换绑定手机。修改需要验证原手机号，如原号已无法使用，请携带身份证前往营业厅办理。',
    category: 'account',
    helpful: 0
  },
  {
    question: '忘记密码如何重置？',
    answer: '在登录页面点击"忘记密码"，通过绑定的手机号验证身份后，可设置新密码。如手机号无法接收验证码，可携带身份证前往营业厅办理密码重置。',
    category: 'account',
    helpful: 0
  },
  {
    question: '如何添加新的房产信息？',
    answer: '在小程序中，进入"我的房产"-"添加房产"，按提示填写房产信息并上传相关证明材料（如房产证、购房合同等）。审核通过后即可将新房产添加到账户中。',
    category: 'account',
    hot: true,
    helpful: 0
  },
  {
    question: '账户可以解绑房产信息吗？',
    answer: '可以。进入"我的房产"，选择需要解绑的房产，点击"解绑"按钮操作。需注意：1. 有未缴费用的房产无法解绑；2. 部分操作可能需要到营业厅现场办理；3. 解绑后需重新绑定才能继续缴费。',
    category: 'account',
    helpful: 0
  }
]);

// 计算属性
const totalQuestions = computed(() => questions.value.length);
const answeredCount = computed(() => questions.value.length);
const categoryCount = computed(() => categories.value.length - 1); // 排除"全部"

const filteredQuestions = computed(() => {
  let result = questions.value;
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value);
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const hotQuestions = computed(() => {
  return questions.value.filter(item => item.hot).slice(0, 6);
});

// 方法
const selectCategory = (category: string) => {
  activeCategory.value = category;
  expandedQuestions.value = [];
};

const toggleQuestion = (index: number) => {
  const position = expandedQuestions.value.indexOf(index);
  if (position > -1) {
    expandedQuestions.value.splice(position, 1);
  } else {
    expandedQuestions.value.push(index);
  }
};

const expandQuestion = (item: any) => {
  // 切换到对应分类
  activeCategory.value = item.category;
  
  // 展开对应问题
  setTimeout(() => {
    const index = filteredQuestions.value.findIndex(q => q.question === item.question);
    if (index > -1 && !expandedQuestions.value.includes(index)) {
      expandedQuestions.value.push(index);
    }
  }, 100);
};

const handleSearchInput = () => {
  expandedQuestions.value = [];
};

const handleSearch = () => {
  console.log('搜索问题:', searchQuery.value);
  expandedQuestions.value = [];
};

const clearSearch = () => {
  searchQuery.value = '';
  expandedQuestions.value = [];
};

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : '未知分类';
};

const getCategoryIcon = (categoryId: string) => {
  return categoryId;
};

const getActiveCategoryName = () => {
  if (activeCategory.value === 'all') {
    return '全部问题';
  }
  return getCategoryName(activeCategory.value);
};

const getCategoryQuestionCount = (categoryId: string) => {
  if (categoryId === 'all') {
    return questions.value.length;
  }
  return questions.value.filter(q => q.category === categoryId).length;
};

const markHelpful = (item: any) => {
  item.helpful++;
  uni.showToast({
    title: '感谢您的反馈！',
    icon: 'success'
  });
};

const contactService = (item?: any) => {
  uni.showActionSheet({
    itemList: ['拨打客服热线', '在线客服咨询'],
    success: (res) => {
      if (res.tapIndex === 0) {
        callService();
      } else if (res.tapIndex === 1) {
        onlineService();
      }
    }
  });
};

const callService = () => {
  uni.makePhoneCall({
    phoneNumber: '960577',
    success: () => {
      console.log('拨打客服热线成功');
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

const onlineService = () => {
  uni.showToast({
    title: '在线客服功能开发中',
    icon: 'none'
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
  console.log('暖心答疑页面已加载');
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
.faq-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--warm-gradient);
  z-index: -10;
}

.faq-container {
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
  grid-template-columns: repeat(5, 1fr);
  gap: 15rpx;
}

.dot {
  width: 6rpx;
  height: 6rpx;
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
  animation: slideInUp 0.8s ease-out 0.2s backwards;
}

.overview-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 40rpx;
  box-shadow: var(--warm-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-item {
  text-align: center;
  flex: 1;
}

.overview-number {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: var(--accent-primary);
  line-height: 1.2;
}

.overview-label {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
  font-weight: 500;
}

.overview-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 20rpx;
}

/* 区域标题通用样式 */
.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24rpx;
  padding-left: 8rpx;
}

/* 智能搜索区 */
.search-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.3s backwards;
}

.search-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 30rpx;
  box-shadow: var(--warm-shadow);
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 60rpx;
  padding: 20rpx 30rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.search-input-container:focus-within {
  border-color: var(--accent-primary);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 4rpx rgba(255, 107, 53, 0.1);
}

.search-icon-container {
  margin-right: 20rpx;
}

.search-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.search-circle {
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  border: 3rpx solid var(--accent-primary);
  border-radius: 50%;
  top: 2rpx;
  left: 2rpx;
}

.search-handle {
  position: absolute;
  width: 3rpx;
  height: 12rpx;
  background: var(--accent-primary);
  transform: rotate(45deg);
  top: 18rpx;
  left: 18rpx;
  border-radius: 2rpx;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.5;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear-btn {
  background: var(--accent-primary);
  border: none;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
}

.clear-icon {
  color: white;
  font-size: 24rpx;
  font-weight: 600;
}

/* 快速问题区 */
.quick-questions-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.4s backwards;
}

.quick-questions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.quick-question-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 30rpx;
  box-shadow: var(--warm-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
}

.quick-question-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-lg);
}

.question-icon-container {
  margin-bottom: 20rpx;
}

.question-icon {
  position: relative;
  width: 40rpx;
  height: 40rpx;
}

.icon-shape, .icon-detail {
  position: absolute;
  background: var(--accent-primary);
  border-radius: 50%;
}

.icon-payment .icon-shape {
  width: 30rpx;
  height: 30rpx;
  top: 5rpx;
  left: 5rpx;
}

.icon-payment .icon-detail {
  width: 12rpx;
  height: 12rpx;
  top: 14rpx;
  left: 14rpx;
  background: white;
}

.icon-service .icon-shape {
  width: 32rpx;
  height: 20rpx;
  top: 10rpx;
  left: 4rpx;
  border-radius: 16rpx;
}

.icon-service .icon-detail {
  width: 8rpx;
  height: 8rpx;
  top: 16rpx;
  left: 16rpx;
  background: white;
}

.icon-heating .icon-shape {
  width: 24rpx;
  height: 32rpx;
  top: 4rpx;
  left: 8rpx;
  border-radius: 12rpx;
}

.icon-heating .icon-detail {
  width: 8rpx;
  height: 16rpx;
  top: 12rpx;
  left: 16rpx;
  background: white;
  border-radius: 4rpx;
}

.icon-account .icon-shape {
  width: 28rpx;
  height: 28rpx;
  top: 6rpx;
  left: 6rpx;
}

.icon-account .icon-detail {
  width: 16rpx;
  height: 8rpx;
  top: 26rpx;
  left: 12rpx;
  background: white;
  border-radius: 0 0 8rpx 8rpx;
}

.question-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 26rpx;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.question-tag {
  background: rgba(255, 107, 53, 0.1);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  display: inline-block;
}

.tag-text {
  font-size: 22rpx;
  color: var(--accent-primary);
  font-weight: 500;
}

/* 分类筛选区 */
.category-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.5s backwards;
}

.category-filters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.category-filter {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  padding: 24rpx 20rpx;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-filter:active {
  transform: scale(0.98);
}

.category-filter.active {
  border-color: var(--accent-primary);
  background: rgba(255, 107, 53, 0.1);
  box-shadow: 0 0 0 4rpx rgba(255, 107, 53, 0.1);
}

.filter-icon-container {
  margin-right: 16rpx;
}

.filter-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.icon-main, .icon-accent {
  position: absolute;
  background: var(--accent-primary);
}

.category-all .icon-main {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  top: 4rpx;
  left: 4rpx;
}

.category-all .icon-accent {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  top: 12rpx;
  left: 12rpx;
  background: white;
}

.category-payment .icon-main {
  width: 28rpx;
  height: 20rpx;
  border-radius: 10rpx;
  top: 6rpx;
  left: 2rpx;
}

.category-payment .icon-accent {
  width: 12rpx;
  height: 8rpx;
  border-radius: 6rpx;
  top: 12rpx;
  left: 10rpx;
  background: white;
}

.category-service .icon-main {
  width: 20rpx;
  height: 26rpx;
  border-radius: 10rpx;
  top: 3rpx;
  left: 6rpx;
}

.category-service .icon-accent {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  top: 13rpx;
  left: 13rpx;
  background: white;
}

.category-heating .icon-main {
  width: 16rpx;
  height: 28rpx;
  border-radius: 8rpx;
  top: 2rpx;
  left: 8rpx;
}

.category-heating .icon-accent {
  width: 6rpx;
  height: 12rpx;
  border-radius: 3rpx;
  top: 10rpx;
  left: 13rpx;
  background: white;
}

.category-account .icon-main {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  top: 4rpx;
  left: 4rpx;
}

.category-account .icon-accent {
  width: 16rpx;
  height: 6rpx;
  border-radius: 0 0 8rpx 8rpx;
  top: 22rpx;
  left: 8rpx;
  background: white;
}

.filter-text {
  flex: 1;
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.category-filter.active .filter-text {
  color: var(--accent-primary);
  font-weight: 600;
}

.filter-count {
  background: var(--accent-primary);
  color: white;
  border-radius: 20rpx;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-weight: 600;
  min-width: 32rpx;
  text-align: center;
}

.category-filter.active .filter-count {
  background: white;
  color: var(--accent-primary);
}

/* 问题列表区 */
.questions-section {
  padding: 0 40rpx 40rpx;
  animation: slideInUp 0.8s ease-out 0.6s backwards;
}

.questions-header {
  margin-bottom: 24rpx;
}

.questions-title {
  font-size: 28rpx;
  color: var(--text-secondary);
  font-weight: 600;
  padding-left: 8rpx;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.question-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: var(--warm-shadow);
  transition: all 0.3s ease;
}

.question-card.expanded {
  box-shadow: var(--shadow-lg);
}

.question-header {
  display: flex;
  align-items: flex-start;
  padding: 30rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-header:active {
  background: rgba(255, 255, 255, 0.1);
}

.question-icon-wrapper {
  margin-right: 20rpx;
  margin-top: 4rpx;
}

.question-number {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  font-size: 22rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-content {
  flex: 1;
  margin-right: 20rpx;
}

.question-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.meta-tag {
  background: rgba(255, 107, 53, 0.1);
  border-radius: 16rpx;
  padding: 6rpx 12rpx;
}

.meta-text {
  font-size: 20rpx;
  color: var(--accent-primary);
  font-weight: 500;
}

.meta-hot {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: rgba(255, 138, 80, 0.15);
  border-radius: 16rpx;
  padding: 6rpx 10rpx;
}

.hot-icon {
  position: relative;
  width: 16rpx;
  height: 16rpx;
}

.flame {
  position: absolute;
  width: 12rpx;
  height: 16rpx;
  background: var(--warning-orange);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  top: 0;
  left: 2rpx;
}

.hot-text {
  font-size: 20rpx;
  color: var(--warning-orange);
  font-weight: 600;
}

.expand-indicator {
  margin-top: 4rpx;
}

.expand-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.arrow-line {
  position: absolute;
  width: 20rpx;
  height: 3rpx;
  background: var(--text-muted);
  border-radius: 2rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.arrow-line::before {
  content: '';
  position: absolute;
  width: 12rpx;
  height: 3rpx;
  background: var(--text-muted);
  border-radius: 2rpx;
  top: 0;
  right: 0;
  transform: rotate(-90deg);
  transform-origin: 100% 50%;
}

/* 答案内容 */
.answer-content {
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
  animation: slideInDown 0.3s ease-out;
}

.answer-divider {
  height: 1rpx;
  background: linear-gradient(to right, transparent, rgba(255, 107, 53, 0.3), transparent);
  margin: 0 30rpx;
}

.answer-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 30rpx;
  gap: 20rpx;
}

.answer-icon-container {
  margin-top: 4rpx;
}

.answer-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.bulb-base {
  position: absolute;
  width: 20rpx;
  height: 24rpx;
  background: var(--accent-warm);
  border-radius: 50% 50% 30% 30%;
  top: 2rpx;
  left: 6rpx;
}

.bulb-light {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: white;
  border-radius: 50%;
  top: 8rpx;
  left: 12rpx;
}

.answer-text-container {
  flex: 1;
}

.answer-text {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.6;
  font-weight: 400;
  text-align: justify;
}

/* 操作按钮 */
.answer-actions {
  display: flex;
  gap: 16rpx;
  padding: 0 30rpx 30rpx;
}

.action-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border: 1rpx solid rgba(255, 107, 53, 0.2);
  border-radius: 50rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.helpful {
  border-color: var(--success-green);
}

.action-btn.helpful:active {
  background: rgba(76, 175, 80, 0.1);
}

.action-btn.contact {
  border-color: var(--accent-primary);
}

.action-btn.contact:active {
  background: rgba(255, 107, 53, 0.1);
}

.btn-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.thumb-icon .thumb-shape {
  position: absolute;
  width: 16rpx;
  height: 20rpx;
  background: var(--success-green);
  border-radius: 8rpx 8rpx 4rpx 4rpx;
  top: 2rpx;
  left: 4rpx;
}

.thumb-icon .thumb-shape::before {
  content: '';
  position: absolute;
  width: 8rpx;
  height: 6rpx;
  background: var(--success-green);
  border-radius: 4rpx;
  top: -4rpx;
  left: 2rpx;
}

.service-icon .person-head {
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background: var(--accent-primary);
  border-radius: 50%;
  top: 2rpx;
  left: 6rpx;
}

.service-icon .person-body {
  position: absolute;
  width: 16rpx;
  height: 10rpx;
  background: var(--accent-primary);
  border-radius: 50% 50% 0 0;
  top: 12rpx;
  left: 4rpx;
}

.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}

.action-btn.helpful .btn-text {
  color: var(--success-green);
}

.action-btn.contact .btn-text {
  color: var(--accent-primary);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-icon-container {
  margin-bottom: 40rpx;
}

.empty-icon {
  position: relative;
  width: 80rpx;
  height: 80rpx;
}

.question-mark {
  position: relative;
  width: 100%;
  height: 100%;
}

.mark-dot {
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background: var(--text-muted);
  border-radius: 50%;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
}

.mark-curve {
  position: absolute;
  width: 40rpx;
  height: 50rpx;
  border: 6rpx solid var(--text-muted);
  border-bottom: none;
  border-radius: 20rpx 20rpx 0 0;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.mark-curve::before {
  content: '';
  position: absolute;
  width: 20rpx;
  height: 6rpx;
  background: var(--text-muted);
  bottom: -6rpx;
  right: -6rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16rpx;
}

.empty-subtitle {
  font-size: 26rpx;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 40rpx;
}

.empty-action {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.empty-action:active {
  transform: scale(0.98);
  background: var(--accent-secondary);
}

.empty-action-text {
  color: white;
}

/* 帮助中心 */
.help-center-section {
  padding: 0 40rpx 80rpx;
  animation: slideInUp 0.8s ease-out 0.7s backwards;
}

.help-center-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20rpx);
  border-radius: var(--md-corner-radius-large);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 40rpx;
  box-shadow: var(--warm-shadow);
}

.help-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.help-icon-container {
  margin-right: 20rpx;
}

.help-icon {
  position: relative;
  width: 40rpx;
  height: 40rpx;
}

.support-circle {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid var(--accent-primary);
  border-radius: 50%;
  top: 4rpx;
  left: 4rpx;
}

.support-person {
  position: absolute;
  width: 12rpx;
  height: 16rpx;
  background: var(--accent-primary);
  border-radius: 50% 50% 0 0;
  top: 12rpx;
  left: 14rpx;
}

.help-content {
  flex: 1;
}

.help-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.help-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.4;
}

.help-actions {
  display: flex;
  gap: 16rpx;
}

.help-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border: 2rpx solid var(--accent-primary);
  border-radius: var(--md-corner-radius-large);
  padding: 24rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}

.help-btn:active {
  transform: scale(0.98);
  background: rgba(255, 107, 53, 0.1);
}

.help-btn-icon {
  width: 32rpx;
  height: 32rpx;
  position: relative;
}

.phone-icon .phone-body {
  position: absolute;
  width: 20rpx;
  height: 28rpx;
  background: var(--accent-primary);
  border-radius: 6rpx;
  top: 2rpx;
  left: 6rpx;
}

.phone-icon .phone-speaker {
  position: absolute;
  width: 8rpx;
  height: 2rpx;
  background: white;
  border-radius: 1rpx;
  top: 8rpx;
  left: 12rpx;
}

.chat-icon .chat-bubble {
  position: absolute;
  width: 24rpx;
  height: 20rpx;
  background: var(--accent-primary);
  border-radius: 12rpx 12rpx 12rpx 4rpx;
  top: 6rpx;
  left: 4rpx;
}

.chat-icon .chat-dots {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  background: white;
  border-radius: 50%;
  top: 13rpx;
  left: 13rpx;
}

.chat-icon .chat-dots::before,
.chat-icon .chat-dots::after {
  content: '';
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: white;
  border-radius: 50%;
  top: 1rpx;
}

.chat-icon .chat-dots::before {
  left: -6rpx;
}

.chat-icon .chat-dots::after {
  left: 6rpx;
}

.help-btn-text {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--accent-primary);
}

.help-btn-detail {
  font-size: 22rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 动画定义 */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20rpx) rotate(5deg); }
}

@keyframes slide {
  0%, 100% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(20rpx); opacity: 0.7; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes slideInDown {
  from { transform: translateY(-50rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(50rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 