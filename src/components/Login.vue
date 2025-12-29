<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const rememberUsername = ref(false);
const error = ref('');

// 页面加载时检查是否有记住的用户名
onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername');
  if (savedUsername) {
    username.value = savedUsername;
    rememberUsername.value = true;
  }
});

const handleLogin = () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  // 简单的登录验证（实际项目中应该连接后端API）
  if (userStore.login(username.value, password.value)) {
    // 如果勾选了记住用户名，就保存到localStorage
    if (rememberUsername.value) {
      localStorage.setItem('rememberedUsername', username.value);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
    router.push('/home');
  } else {
    error.value = '用户名或密码错误';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="请输入密码"
        />
      </div>
      <div class="form-group remember-me">
        <input 
          type="checkbox" 
          id="remember" 
          v-model="rememberUsername"
        />
        <label for="remember">记住用户名</label>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button class="login-button" @click="handleLogin">登录</button>
      <div class="register-link">
        还没有账号？<span @click="router.push('/register')">立即注册</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me input {
  width: auto;
  margin-right: 8px;
}

.remember-me label {
  margin-bottom: 0;
  cursor: pointer;
}

.error-message {
  color: #ff4444;
  margin-bottom: 1rem;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #35495e;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.register-link span {
  color: #42b883;
  cursor: pointer;
  font-weight: 500;
}

.register-link span:hover {
  text-decoration: underline;
}
</style>