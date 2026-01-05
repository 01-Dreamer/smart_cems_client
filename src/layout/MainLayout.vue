<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside-container">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <div class="logo">
          <el-icon class="logo-icon"><ElementPlus /></el-icon>
          <span>智慧能耗云平台</span>
        </div>
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>统计分析</span>
        </el-menu-item>
        <el-menu-item index="/buildings">
          <el-icon><OfficeBuilding /></el-icon>
          <span>建筑管理</span>
        </el-menu-item>
        <el-menu-item index="/devices">
          <el-icon><Monitor /></el-icon>
          <span>设备管理</span>
        </el-menu-item>
        <el-menu-item index="/realtime">
          <el-icon><Odometer /></el-icon>
          <span>实时监控</span>
        </el-menu-item>
        <el-menu-item index="/alerts">
          <el-icon><Warning /></el-icon>
          <span>告警记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <div class="avatar-wrapper">
            <el-avatar :size="30" icon="UserFilled" style="margin-right: 8px; background-color: #409EFF;" />
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userStore.username }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await logout()
    } catch (error) {
      console.error(error)
    } finally {
      userStore.logout()
      router.push('/login')
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.aside-container {
  background-color: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 10;
}
.el-menu-vertical {
  height: 100%;
  border-right: none;
}
.logo {
  height: 60px;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  background-color: #2b3649;
  overflow: hidden;
}
.logo-icon {
  margin-right: 10px;
  font-size: 24px;
  color: #409EFF;
}
.header {
  background-color: #fff;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 9;
}
.header-right {
  display: flex;
  align-items: center;
}
.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
}
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-x: hidden;
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
