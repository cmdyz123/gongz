import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

// 导入组件
const Login = () => import('../components/Login.vue');
const Register = () => import('../components/Register.vue');
const Home = () => import('../components/Home.vue');
const PlatformDetail = () => import('../components/PlatformDetail.vue');

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { 
    path: '/home', 
    name: 'Home', 
    component: Home,
    meta: { requiresAuth: true } // 需要登录才能访问
  },
  { 
    path: '/platform/:name', 
    name: 'PlatformDetail', 
    component: PlatformDetail,
    meta: { requiresAuth: true } // 需要登录才能访问
  },
  // 重定向到登录页
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 初始化用户状态
  if (!userStore.isLoggedIn) {
    userStore.initializeUser();
  }
  
  // 检查是否需要登录
  if (requiresAuth && !userStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;