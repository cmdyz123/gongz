<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

// 从store获取平台数据
const videoPlatforms = computed(() => userStore.getVideoPlatforms);
const comicPlatforms = computed(() => userStore.getComicPlatforms);

// 处理平台链接点击，导航到详细页
const handlePlatformClick = (platformName) => {
  router.push(`/platform/${platformName}`);
};

// 计算每个平台的访问次数
const getVisitCount = (platformName) => {
  return userStore.getPlatformVisitCount(platformName);
};

// 登出功能
const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

// 上传平台表单
const showAddForm = ref(false);
const newPlatform = ref({
  name: '',
  url: '',
  icon: '🎥',
  type: 'video'
});
const errorMessage = ref('');

// 平台类型选项
const platformTypes = [
  { value: 'video', label: '视频平台' },
  { value: 'comic', label: '漫画平台' }
];

// 图标选项
const iconOptions = [
  '🎥', '📺', '🎬', '🎞️', '🎭', '📖', '📚', '🎨', '🖌️', '📜'
];

// 表单验证
const validateForm = () => {
  errorMessage.value = '';
  
  if (!newPlatform.value.name.trim()) {
    errorMessage.value = '请输入平台名称';
    return false;
  }
  
  if (!newPlatform.value.url.trim()) {
    errorMessage.value = '请输入平台链接';
    return false;
  }
  
  // 简单的URL格式验证
  const urlPattern = /^(https?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
  if (!urlPattern.test(newPlatform.value.url)) {
    errorMessage.value = '请输入有效的平台链接（以http://或https://开头）';
    return false;
  }
  
  return true;
};

// 处理添加平台
const handleAddPlatform = () => {
  if (!validateForm()) return;
  
  const success = userStore.addCustomPlatform(newPlatform.value.type, {
    name: newPlatform.value.name,
    url: newPlatform.value.url,
    icon: newPlatform.value.icon
  });
  
  if (success) {
    // 重置表单
    newPlatform.value = {
      name: '',
      url: '',
      icon: '🎥',
      type: 'video'
    };
    showAddForm.value = false;
    errorMessage.value = '';
  } else {
    errorMessage.value = '该平台名称已存在';
  }
};

// 处理删除平台
const handleDeletePlatform = (type, platformName) => {
  if (confirm('确定要删除这个平台吗？')) {
    userStore.deleteCustomPlatform(type, platformName);
  }
};
</script>

<template>
  <div class="home-container">
    <header class="header">
      <h1>平台导航</h1>
      <div class="user-info">
        <span>欢迎，{{ userStore.currentUser }}</span>
        <button class="logout-button" @click="handleLogout">登出</button>
      </div>
    </header>
    
    <!-- 添加上传平台按钮 -->
    <div class="add-platform-section">
      <button class="add-button" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '取消添加' : '添加平台' }}
      </button>
      
      <!-- 上传平台表单 -->
      <div v-if="showAddForm" class="add-platform-form">
        <h3>添加新平台</h3>
        <div class="form-group">
          <label>平台类型：</label>
          <select v-model="newPlatform.type" class="form-input">
            <option v-for="type in platformTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>平台名称：</label>
          <input 
            type="text" 
            v-model="newPlatform.name" 
            placeholder="请输入平台名称" 
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>平台链接：</label>
          <input 
            type="url" 
            v-model="newPlatform.url" 
            placeholder="请输入平台链接（http://或https://开头）" 
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>选择图标：</label>
          <div class="icon-selector">
            <button 
              v-for="icon in iconOptions" 
              :key="icon"
              class="icon-button" 
              :class="{ active: newPlatform.icon === icon }"
              @click="newPlatform.icon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="form-actions">
          <button class="submit-button" @click="handleAddPlatform">确认添加</button>
          <button class="cancel-button" @click="showAddForm = false">取消</button>
        </div>
      </div>
    </div>
    
    <main class="main-content">
      <!-- 视频平台 -->
      <section class="platform-section">
        <h2>视频平台</h2>
        <div class="platform-grid">
          <div 
            v-for="platform in videoPlatforms" 
            :key="platform.name"
            class="platform-card"
            @click="handlePlatformClick(platform.name)"
          >
            <div class="platform-icon">{{ platform.icon }}</div>
            <div class="platform-name">{{ platform.name }}</div>
            <div class="visit-count">访问次数: {{ getVisitCount(platform.name) }}</div>
            <!-- 只允许删除非默认平台 -->
            <button 
              v-if="!platform.default" 
              class="delete-button"
              @click.stop="handleDeletePlatform('video', platform.name)"
              title="删除平台"
            >
              ×
            </button>
          </div>
        </div>
      </section>
      
      <!-- 漫画平台 -->
      <section class="platform-section">
        <h2>漫画平台</h2>
        <div class="platform-grid">
          <div 
            v-for="platform in comicPlatforms" 
            :key="platform.name"
            class="platform-card"
            @click="handlePlatformClick(platform.name)"
          >
            <div class="platform-icon">{{ platform.icon }}</div>
            <div class="platform-name">{{ platform.name }}</div>
            <div class="visit-count">访问次数: {{ getVisitCount(platform.name) }}</div>
            <!-- 只允许删除非默认平台 -->
            <button 
              v-if="!platform.default" 
              class="delete-button"
              @click.stop="handleDeletePlatform('comic', platform.name)"
              title="删除平台"
            >
              ×
            </button>
          </div>
        </div>
      </section>
      
      <!-- 访问记录 -->
      <section class="visits-section">
        <h2>访问记录</h2>
        <div class="visits-list">
          <div v-if="userStore.getUserVisits.length === 0" class="no-visits">
            暂无访问记录
          </div>
          <div 
            v-for="(visit, index) in userStore.getUserVisits" 
            :key="index"
            class="visit-item"
          >
            <span class="visit-platform">{{ visit.platform }}</span>
            <span class="visit-time">{{ formatDate(visit.timestamp) }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f8f9fa;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-info span {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

.logout-button {
  padding: 6px 12px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.logout-button:hover {
  background-color: #ff5252;
  transform: translateY(-1px);
}

/* 添加上传平台按钮 */
.add-platform-section {
  margin-bottom: 40px;
}

.add-button {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.add-button:hover {
  background-color: #35495e;
  transform: translateY(-1px);
}

/* 上传平台表单 */
.add-platform-form {
  margin-top: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-platform-form h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #42b883;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}

/* 图标选择器 */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-button {
  padding: 10px 15px;
  font-size: 1.5rem;
  background-color: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-button:hover {
  border-color: #42b883;
  background-color: #eafaf1;
}

.icon-button.active {
  border-color: #42b883;
  background-color: #42b883;
  color: white;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.submit-button {
  padding: 10px 25px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.submit-button:hover {
  background-color: #35495e;
}

.cancel-button {
  padding: 10px 25px;
  background-color: #f8f9fa;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

/* 错误信息 */
.error-message {
  color: #ff6b6b;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.platform-section {
  margin-bottom: 40px;
}

.platform-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #42b883;
  display: inline-block;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.platform-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.platform-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.platform-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.platform-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.visit-count {
  font-size: 0.9rem;
  color: #666;
}

/* 删除按钮 */
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  background-color: rgba(255, 107, 107, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  opacity: 0;
}

.platform-card:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background-color: #ff5252;
  transform: scale(1.1);
}

.visits-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #42b883;
  display: inline-block;
}

.visits-list {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.visit-item:last-child {
  border-bottom: none;
}

.visit-platform {
  font-weight: 500;
  color: #333;
}

.visit-time {
  color: #666;
  font-size: 0.9rem;
}

.no-visits {
  text-align: center;
  color: #999;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .platform-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .platform-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .user-info {
    align-self: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .icon-selector {
    gap: 5px;
  }
  
  .icon-button {
    padding: 8px 12px;
    font-size: 1.2rem;
  }
}
</style>