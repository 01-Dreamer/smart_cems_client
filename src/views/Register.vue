<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-header">
        <h2 class="title">账号注册</h2>
        <p class="subtitle">创建您的智慧校园账号</p>
      </div>
      
      <el-card class="register-card" shadow="hover">
        <el-form :model="registerForm" :rules="rules" ref="registerFormRef" size="large">
          <el-form-item prop="username">
            <el-input 
              v-model="registerForm.username" 
              placeholder="请输入用户名" 
              prefix-icon="User" 
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="请输入密码" 
              prefix-icon="Lock" 
              show-password 
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="registerForm.confirmPassword" 
              type="password" 
              placeholder="请确认密码" 
              prefix-icon="Lock" 
              show-password 
            />
          </el-form-item>

          <el-form-item prop="code">
            <div style="display: flex; width: 100%; gap: 10px;">
              <el-input 
                v-model="registerForm.code" 
                placeholder="邮箱验证码" 
                prefix-icon="Message" 
              />
              <el-button type="primary" :disabled="isCounting" @click="handleGetCode">
                {{ isCounting ? `${count}s后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="loading" class="register-btn" @click="handleRegister">
              立即注册
            </el-button>
          </el-form-item>
          
          <div class="login-link">
            <span>已有账号？</span>
            <el-link type="primary" @click="$router.push('/login')">去登录</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register, getEmailCode } from '@/api/auth'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const isCounting = ref(false)
const count = ref(60)

const registerForm = reactive({
  username: '', // 用户名即邮箱
  password: '',
  confirmPassword: '',
  code: ''
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入邮箱/用户名', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const handleGetCode = async () => {
  if (!registerForm.username) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.username)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }

  try {
    await getEmailCode(registerForm.username)
    ElMessage.success('验证码已发送')
    isCounting.value = true
    const timer = setInterval(() => {
      count.value--
      if (count.value <= 0) {
        clearInterval(timer)
        isCounting.value = false
        count.value = 60
      }
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 移除 confirmPassword 字段再发送请求
        const { confirmPassword, ...params } = registerForm
        await register(params)
        ElMessage.success('注册成功，即将跳转登录页')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f4037 0%, #99f2c8 100%); /* Example gradient */
  background-size: cover;
}

.register-content {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.register-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.register-btn {
  width: 100%;
  font-size: 16px;
  padding: 12px 0;
  margin-top: 10px;
}

.login-link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #606266;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>
