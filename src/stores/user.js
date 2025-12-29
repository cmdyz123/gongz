import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    // 存储用户信息和访问次数
    users: JSON.parse(localStorage.getItem('users')) || [],
    // 存储平台信息，包含默认平台和用户自定义平台
    platforms: JSON.parse(localStorage.getItem('platforms')) || {
      video: [
        { name: '抖音', url: 'https://www.douyin.com/', icon: '🎥', default: true },
        { name: 'Bilibili', url: 'https://www.bilibili.com/', icon: '📺', default: true },
        { name: '腾讯视频', url: 'https://v.qq.com/', icon: '🎬', default: true },
        { name: '爱奇艺', url: 'https://www.iqiyi.com/', icon: '🎞️', default: true },
        { name: '优酷', url: 'https://www.youku.com/', icon: '🎭', default: true },
      ],
      comic: [
        { name: '腾讯动漫', url: 'https://ac.qq.com/', icon: '📖', default: true },
        { name: '哔哩哔哩漫画', url: 'https://manga.bilibili.com/', icon: '📚', default: true },
        { name: '爱奇艺漫画', url: 'https://manhua.iqiyi.com/', icon: '🎨', default: true },
        { name: '快看漫画', url: 'https://www.kuaikanmanhua.com/', icon: '🖌️', default: true },
        { name: '漫画台', url: 'https://www.manhuatai.com/', icon: '📜', default: true },
      ]
    }
  }),
  
  getters: {
    isLoggedIn: (state) => state.currentUser !== null,
    getUserVisits: (state) => {
      if (!state.currentUser) return [];
      const user = state.users.find(u => u.username === state.currentUser);
      return user ? user.visits : [];
    },
    getVideoPlatforms: (state) => state.platforms.video,
    getComicPlatforms: (state) => state.platforms.comic
  },
  
  actions: {
    // 登录功能
    login(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password);
      if (user) {
        this.currentUser = username;
        localStorage.setItem('currentUser', username);
        return true;
      }
      return false;
    },
    
    // 注册功能
    register(username, password) {
      if (this.users.find(u => u.username === username)) {
        return false;
      }
      
      this.users.push({
        username,
        password,
        visits: [], // 存储访问记录
      });
      
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    },
    
    // 登出功能
    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    
    // 初始化用户状态
    initializeUser() {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = savedUser;
      }
    },
    
    // 记录平台访问
    addVisit(platformName) {
      if (!this.currentUser) return;
      
      const userIndex = this.users.findIndex(u => u.username === this.currentUser);
      if (userIndex !== -1) {
        this.users[userIndex].visits.push({
          platform: platformName,
          timestamp: new Date().toISOString(),
        });
        
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    },
    
    // 获取特定平台的访问次数
    getPlatformVisitCount(platformName) {
      if (!this.currentUser) return 0;
      
      const user = this.users.find(u => u.username === this.currentUser);
      if (!user) return 0;
      
      return user.visits.filter(v => v.platform === platformName).length;
    },
    
    // 添加自定义平台
    addCustomPlatform(type, platform) {
      if (type !== 'video' && type !== 'comic') return false;
      
      // 检查平台名称是否已存在
      const exists = this.platforms[type].some(p => p.name === platform.name);
      if (exists) return false;
      
      // 添加新平台
      this.platforms[type].push({
        ...platform,
        default: false
      });
      
      // 保存到localStorage
      localStorage.setItem('platforms', JSON.stringify(this.platforms));
      return true;
    },
    
    // 删除自定义平台
    deleteCustomPlatform(type, platformName) {
      if (type !== 'video' && type !== 'comic') return false;
      
      // 只允许删除非默认平台
      this.platforms[type] = this.platforms[type].filter(p => 
        p.default || p.name !== platformName
      );
      
      // 保存到localStorage
      localStorage.setItem('platforms', JSON.stringify(this.platforms));
      return true;
    }
  },
});