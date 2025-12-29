<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 获取路由参数
const platformName = route.params.name;

// 平台列表和说明
const platforms = [
  // 视频平台
  { name: '抖音', url: 'https://www.douyin.com/', icon: '🎥', description: '抖音是一款专注于音乐创意短视频的社交软件，用户可以分享15秒到60秒的短视频。' },
  { name: 'Bilibili', url: 'https://www.bilibili.com/', icon: '📺', description: 'Bilibili是一个面向年轻人的文化社区和视频平台，以动画、番剧、游戏内容为主。' },
  { name: '腾讯视频', url: 'https://v.qq.com/', icon: '🎬', description: '腾讯视频是中国领先的在线视频媒体平台，提供电影、电视剧、综艺、动漫等内容。' },
  { name: '爱奇艺', url: 'https://www.iqiyi.com/', icon: '🎞️', description: '爱奇艺是中国最大的视频网站之一，提供海量高清视频内容，包括电影、电视剧、综艺等。' },
  { name: '优酷', url: 'https://www.youku.com/', icon: '🎭', description: '优酷是中国领先的视频分享网站，提供电影、电视剧、综艺、动漫等多种类型的视频内容。' },
  // 漫画平台
  { name: '腾讯动漫', url: 'https://ac.qq.com/', icon: '📖', description: '腾讯动漫是中国最大的动漫平台之一，提供海量正版漫画阅读服务。' },
  { name: '哔哩哔哩漫画', url: 'https://manga.bilibili.com/', icon: '📚', description: '哔哩哔哩漫画是B站旗下的正版漫画平台，拥有丰富的漫画资源。' },
  { name: '爱奇艺漫画', url: 'https://manhua.iqiyi.com/', icon: '🎨', description: '爱奇艺漫画是爱奇艺旗下的漫画阅读平台，提供精品漫画内容。' },
  { name: '快看漫画', url: 'https://www.kuaikanmanhua.com/', icon: '🖌️', description: '快看漫画是中国领先的移动漫画平台，以彩色条漫为主，拥有大量热门作品。' },
  { name: '漫画台', url: 'https://www.manhuatai.com/', icon: '📜', description: '漫画台是一个免费的漫画阅读网站，提供各类热门漫画作品。' },
];

// 找到当前平台
const currentPlatform = computed(() => {
  return platforms.find(p => p.name === platformName) || null;
});

// 如果平台不存在，重定向到首页
if (!currentPlatform.value) {
  router.push('/home');
}

// 跳转到平台网站并记录访问次数
const navigateToPlatform = () => {
  userStore.addVisit(currentPlatform.value.name);
  window.open(currentPlatform.value.url, '_blank');
};

// 返回首页
const goBack = () => {
  router.push('/home');
};
</script>

<template>
  <div class="detail-container">
    <header class="header">
      <h1>平台详情</h1>
      <button class="back-button" @click="goBack">返回首页</button>
    </header>
    
    <main class="main-content">
      <div v-if="currentPlatform" class="platform-detail">
        <div class="platform-card">
          <div class="platform-icon">{{ currentPlatform.icon }}</div>
          <div class="platform-name">{{ currentPlatform.name }}</div>
          <div class="visit-count">访问次数: {{ userStore.getPlatformVisitCount(currentPlatform.name) }}</div>
        </div>
        
        <div class="platform-description">
          <h2>平台介绍</h2>
          <p>{{ currentPlatform.description }}</p>
        </div>
        
        <div class="action-section">
          <button class="navigate-button" @click="navigateToPlatform">
            访问 {{ currentPlatform.name }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  color: #333;
  font-size: 2rem;
  margin: 0;
}

.back-button {
  padding: 8px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #35495e;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.platform-detail {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.platform-card {
  text-align: center;
  margin-bottom: 30px;
}

.platform-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.platform-name {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.visit-count {
  font-size: 1.1rem;
  color: #666;
}

.platform-description {
  margin-bottom: 40px;
}

.platform-description h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #42b883;
  padding-bottom: 5px;
  display: inline-block;
}

.platform-description p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  text-align: justify;
}

.action-section {
  text-align: center;
}

.navigate-button {
  padding: 12px 30px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.navigate-button:hover {
  background-color: #35495e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>