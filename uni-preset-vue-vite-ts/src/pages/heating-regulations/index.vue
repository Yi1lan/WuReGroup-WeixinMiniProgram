<template>
  <view class="heating-regulations-container">
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
          <text class="page-title">供热政策</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 政策统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ totalRegulations }}</text>
            <text class="stats-label">政策法规</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ newRegulationsCount }}</text>
            <text class="stats-label">最新发布</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ importantCount }}</text>
            <text class="stats-label">重要政策</text>
          </view>
        </view>
      </view>

      <!-- 搜索区域 -->
      <view class="search-section">
        <view class="search-container">
          <view class="search-box">
            <view class="search-icon">
              <view class="search-glass">
                <view class="glass-circle"></view>
                <view class="glass-handle"></view>
              </view>
            </view>
            <input 
              class="search-input" 
              type="text" 
              placeholder="搜索政策法规..." 
              v-model="searchQuery"
              confirm-type="search"
              @confirm="handleSearch"
            />
            <button class="search-clear" v-if="searchQuery" @click="clearSearch">
              <text class="clear-icon">×</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 政策分类筛选 -->
      <view class="filter-section">
        <view class="filter-container">
          <button 
            class="filter-btn"
            :class="{ 'filter-active': activeCategory === 'all' }"
            @click="selectCategory('all')"
          >
            <view class="filter-icon">
              <view class="all-icon">
                <view class="grid-item" v-for="n in 4" :key="n"></view>
              </view>
            </view>
            <text class="filter-text">全部</text>
          </button>
          <button 
            class="filter-btn"
            :class="{ 'filter-active': activeCategory === 'national' }"
            @click="selectCategory('national')"
          >
            <view class="filter-icon">
              <view class="national-icon">
                <view class="flag-pole"></view>
                <view class="flag-body"></view>
              </view>
            </view>
            <text class="filter-text">国家法规</text>
          </button>
          <button 
            class="filter-btn"
            :class="{ 'filter-active': activeCategory === 'local' }"
            @click="selectCategory('local')"
          >
            <view class="filter-icon">
              <view class="local-icon">
                <view class="building-icon">
                  <view class="building-body"></view>
                  <view class="building-windows"></view>
                </view>
              </view>
            </view>
            <text class="filter-text">地方法规</text>
          </button>
          <button 
            class="filter-btn"
            :class="{ 'filter-active': activeCategory === 'company' }"
            @click="selectCategory('company')"
          >
            <view class="filter-icon">
              <view class="company-icon">
                <view class="office-body"></view>
                <view class="office-roof"></view>
              </view>
            </view>
            <text class="filter-text">企业规章</text>
          </button>
        </view>
      </view>

      <!-- 政策法规列表 -->
      <view class="regulations-section" v-if="filteredRegulations.length > 0">
        <text class="section-title">政策法规</text>
        <view class="regulation-list">
          <view 
            class="regulation-card"
            v-for="(regulation, index) in filteredRegulations" 
            :key="regulation.id"
            @click="showRegulationDetail(regulation)"
          >
            <!-- 政策状态标识 -->
            <view class="status-indicators">
              <view class="category-badge" :class="regulation.category">
                <text class="category-text">{{ getCategoryName(regulation.category) }}</text>
              </view>
              <view class="new-badge" v-if="isNew(regulation.issueDate)">
                <text class="new-text">NEW</text>
              </view>
            </view>

            <view class="card-content">
              <view class="card-header">
                <view class="regulation-info">
                  <text class="regulation-title">{{ regulation.title }}</text>
                  <text class="regulation-summary">{{ regulation.summary }}</text>
                </view>
                <view class="regulation-icon">
                  <view class="document-icon">
                    <view class="doc-body"></view>
                    <view class="doc-header"></view>
                    <view class="doc-lines">
                      <view class="doc-line" v-for="n in 3" :key="n"></view>
                    </view>
                    <view class="doc-seal"></view>
                  </view>
                </view>
              </view>

              <view class="card-details">
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="number-icon">
                        <view class="number-body"></view>
                        <view class="number-text">#</view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">文号</text>
                      <text class="detail-value">{{ regulation.number }}</text>
                    </view>
                  </view>
                </view>
                
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="calendar-icon">
                        <view class="calendar-body"></view>
                        <view class="calendar-lines"></view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">发布日期</text>
                      <text class="detail-value">{{ regulation.issueDate }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="card-footer">
                <view class="issuer-info">
                  <text class="issuer-text">{{ regulation.issuer }}</text>
                </view>
                <button class="read-btn" @click.stop="showRegulationDetail(regulation)">
                  <text class="btn-text">查看详情</text>
                  <text class="btn-icon">→</text>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <view class="empty-card">
          <view class="empty-icon-container">
            <view class="regulation-empty-icon">
              <view class="document-stack">
                <view class="doc-layer" v-for="n in 3" :key="n"></view>
              </view>
              <view class="magnifier">
                <view class="mag-circle"></view>
                <view class="mag-handle"></view>
              </view>
            </view>
          </view>
          <text class="empty-title">{{ getEmptyTitle() }}</text>
          <text class="empty-subtitle">{{ getEmptyMessage() }}</text>
          <button class="refresh-btn" @click="refreshRegulations">
            <text class="refresh-text">刷新页面</text>
          </button>
        </view>
      </view>

      <!-- 底部服务信息 -->
      <view class="footer-section">
        <view class="footer-card">
          <view class="footer-icon-container">
            <view class="service-icon">
              <view class="headset-body"></view>
              <view class="headset-mic"></view>
            </view>
          </view>
          <view class="footer-content">
            <text class="footer-title">政策咨询服务</text>
            <text class="footer-subtitle">客服热线：960577</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 政策详情弹窗 -->
    <view class="detail-mask" v-if="showDetail" @click="closeDetail"></view>
    <view class="detail-container" v-if="showDetail">
      <view class="detail-header">
        <text class="detail-title">{{ currentRegulation?.title }}</text>
        <button class="detail-close" @click="closeDetail">
          <text class="close-icon">×</text>
        </button>
      </view>
      <scroll-view class="detail-content" scroll-y>
        <view class="detail-info-section">
          <view class="detail-info-item">
            <text class="detail-label">文号：</text>
            <text class="detail-value">{{ currentRegulation?.number }}</text>
          </view>
          <view class="detail-info-item">
            <text class="detail-label">发布单位：</text>
            <text class="detail-value">{{ currentRegulation?.issuer }}</text>
          </view>
          <view class="detail-info-item">
            <text class="detail-label">发布日期：</text>
            <text class="detail-value">{{ currentRegulation?.issueDate }}</text>
          </view>
          <view class="detail-info-item">
            <text class="detail-label">实施日期：</text>
            <text class="detail-value">{{ currentRegulation?.effectiveDate }}</text>
          </view>
        </view>
        <view class="detail-divider"></view>
        <view class="detail-text-section">
          <text class="detail-text">{{ currentRegulation?.content }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 模拟政策法规数据
const regulations = ref([
  {
    id: '001',
    title: '中华人民共和国节约能源法',
    number: '主席令第77号',
    issuer: '全国人民代表大会常务委员会',
    issueDate: '2018年10月26日',
    effectiveDate: '2019年01月01日',
    category: 'national',
    summary: '为了推动全社会节约能源，提高能源利用效率，保护和改善环境，促进经济社会全面协调可持续发展...',
    content: '第一条 为了推动全社会节约能源，提高能源利用效率，保护和改善环境，促进经济社会全面协调可持续发展，制定本法。\n\n第二条 本法所称能源，是指煤炭、石油、天然气、生物质能和电力、热力以及其他直接或者通过加工、转换而取得有用能的各种资源。\n\n第三条 节约资源是我国的基本国策。国家实施节约与开发并举、把节约放在首位的能源发展战略。\n\n第四条 节约能源是全社会的共同责任。国家倡导节约光荣、浪费可耻的社会风尚，动员全社会参与节能。',
    isNew: false
  },
  {
    id: '002',
    title: '新疆维吾尔自治区集中供热条例',
    number: '新疆维吾尔自治区人民代表大会常务委员会公告第50号',
    issuer: '新疆维吾尔自治区人民代表大会常务委员会',
    issueDate: '2018年3月28日',
    effectiveDate: '2018年05月01日',
    category: 'local',
    summary: '为了规范集中供热活动，保障供热安全和供热质量，促进节能减排，改善城镇居民生活条件...',
    content: '第一条 为了规范集中供热活动，保障供热安全和供热质量，促进节能减排，改善城镇居民生活条件，根据有关法律、法规，结合自治区实际，制定本条例。\n\n第二条 本条例适用于自治区行政区域内集中供热的规划、建设、运行、管理以及相关服务、使用、监督等活动。\n\n第三条 集中供热应当遵循规划先行、政府监管、市场运作、安全高效、公平服务、保障民生的原则。\n\n第四条 县级以上人民政府应当加强对集中供热工作的领导，将集中供热事业纳入国民经济和社会发展规划，采取措施促进集中供热事业健康发展。',
    isNew: false
  },
  {
    id: '003',
    title: '乌鲁木齐市集中供热管理办法',
    number: '乌政发〔2020〕21号',
    issuer: '乌鲁木齐市人民政府',
    issueDate: '2020年9月15日',
    effectiveDate: '2020年10月15日',
    category: 'local',
    summary: '为加强集中供热管理，保障供热质量，维护供热单位和热用户的合法权益，改善人民群众生活条件...',
    content: '第一条 为加强集中供热管理，保障供热质量，维护供热单位和热用户的合法权益，改善人民群众生活条件，根据《中华人民共和国节约能源法》《新疆维吾尔自治区集中供热条例》等法律法规，结合本市实际，制定本办法。\n\n第二条 本办法适用于本市行政区域内集中供热的规划、建设、运行、管理、服务和使用等活动。\n\n第三条 集中供热实行政府监督管理与行业自律相结合的管理体制。\n\n第四条 市、县（区）人民政府应当将集中供热事业纳入国民经济和社会发展规划，加强对集中供热工作的领导，建立健全集中供热服务保障机制。',
    isNew: false
  },
  {
    id: '004',
    title: '乌鲁木齐热力集团有限公司供热服务标准',
    number: '乌热集团〔2022〕35号',
    issuer: '乌鲁木齐热力集团有限公司',
    issueDate: '2022年8月20日',
    effectiveDate: '2022年10月01日',
    category: 'company',
    summary: '为规范供热服务行为，提高服务质量，满足用户合理需求，建立和谐供用热关系，特制定本服务标准...',
    content: '一、总则\n为规范供热服务行为，提高服务质量，满足用户合理需求，建立和谐供用热关系，特制定本服务标准。\n\n二、供热服务标准\n1. 供热期限：每年10月15日至次年4月15日，共计183天。\n2. 供热温度：室内温度不低于18℃。\n3. 服务响应：用户报修后，工作人员应在30分钟内响应，2小时内到达现场处理。\n\n三、用户须知\n1. 用户应当按照规定缴纳热费。\n2. 不得擅自改动供热系统及设施。\n3. 发现供热故障及时报修。\n\n四、附则\n本标准自发布之日起实施，由乌鲁木齐热力集团有限公司负责解释。',
    isNew: false
  },
  {
    id: '005',
    title: '城市供热价格管理暂行办法',
    number: '发改价格〔2007〕1963号',
    issuer: '国家发展和改革委员会',
    issueDate: '2007年10月1日',
    effectiveDate: '2007年10月1日',
    category: 'national',
    summary: '为规范城市供热价格管理，促进城市供热行业健康发展，保障供热企业和热用户的合法权益...',
    content: '第一条 为规范城市供热价格管理，促进城市供热行业健康发展，保障供热企业和热用户的合法权益，根据《中华人民共和国价格法》等法律法规，制定本办法。\n\n第二条 本办法适用于城市集中供热的价格管理。\n\n第三条 供热价格实行政府定价或政府指导价。\n\n第四条 制定和调整供热价格，应当遵循补偿供热成本、合理确定收益、促进节约用热和保障民生的原则。',
    isNew: false
  },
  {
    id: '006',
    title: '2024年冬季供热工作指导意见',
    number: '乌热集团〔2024〕18号',
    issuer: '乌鲁木齐热力集团有限公司',
    issueDate: '2024年11月15日',
    effectiveDate: '2024年12月01日',
    category: 'company',
    summary: '为确保2024-2025供热季供热工作顺利进行，提升供热服务质量，保障市民温暖过冬...',
    content: '一、总体要求\n认真贯彻落实市委、市政府关于供热工作的决策部署，坚持以人民为中心的发展思想，全力保障市民温暖过冬。\n\n二、重点工作\n1. 强化设备检修维护，确保供热设施安全运行\n2. 优化供热调度，提高供热效率\n3. 完善应急预案，提升应急处置能力\n4. 加强服务质量监管，提升用户满意度\n\n三、服务承诺\n1. 供热期内室温达标率不低于95%\n2. 用户报修响应时间不超过30分钟\n3. 现场处理时间不超过2小时\n4. 24小时客服热线畅通',
    isNew: true
  }
]);

// 页面状态
const searchQuery = ref('');
const activeCategory = ref('all');
const showDetail = ref(false);
const currentRegulation = ref(null);

// 统计数据
const totalRegulations = computed(() => regulations.value.length);

const newRegulationsCount = computed(() => {
  return regulations.value.filter(regulation => isNew(regulation.issueDate)).length;
});

const importantCount = computed(() => {
  return regulations.value.filter(regulation => 
    regulation.category === 'national' || regulation.category === 'local'
  ).length;
});

// 根据分类和搜索条件过滤政策法规
const filteredRegulations = computed(() => {
  let result = regulations.value;
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value);
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.summary.toLowerCase().includes(keyword) ||
      item.number.toLowerCase().includes(keyword) ||
      item.issuer.toLowerCase().includes(keyword)
    );
  }
  
  return result.sort((a, b) => {
    // 按发布日期降序排列（最新的在前）
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });
});

// 判断是否为新政策（30天内发布）
const isNew = (issueDate: string): boolean => {
  const date = new Date(issueDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
};

// 获取分类名称
const getCategoryName = (category: string): string => {
  const categoryMap = {
    'all': '全部',
    'national': '国家法规',
    'local': '地方法规',
    'company': '企业规章'
  };
  return categoryMap[category] || category;
};

// 选择分类
const selectCategory = (category: string) => {
  activeCategory.value = category;
};

// 搜索功能
const handleSearch = () => {
  console.log('搜索关键词:', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
};

// 显示政策详情
const showRegulationDetail = (regulation: any) => {
  currentRegulation.value = regulation;
  showDetail.value = true;
};

// 关闭详情弹窗
const closeDetail = () => {
  showDetail.value = false;
  currentRegulation.value = null;
};

// 刷新政策列表
const refreshRegulations = () => {
  uni.showToast({
    title: '正在刷新...',
    icon: 'loading',
    duration: 1000
  });
  
  setTimeout(() => {
    uni.showToast({
      title: '刷新完成',
      icon: 'success'
    });
  }, 1000);
};

// 返回首页
const backToHome = () => {
  uni.navigateBack({
    success: () => {
      console.log('返回成功');
    },
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  });
};

// 获取空状态标题
const getEmptyTitle = (): string => {
  if (searchQuery.value) {
    return '未找到相关政策';
  } else if (activeCategory.value !== 'all') {
    return '该分类暂无政策';
  }
  return '暂无政策法规';
};

// 获取空状态描述
const getEmptyMessage = (): string => {
  if (searchQuery.value) {
    return `未找到包含"${searchQuery.value}"的政策法规`;
  } else if (activeCategory.value !== 'all') {
    const categoryName = getCategoryName(activeCategory.value);
    return `${categoryName}分类下暂无政策法规`;
  }
  return '暂无政策法规信息，请稍后再试';
};

onMounted(() => {
  console.log('供热政策页面已加载');
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
  background: var(--warm-gradient) !important;
  overflow-x: hidden;
}

/* 备用背景保障 */
view, scroll-view {
  background: transparent;
}

/* 确保根级容器背景 */
.heating-regulations-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--warm-gradient);
  z-index: -10;
}

.heating-regulations-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--warm-gradient);
}

/* ==================== 现代化几何背景系统 ==================== */
.material-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: var(--warm-gradient);
}

.primary-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 154, 86, 0.1) 0%, rgba(255, 173, 86, 0.05) 50%, rgba(255, 201, 71, 0.1) 100%);
}

.elevation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.05) 100%);
}

.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.pattern-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 300rpx;
  height: 300rpx;
  top: 10%;
  right: -50rpx;
  animation-delay: -2s;
}

.shape-2 {
  width: 200rpx;
  height: 200rpx;
  bottom: 20%;
  left: -30rpx;
  animation-delay: -4s;
}

.pattern-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  height: 2rpx;
  width: 100%;
  animation: flow 10s linear infinite;
}

.line-1 {
  top: 20%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  animation-delay: -3s;
}

.line-3 {
  top: 80%;
  animation-delay: -6s;
}

.pattern-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

.dot:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
.dot:nth-child(2) { top: 25%; left: 20%; animation-delay: 0.5s; }
.dot:nth-child(3) { top: 35%; left: 30%; animation-delay: 1s; }
.dot:nth-child(4) { top: 45%; left: 40%; animation-delay: 1.5s; }
.dot:nth-child(5) { top: 55%; left: 50%; animation-delay: 2s; }
.dot:nth-child(6) { top: 65%; left: 60%; animation-delay: 2.5s; }
.dot:nth-child(7) { top: 75%; left: 70%; animation-delay: 3s; }
.dot:nth-child(8) { top: 85%; left: 80%; animation-delay: 3.5s; }
.dot:nth-child(9) { top: 95%; left: 90%; animation-delay: 4s; }
.dot:nth-child(10) { top: 5%; left: 95%; animation-delay: 4.5s; }
.dot:nth-child(11) { top: 15%; left: 85%; animation-delay: 5s; }
.dot:nth-child(12) { top: 25%; left: 75%; animation-delay: 5.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20rpx) rotate(5deg); }
}

@keyframes flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ==================== 内容区域 ==================== */
.content-area {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 200rpx;
}

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

/* ==================== 统计卡片区域 ==================== */
.statistics-section {
  padding: 0 40rpx 40rpx;
}

.stats-card {
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 40rpx;
  box-shadow: var(--md-elevation-3);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--heating-gradient);
  opacity: 0.05;
  z-index: -1;
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
  width: 2rpx;
  height: 60rpx;
  background: var(--md-outline-variant);
  margin: 0 30rpx;
}

/* ==================== 搜索区域 ==================== */
.search-section {
  padding: 0 40rpx 40rpx;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 24rpx 32rpx;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  box-shadow: var(--md-elevation-3);
  border-color: var(--accent-primary);
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-glass {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid var(--accent-primary);
  border-radius: 50%;
  transform: rotate(-45deg);
}

.glass-circle {
  position: absolute;
  top: 2rpx;
  left: 2rpx;
  width: 12rpx;
  height: 12rpx;
  border: 2rpx solid var(--accent-primary);
  border-radius: 50%;
}

.glass-handle {
  position: absolute;
  bottom: -8rpx;
  right: -8rpx;
  width: 12rpx;
  height: 2rpx;
  background: var(--accent-primary);
  transform: rotate(45deg);
}

.search-input {
  flex: 1;
  height: 40rpx;
  font-size: 28rpx;
  color: var(--text-primary);
  background: transparent;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: var(--text-muted);
  background: transparent;
  border: none;
  padding: 0;
  transition: all 0.3s ease;
}

.search-clear:active {
  transform: scale(0.9);
  color: var(--accent-primary);
}

/* ==================== 政策分类筛选 ==================== */
.filter-section {
  padding: 20rpx 40rpx;
}

.filter-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 20rpx;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.filter-btn {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: transparent;
  border: none;
  position: relative;
}

.filter-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.filter-btn.filter-active {
  background: var(--warm-glass-bg);
  border-radius: var(--md-corner-radius-large);
  box-shadow: var(--md-elevation-1);
}

.filter-btn.filter-active .filter-text {
  color: var(--accent-primary);
  font-weight: 600;
}

.filter-arrow {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-left: 8rpx;
}

/* ==================== 政策列表 ==================== */
.regulations-section {
  padding: 20rpx 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24rpx;
}

.regulation-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.regulation-card {
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 32rpx;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.regulation-card:active {
  transform: scale(0.98);
  box-shadow: var(--md-elevation-1);
}

.regulation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8rpx;
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--md-corner-radius) 0 0 var(--md-corner-radius);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.regulation-info {
  flex: 1;
}

.regulation-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.regulation-number {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.regulation-date {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

.regulation-badge {
  background: var(--warm-glass-bg);
  padding: 8rpx 16rpx;
  border-radius: var(--md-corner-radius);
  margin-left: 16rpx;
}

.badge-text {
  font-size: 24rpx;
  color: var(--accent-primary);
  font-weight: 500;
}

.card-content {
  margin-top: 20rpx;
}

.regulation-summary {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ==================== 空状态 ==================== */
.empty-section {
  padding: 60rpx 40rpx;
}

.empty-card {
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 60rpx 40rpx;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon-container {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.regulation-empty-icon {
  position: relative;
  width: 120rpx;
  height: 160rpx;
}

.document-stack {
  position: absolute;
  width: 100%;
  height: 100%;
}

.doc-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--warm-glass-bg);
  border: 2rpx solid var(--accent-primary);
  border-radius: var(--md-corner-radius);
  transform-origin: bottom;
}

.doc-layer:nth-child(1) {
  transform: rotate(-5deg);
}

.doc-layer:nth-child(2) {
  transform: rotate(-2deg);
}

.doc-layer:nth-child(3) {
  transform: rotate(0deg);
}

.magnifier {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60rpx;
  height: 60rpx;
}

.mag-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4rpx solid var(--accent-primary);
  border-radius: 50%;
}

.mag-handle {
  position: absolute;
  bottom: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 4rpx;
  background: var(--accent-primary);
  transform: rotate(45deg);
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16rpx;
}

.empty-subtitle {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 32rpx;
}

.refresh-btn {
  background: var(--warm-glass-bg);
  border: none;
  padding: 16rpx 32rpx;
  border-radius: var(--md-corner-radius-large);
  box-shadow: var(--md-elevation-1);
}

.refresh-text {
  font-size: 28rpx;
  color: var(--accent-primary);
  font-weight: 500;
}

/* ==================== 底部服务信息 ==================== */
.footer-section {
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.footer-card {
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  padding: 32rpx;
  box-shadow: var(--md-elevation-2);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
}

.footer-icon-container {
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon {
  position: relative;
  width: 48rpx;
  height: 48rpx;
}

.headset-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4rpx solid var(--accent-primary);
  border-radius: 50%;
}

.headset-mic {
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 16rpx;
  background: var(--accent-primary);
  border-radius: 4rpx;
}

.footer-content {
  flex: 1;
}

.footer-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.footer-subtitle {
  font-size: 28rpx;
  color: var(--text-secondary);
}

/* ==================== 政策详情弹窗 ==================== */
.detail-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4rpx);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-container {
  position: relative;
  width: 90%;
  max-height: 90vh;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-extra-large);
  box-shadow: var(--md-elevation-4);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.detail-header {
  padding: 32rpx;
  border-bottom: 1rpx solid var(--md-outline-variant);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--warm-glass-bg);
}

.detail-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  padding-right: 32rpx;
}

.detail-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--text-muted);
  background: transparent;
  border: none;
  padding: 0;
  transition: all 0.3s ease;
}

.detail-close:active {
  transform: scale(0.9);
  color: var(--accent-primary);
}

.detail-content {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.detail-info-section {
  margin-bottom: 32rpx;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-large);
  padding: 24rpx;
  box-shadow: var(--md-elevation-1);
}

.detail-info-item {
  display: flex;
  margin-bottom: 16rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid var(--md-outline-variant);
}

.detail-info-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.detail-label {
  width: 160rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  flex: 1;
  font-size: 28rpx;
  color: var(--text-primary);
}

.detail-divider {
  height: 1rpx;
  background: var(--md-outline-variant);
  margin: 32rpx 0;
}

.detail-text-section {
  margin-top: 32rpx;
  background: var(--glass-bg);
  border-radius: var(--md-corner-radius-large);
  padding: 24rpx;
  box-shadow: var(--md-elevation-1);
}

.detail-text {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
}
</style> 