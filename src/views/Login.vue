<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <div class="logo-area">
          <el-icon class="logo-icon" :size="48"><DataLine /></el-icon>
        </div>
        <h1 class="title">智慧校园能耗监测平台</h1>
        <p class="subtitle">Smart Campus Energy Management System</p>
      </div>
      
      <el-card class="login-card" shadow="hover">
        <div class="card-title">欢迎登录</div>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" size="large">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名" 
              prefix-icon="User" 
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              prefix-icon="Lock" 
              show-password 
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="code">
            <div style="display: flex; width: 100%; gap: 10px;">
              <el-input 
                v-model="loginForm.code" 
                placeholder="验证码" 
                prefix-icon="Key" 
                @keyup.enter="handleLogin"
              />
              <div class="captcha-box" @click="refreshCaptcha">
                <img v-if="captchaBase64" :src="captchaBase64" alt="验证码" style="width: 100px; height: 40px; cursor: pointer;" />
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
              登 录
            </el-button>
          </el-form-item>
          
          <div class="register-link">
            <span>还没有账号？</span>
            <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
          </div>
        </el-form>
      </el-card>
      
      <div class="footer-copyright">
        &copy; 2026 Smart Campus System. All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login, getCaptchaImage } from '@/api/auth'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaBase64 = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  uuid: '',
  code: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const refreshCaptcha = async () => {
  try {
    const res: any = await getCaptchaImage()
    captchaBase64.value = res.base64Img
    loginForm.uuid = res.uuid
  } catch (error) {
    console.error(error)
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res: any = await login(loginForm)
        userStore.setToken(res.token)
        userStore.setUserInfo(res.username, res.role)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        console.error(error)
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
  position: relative;
  overflow: hidden;
}

/* Optional: Add some background shapes */
.login-container::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
}

.login-content {
  width: 100%;
  max-width: 460px;
  padding: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.logo-area {
  margin-bottom: 15px;
  display: inline-flex;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  backdrop-filter: blur(5px);
}

.logo-icon {
  color: #fff;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-card {
  width: 100%;
  border-radius: 16px;
  border: none;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 25px;
  text-align: center;
}

.login-btn {
  width: 100%;
  font-size: 16px;
  padding: 12px 0;
  margin-top: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #4e4376 0%, #2b5876 100%);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(43, 88, 118, 0.4);
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.footer-copyright {
  margin-top: 40px;
  color: rgba(255,255,255,0.5);
  font-size: 12px;
}
</style>
