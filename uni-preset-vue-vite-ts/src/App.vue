<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { apiService } from '@/api';

onLaunch(() => {
  console.log("App Launch");
  
  // 检查登录状态
  const isLoggedIn = apiService.isLoggedIn();
  console.log('用户登录状态:', isLoggedIn);
  
  // 根据登录状态决定跳转页面
  setTimeout(() => {
    if (isLoggedIn) {
      // 已登录，跳转到首页
      uni.reLaunch({
        url: '/pages/index/index',
        success: () => {
          console.log('重定向到首页成功');
        },
        fail: (err) => {
          console.error('重定向到首页失败:', err);
          // 如果跳转首页失败，还是跳转到登录页
          uni.reLaunch({ url: '/pages/login/index' });
        }
      });
    } else {
      // 未登录，跳转到登录页
      uni.reLaunch({
        url: '/pages/login/index',
        success: () => {
          console.log('重定向到登录页成功');
        },
        fail: (err) => {
          console.error('重定向到登录页失败:', err);
        }
      });
    }
  }, 100); // 延迟100ms确保页面初始化完成
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
