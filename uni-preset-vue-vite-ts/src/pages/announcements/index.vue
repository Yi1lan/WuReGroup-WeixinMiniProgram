<template>
  <view class="announcements-container">
    <!-- 现代化背景设计 -->
    <view class="material-background">
      <view class="primary-surface"></view>
      <view class="elevation-overlay"></view>
      <view class="geometric-pattern">
        <view class="pattern-shape shape-1"></view>
        <view class="pattern-shape shape-2"></view>
        <view class="pattern-circles">
          <view class="circle circle-1"></view>
          <view class="circle circle-2"></view>
          <view class="circle circle-3"></view>
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
          <text class="page-title">官方公告</text>
          <view class="nav-placeholder"></view>
        </view>
      </view>

      <!-- 公告统计卡片 -->
      <view class="statistics-section">
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-number">{{ announcements.length }}</text>
            <text class="stats-label">全部公告</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ newAnnouncementsCount }}</text>
            <text class="stats-label">最新发布</text>
          </view>
          <view class="stats-divider"></view>
          <view class="stats-item">
            <text class="stats-number">{{ importantCount }}</text>
            <text class="stats-label">重要通知</text>
          </view>
        </view>
      </view>

      <!-- 公告分类筛选 -->
      <view class="filter-section">
        <view class="filter-container">
          <button 
            class="filter-btn"
            :class="{ 'filter-active': currentFilter === 'all' }"
            @click="setFilter('all')"
          >
            <text class="filter-text">全部</text>
          </button>
          <button 
            class="filter-btn"
            :class="{ 'filter-active': currentFilter === 'new' }"
            @click="setFilter('new')"
          >
            <text class="filter-text">最新</text>
          </button>
          <button 
            class="filter-btn"
            :class="{ 'filter-active': currentFilter === 'important' }"
            @click="setFilter('important')"
          >
            <text class="filter-text">重要</text>
          </button>
        </view>
      </view>

      <!-- 公告列表 -->
      <view class="announcements-section" v-if="filteredAnnouncements.length > 0">
        <text class="section-title">公告信息</text>
        <view class="announcement-list">
          <view 
            class="announcement-card"
            v-for="(notice, index) in filteredAnnouncements" 
            :key="notice.id"
            @click="viewAnnouncementDetail(notice)"
          >
            <!-- 公告状态标识 -->
            <view class="status-indicators">
              <view class="priority-badge" v-if="notice.priority === 'high'">
                <text class="priority-text">重要</text>
              </view>
              <view class="new-badge" v-if="isNew(notice.publishDate)">
                <text class="new-text">NEW</text>
              </view>
            </view>

            <view class="card-content">
              <view class="card-header">
                <view class="announcement-info">
                  <text class="announcement-title">{{ notice.title }}</text>
                  <text class="announcement-summary">{{ notice.summary }}</text>
                </view>
                <view class="announcement-icon">
                  <view class="notice-icon">
                    <view class="icon-bell">
                      <view class="bell-body"></view>
                      <view class="bell-clapper"></view>
                    </view>
                  </view>
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
                      <text class="detail-label">发布时间</text>
                      <text class="detail-value">{{ notice.publishDate }}</text>
                    </view>
                  </view>
                </view>
                
                <view class="detail-row">
                  <view class="detail-item">
                    <view class="detail-icon-circle">
                      <view class="source-icon">
                        <view class="building-icon">
                          <view class="building-base"></view>
                          <view class="building-floors"></view>
                        </view>
                      </view>
                    </view>
                    <view class="detail-content">
                      <text class="detail-label">发布机构</text>
                      <text class="detail-value">{{ notice.source }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="card-footer">
                <view class="read-status">
                  <text class="read-count">阅读量 {{ notice.readCount || 0 }}</text>
                </view>
                <button class="read-btn" @click.stop="viewAnnouncementDetail(notice)">
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
            <view class="megaphone-icon">
              <view class="megaphone-body"></view>
              <view class="megaphone-cone"></view>
              <view class="sound-waves">
                <view class="wave" v-for="n in 3" :key="n"></view>
              </view>
            </view>
          </view>
          <text class="empty-title">暂无相关公告</text>
          <text class="empty-subtitle">{{ getEmptyMessage() }}</text>
          <button class="refresh-btn" @click="refreshAnnouncements">
            <text class="refresh-text">刷新页面</text>
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
            <text class="footer-title">获取更多信息</text>
            <text class="footer-subtitle">客服热线：960577</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 公告详情弹窗 -->
    <view class="detail-mask" v-if="showDetail" @click="closeDetail"></view>
    <view class="detail-modal" v-if="showDetail">
      <view class="modal-header">
        <view class="modal-title-container">
          <text class="modal-title">{{ currentAnnouncement.title }}</text>
          <view class="modal-badges">
            <view class="modal-priority-badge" v-if="currentAnnouncement.priority === 'high'">
              <text class="modal-priority-text">重要</text>
            </view>
            <view class="modal-new-badge" v-if="isNew(currentAnnouncement.publishDate)">
              <text class="modal-new-text">NEW</text>
            </view>
          </view>
        </view>
        <button class="modal-close-btn" @click="closeDetail">
          <text class="close-icon">×</text>
        </button>
      </view>
      
      <scroll-view class="modal-content" scroll-y="true">
        <view class="modal-info">
          <view class="modal-meta">
            <view class="meta-item">
              <text class="meta-label">发布机构</text>
              <text class="meta-value">{{ currentAnnouncement.source }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">发布时间</text>
              <text class="meta-value">{{ currentAnnouncement.publishDate }}</text>
            </view>
          </view>
          <view class="modal-divider"></view>
          <rich-text 
            class="modal-text" 
            :nodes="formatAnnouncementContent(currentAnnouncement.content)"
          ></rich-text>
        </view>
      </scroll-view>
      
      <view class="modal-footer">
        <button class="share-btn" @click="shareAnnouncement">
          <view class="share-icon">
            <view class="share-circle"></view>
            <view class="share-arrow"></view>
          </view>
          <text class="share-text">分享公告</text>
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

// 公告数据 - 增强版本
const announcements = ref([
  {
    id: '001',
    title: '全新收费端小程序上线启动',
    summary: '为提升用户体验，精准暖费速办小程序全新上线，提供缴费、查询、报修等多项功能，欢迎使用。',
    content: '<div style="line-height: 1.6;"><p>尊敬的用户：</p><p style="text-indent: 2em;">为了更好地服务广大用户，提升供热费缴纳体验，乌鲁木齐热力集团有限公司于2024年8月15日正式推出"精准暖费速办"微信小程序。</p><p style="text-indent: 2em;">新版小程序具有以下特点：</p><p style="text-indent: 2em;">1. <strong>便捷缴费</strong>：足不出户，随时随地在线缴纳热费；</p><p style="text-indent: 2em;">2. <strong>房产管理</strong>：支持多套房产管理，家人房产代缴；</p><p style="text-indent: 2em;">3. <strong>电子发票</strong>：缴费后自动生成电子发票，环保便捷；</p><p style="text-indent: 2em;">4. <strong>报修服务</strong>：在线提交报修申请，处理进度实时查询；</p><p style="text-indent: 2em;">5. <strong>信息查询</strong>：供热相关政策、法规、指南一应俱全。</p><p style="text-indent: 2em;">扫描官方二维码或在微信中搜索"精准暖费速办"即可使用。如有疑问，请拨打客服热线：960577。</p><p style="text-align: right;">乌鲁木齐热力集团有限公司</p><p style="text-align: right;">2024年8月15日</p></div>',
    publishDate: '2024-08-15',
    source: '乌鲁木齐热力集团',
    priority: 'high',
    readCount: 1248
  },
  {
    id: '002',
    title: '2024-2025年度供热收费标准公告',
    summary: '根据物价局批复，2024-2025年度供热收费标准为每平方米26元，执行时间为2024年10月15日至2025年4月15日。',
    content: '<div style="line-height: 1.6;"><p>尊敬的用户：</p><p style="text-indent: 2em;">根据乌鲁木齐市发展和改革委员会《关于2024-2025年采暖季热价费用的通知》（乌发改价格〔2024〕35号），现将我公司2024-2025年度供热收费标准公告如下：</p><p style="text-indent: 2em;"><strong>一、收费标准</strong></p><p style="text-indent: 2em;">1. 居民住宅：26元/平方米·采暖季</p><p style="text-indent: 2em;">2. 公共建筑：32元/平方米·采暖季</p><p style="text-indent: 2em;">3. 经营性用房：35元/平方米·采暖季</p><p style="text-indent: 2em;"><strong>二、优惠政策</strong></p><p style="text-indent: 2em;">1. 顶层住宅：按标准增加10%补贴</p><p style="text-indent: 2em;">2. 角户住宅：按标准增加5%补贴</p><p style="text-indent: 2em;">3. 老旧小区：按相关政策执行专项补贴</p><p style="text-indent: 2em;"><strong>三、缴费时间</strong></p><p style="text-indent: 2em;">请用户于2024年10月15日前缴纳本采暖季热费。可选择一次性缴纳或分期缴纳方式。</p><p style="text-indent: 2em;"><strong>四、缴费方式</strong></p><p style="text-indent: 2em;">1. 微信小程序"精准暖费速办"</p><p style="text-indent: 2em;">2. 各营业厅现场缴费</p><p style="text-indent: 2em;">3. 合作银行代收</p><p style="text-align: right;">乌鲁木齐热力集团有限公司</p><p style="text-align: right;">2024年8月20日</p></div>',
    publishDate: '2024-08-20',
    source: '乌鲁木齐热力集团',
    priority: 'high',
    readCount: 2156
  },
  {
    id: '003',
    title: '2024-2025年度供热系统检修通知',
    summary: '为确保冬季供暖质量，我公司将于2024年9月1日至9月30日进行供热系统年度检修，期间部分区域将临时停水。',
    content: '<div style="line-height: 1.6;"><p>尊敬的用户：</p><p style="text-indent: 2em;">为确保2024-2025年采暖季供热系统安全稳定运行，我公司定于2024年9月1日至9月30日对供热管网及设备进行年度检修。现将有关事项通知如下：</p><p style="text-indent: 2em;"><strong>一、检修时间安排</strong></p><p style="text-indent: 2em;">1. 天山区：9月1日-9月10日</p><p style="text-indent: 2em;">2. 沙依巴克区：9月11日-9月20日</p><p style="text-indent: 2em;">3. 水磨沟区：9月21日-9月30日</p><p style="text-indent: 2em;"><strong>二、检修内容</strong></p><p style="text-indent: 2em;">1. 供热管网系统压力测试</p><p style="text-indent: 2em;">2. 换热站设备检修维护</p><p style="text-indent: 2em;">3. 管网漏点排查维修</p><p style="text-indent: 2em;">4. 阀门、补水设备检修</p><p style="text-indent: 2em;"><strong>三、注意事项</strong></p><p style="text-indent: 2em;">1. 检修期间相关区域供热管网内的热水将排空，请用户关闭家中暖气阀门</p><p style="text-indent: 2em;">2. 若您家中有漏水情况，请趁此机会进行维修</p><p style="text-indent: 2em;">3. 检修结束后，系统将进行试压充水，请注意观察家中暖气是否漏水</p><p style="text-indent: 2em;">检修期间给您带来的不便，敬请谅解。若有疑问，请拨打客服热线：960577。</p><p style="text-align: right;">乌鲁木齐热力集团有限公司</p><p style="text-align: right;">2024年8月25日</p></div>',
    publishDate: '2024-08-25',
    source: '乌鲁木齐热力集团',
    priority: 'normal',
    readCount: 967
  },
  {
    id: '004',
    title: '关于10月15日正式供热的通知',
    summary: '根据乌鲁木齐市政府统一安排，我公司将于2024年10月15日正式开始供热，请用户做好室内供热系统准备工作。',
    content: '<div style="line-height: 1.6;"><p>尊敬的用户：</p><p style="text-indent: 2em;">根据乌鲁木齐市政府统一安排，我公司将于2024年10月15日正式开始供热。现将有关事项通知如下：</p><p style="text-indent: 2em;"><strong>一、供热时间</strong></p><p style="text-indent: 2em;">开始时间：2024年10月15日</p><p style="text-indent: 2em;">结束时间：2025年4月15日</p><p style="text-indent: 2em;">供热总天数：183天</p><p style="text-indent: 2em;"><strong>二、升温安排</strong></p><p style="text-indent: 2em;">10月15日-10月18日为系统升温调试阶段，各小区将陆续升温，请用户耐心等待。如10月20日后室温仍未达标，请及时联系我公司客服。</p><p style="text-indent: 2em;"><strong>三、用户准备工作</strong></p><p style="text-indent: 2em;">1. 请检查室内暖气管道、阀门是否完好</p><p style="text-indent: 2em;">2. 及时排除暖气片内空气</p><p style="text-indent: 2em;">3. 确保暖气片进出水阀门处于开启状态</p><p style="text-indent: 2em;">4. 如有未缴纳热费的用户，请尽快缴纳</p><p style="text-indent: 2em;">感谢您的配合与支持！如有疑问，请拨打客服热线：960577。</p><p style="text-align: right;">乌鲁木齐热力集团有限公司</p><p style="text-align: right;">2024年10月10日</p></div>',
    publishDate: '2024-10-10',
    source: '乌鲁木齐热力集团',
    priority: 'high',
    readCount: 1845
  },
  {
    id: '005',
    title: '寒潮来袭期间供热保障措施公告',
    summary: '针对近期寒潮天气，我公司将加大供热力度，确保室内温度达标，并开通24小时应急抢修服务。',
    content: '<div style="line-height: 1.6;"><p>尊敬的用户：</p><p style="text-indent: 2em;">根据气象部门预报，我市将于近期迎来一轮强寒潮天气，气温将明显下降。为确保广大用户温暖过冬，我公司特制定以下供热保障措施：</p><p style="text-indent: 2em;"><strong>一、增温措施</strong></p><p style="text-indent: 2em;">1. 从2024年11月10日起，所有换热站将提高供水温度2-3℃</p><p style="text-indent: 2em;">2. 加大循环水泵运行频率，提高热水循环效率</p><p style="text-indent: 2em;">3. 延长锅炉设备满负荷运行时间</p><p style="text-indent: 2em;"><strong>二、应急服务</strong></p><p style="text-indent: 2em;">1. 开通24小时应急抢修服务</p><p style="text-indent: 2em;">2. 增派维修人员，确保故障及时处理</p><p style="text-indent: 2em;">3. 重点关注老旧小区和顶层、角户的供热情况</p><p style="text-indent: 2em;"><strong>三、温馨提示</strong></p><p style="text-indent: 2em;">1. 请勿私自调整暖气设备参数</p><p style="text-indent: 2em;">2. 保持门窗密封，减少热量损失</p><p style="text-indent: 2em;">3. 如发现暖气不热、漏水等问题，请及时拨打客服热线：960577</p><p style="text-indent: 2em;">感谢您的理解与支持！</p><p style="text-align: right;">乌鲁木齐热力集团有限公司</p><p style="text-align: right;">2024年11-08</p></div>',
    publishDate: '2024-11-08',
    source: '乌鲁木齐热力集团',
    priority: 'normal',
    readCount: 723
  }
]);

// 筛选状态
const currentFilter = ref('all');

// 计算属性
const newAnnouncementsCount = computed(() => {
  return announcements.value.filter(notice => isNew(notice.publishDate)).length;
});

const importantCount = computed(() => {
  return announcements.value.filter(notice => notice.priority === 'high').length;
});

const filteredAnnouncements = computed(() => {
  const sorted = [...announcements.value].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
  
  switch (currentFilter.value) {
    case 'new':
      return sorted.filter(notice => isNew(notice.publishDate));
    case 'important':
      return sorted.filter(notice => notice.priority === 'high');
    default:
      return sorted;
  }
});

// 判断是否是新公告（7天内发布）
const isNew = (publishDate: string): boolean => {
  const now = new Date();
  const publishTime = new Date(publishDate);
  const diffDays = Math.floor((now.getTime() - publishTime.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// 设置筛选条件
const setFilter = (filter: string) => {
  currentFilter.value = filter;
};

// 获取空状态信息
const getEmptyMessage = () => {
  switch (currentFilter.value) {
    case 'new':
      return '近期暂无新发布的公告';
    case 'important':
      return '暂无重要通知公告';
    default:
      return '暂无公告信息，请稍后再试';
  }
};

// 格式化公告内容，确保文本能够正确换行
const formatAnnouncementContent = (content: string) => {
  if (!content) return '';
  
  // 为内容添加样式，确保文本换行和边界控制
  const styledContent = content.replace(
    /<div[^>]*>/g, 
    '<div style="word-wrap: break-word; word-break: break-all; max-width: 100%; overflow-wrap: break-word; white-space: pre-wrap;">'
  );
  
  return styledContent;
};

// 公告详情相关
const showDetail = ref(false);
const currentAnnouncement = ref<any>({});

// 查看公告详情
const viewAnnouncementDetail = (notice: any) => {
  currentAnnouncement.value = notice;
  // 增加阅读量
  notice.readCount = (notice.readCount || 0) + 1;
  showDetail.value = true;
};

// 关闭公告详情
const closeDetail = () => {
  showDetail.value = false;
};

// 分享公告
const shareAnnouncement = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

// 刷新公告
const refreshAnnouncements = () => {
  uni.showToast({
    title: '刷新成功',
    icon: 'success'
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
  console.log('公告页面已加载');
});
</script>

<style lang="scss">
// 页面级别背景设置
page {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%) !important;
  overflow-x: hidden;
}

.announcements-container {
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
  width: 400rpx;
  height: 400rpx;
  top: -200rpx;
  right: -200rpx;
  animation: float 20s ease-in-out infinite;
}

.shape-2 {
  width: 300rpx;
  height: 300rpx;
  bottom: -150rpx;
  left: -150rpx;
  animation: float 25s ease-in-out infinite reverse;
}

.pattern-circles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.circle-1 {
  width: 150rpx;
  height: 150rpx;
  top: 200rpx;
  left: 50rpx;
  animation-delay: 0s;
}

.circle-2 {
  width: 100rpx;
  height: 100rpx;
  top: 600rpx;
  right: 80rpx;
  animation-delay: 1.5s;
}

.circle-3 {
  width: 120rpx;
  height: 120rpx;
  bottom: 300rpx;
  left: 60%;
  animation-delay: 3s;
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
  animation: twinkle 2s ease-in-out infinite;
}

.dot:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
.dot:nth-child(2) { top: 20%; left: 80%; animation-delay: 0.3s; }
.dot:nth-child(3) { top: 35%; left: 40%; animation-delay: 0.6s; }
.dot:nth-child(4) { top: 50%; left: 20%; animation-delay: 0.9s; }
.dot:nth-child(5) { top: 65%; left: 75%; animation-delay: 1.2s; }
.dot:nth-child(6) { top: 80%; left: 45%; animation-delay: 1.5s; }
.dot:nth-child(7) { top: 25%; left: 60%; animation-delay: 1.8s; }
.dot:nth-child(8) { top: 45%; left: 10%; animation-delay: 2.1s; }
.dot:nth-child(9) { top: 70%; left: 90%; animation-delay: 2.4s; }
.dot:nth-child(10) { top: 90%; left: 25%; animation-delay: 2.7s; }
.dot:nth-child(11) { top: 15%; left: 50%; animation-delay: 3s; }
.dot:nth-child(12) { top: 40%; left: 85%; animation-delay: 3.3s; }
.dot:nth-child(13) { top: 60%; left: 30%; animation-delay: 3.6s; }
.dot:nth-child(14) { top: 85%; left: 70%; animation-delay: 3.9s; }
.dot:nth-child(15) { top: 30%; left: 95%; animation-delay: 4.2s; }

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
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 25rpx;
  padding: 10rpx 20rpx;
  color: #222 !important;
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
  font-weight: 700;
  color: #222 !important;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-placeholder {
  width: 120rpx;
}

/* 统计卡片 */
.statistics-section {
  padding: 0 30rpx 30rpx;
}

.stats-card {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 167, 38, 0.08);
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
  gap: 20rpx;
}

.filter-btn {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  border-radius: 18rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 167, 38, 0.08);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  padding: 20rpx 0;
  flex: 1;
  color: #222;
  font-size: 28rpx;
}

.filter-btn.filter-active {
  background: linear-gradient(135deg, #ffecd2 0%, #ffb88c 100%);
  color: #ff6b35;
  font-weight: 700;
  border: 1rpx solid #ffb88c;
  box-shadow: 0 4rpx 16rpx rgba(255, 167, 38, 0.12);
}

.filter-text {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.filter-active .filter-text {
  color: var(--md-on-primary);
  font-weight: 600;
}

/* 公告列表 */
.announcements-section {
  padding: 0 30rpx 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #222 !important;
  margin: 32rpx 0 16rpx 0;
  display: block;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.announcement-card {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 167, 38, 0.10);
  border: 1rpx solid rgba(255, 167, 38, 0.08);
  padding: 30rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.announcement-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.16);
}

/* 状态标识 */
.status-indicators {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  gap: 12rpx;
  z-index: 2;
}

.priority-badge {
  background: var(--error-red);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.new-badge {
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

.announcement-info {
  flex: 1;
  margin-right: 20rpx;
}

.announcement-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--md-on-surface);
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: block;
}

.announcement-summary {
  font-size: 28rpx;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
  display: block;
}

.announcement-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon {
  width: 60rpx;
  height: 60rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bell {
  width: 40rpx;
  height: 40rpx;
  position: relative;
}

.bell-body {
  width: 100%;
  height: 70%;
  background: var(--md-primary);
  border-radius: 50% 50% 0 0;
  position: relative;
}

.bell-clapper {
  width: 8rpx;
  height: 8rpx;
  background: var(--md-primary);
  border-radius: 50%;
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  transform: translateX(-50%);
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

.calendar-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.calendar-body {
  width: 100%;
  height: 100%;
  background: var(--md-on-surface-variant);
  border-radius: 4rpx;
  position: relative;
}

.calendar-lines {
  position: absolute;
  top: 6rpx;
  left: 4rpx;
  right: 4rpx;
  height: 2rpx;
  background: var(--md-surface);
}

.calendar-lines::after {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 0;
  right: 0;
  height: 2rpx;
  background: var(--md-surface);
}

.building-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.building-base {
  width: 100%;
  height: 80%;
  background: var(--md-on-surface-variant);
  border-radius: 2rpx 2rpx 0 0;
  position: absolute;
  bottom: 0;
}

.building-floors {
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  right: 4rpx;
  height: 2rpx;
  background: var(--md-surface);
}

.building-floors::after {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 0;
  right: 0;
  height: 2rpx;
  background: var(--md-surface);
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 26rpx;
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

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.read-status {
  display: flex;
  align-items: center;
}

.read-count {
  font-size: 24rpx;
  color: var(--md-on-surface-variant);
}

.read-btn {
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 154, 86, 0.3);
  transition: all 0.3s ease;
}

.read-btn:active {
  background: var(--warning-orange);
  transform: scale(0.95);
}

.btn-text {
  font-size: 26rpx;
  font-weight: 500;
}

.btn-icon {
  font-size: 24rpx;
}

/* 空状态 */
.empty-section {
  padding: 100rpx 30rpx;
  display: flex;
  justify-content: center;
}

.empty-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  max-width: 500rpx;
  width: 100%;
}

.empty-icon-container {
  margin-bottom: 30rpx;
  display: flex;
  justify-content: center;
}

.megaphone-icon {
  width: 120rpx;
  height: 120rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.megaphone-body {
  width: 60rpx;
  height: 30rpx;
  background: var(--md-outline);
  border-radius: 15rpx;
  position: relative;
}

.megaphone-cone {
  width: 40rpx;
  height: 40rpx;
  background: var(--md-outline);
  border-radius: 0 50% 50% 0;
  position: absolute;
  left: 60rpx;
  top: 50%;
  transform: translateY(-50%);
}

.sound-waves {
  position: absolute;
  right: -30rpx;
  top: 50%;
  transform: translateY(-50%);
}

.wave {
  width: 20rpx;
  height: 4rpx;
  background: var(--md-outline);
  border-radius: 2rpx;
  margin-bottom: 6rpx;
  animation: wave 1s ease-in-out infinite;
}

.wave:nth-child(1) { animation-delay: 0s; }
.wave:nth-child(2) { animation-delay: 0.2s; }
.wave:nth-child(3) { animation-delay: 0.4s; }

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

.refresh-btn {
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

.refresh-btn:active {
  background: var(--warning-orange);
  transform: scale(0.95);
}

/* 底部提示 */
.footer-section {
  padding: 30rpx;
}

.footer-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.phone-icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
}

.phone-body {
  width: 100%;
  height: 100%;
  background: var(--md-primary);
  border-radius: 8rpx;
  position: relative;
}

.phone-screen {
  position: absolute;
  top: 6rpx;
  left: 4rpx;
  right: 4rpx;
  bottom: 8rpx;
  background: var(--md-surface);
  border-radius: 4rpx;
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

/* 详情弹窗 */
.detail-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 248, 240, 0.7);
  backdrop-filter: blur(2px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.detail-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92vw;
  max-width: 700rpx;
  height: 80%;
  max-height: 80vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee0 100%);
  border-radius: 28rpx;
  overflow: hidden;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8rpx 32rpx rgba(255, 167, 38, 0.13);
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: #fff;
  color: #222;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 120rpx;
}

.modal-title-container {
  flex: 1;
  margin-right: 20rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: block;
  color: #222;
}

.modal-badges {
  display: flex;
  gap: 12rpx;
}

.modal-priority-badge {
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.modal-new-badge {
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  font-size: 20rpx;
  font-weight: 600;
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
  flex-shrink: 0;
}

.close-icon {
  font-size: 36rpx;
  font-weight: 300;
}

.modal-content {
  flex: 1;
  padding: 30rpx;
  height: calc(80vh - 240rpx);
  max-height: calc(80vh - 240rpx);
  box-sizing: border-box;
  overflow-y: auto;
  color: #222;
  background: transparent;
}

.modal-info {
  width: 100%;
  padding-bottom: 20rpx;
}

.modal-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid var(--md-outline-variant);
  flex-wrap: wrap;
  gap: 12rpx;
}

.meta-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 120rpx;
}

.meta-label {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 6rpx;
  display: block;
}

.meta-value {
  font-size: 26rpx;
  color: #222;
  font-weight: 500;
  display: block;
}

.modal-divider {
  height: 1px;
  background: var(--md-outline-variant);
  margin: 20rpx 0;
}

.modal-text {
  font-size: 28rpx;
  color: #222;
  line-height: 1.7;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
}

.modal-footer {
  background: #fff8f0;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  border-top: 1px solid #f5e0c8;
  flex-shrink: 0;
  min-height: 100rpx;
}

.share-btn {
  flex: 1;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(255, 154, 86, 0.13);
}

.share-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;
}

.share-circle {
  width: 100%;
  height: 100%;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.share-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8rpx;
  height: 8rpx;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform: translate(-50%, -50%) rotate(-45deg);
}

.close-btn, .modal-close-btn {
  color: #ff6b35 !important;
  background: #fff8f0 !important;
  border: none;
}

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes wave {
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
</style> 