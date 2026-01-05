<template>
  <div class="app-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>欢迎回来，管理员</h2>
        <p>这里是智慧能耗云平台的统计分析中心，您可以查看实时能耗趋势和设备告警信息。</p>
      </div>
      <div class="welcome-img">
        <!-- 可以放一个SVG或者图片 -->
      </div>
    </div>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card class="box-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><TrendCharts /></el-icon>
                <span>设备历史趋势</span>
              </div>
              <div class="header-actions">
                <el-input 
                  v-model="trendSn" 
                  placeholder="输入设备SN查询" 
                  size="default" 
                  prefix-icon="Search"
                  style="width: 200px; margin-right: 10px;" 
                  clearable
                />
                <el-button type="primary" icon="Search" @click="() => { loadTrend(); loadAlerts(); }">查询</el-button>
              </div>
            </div>
          </template>
          <div id="trendChart" style="height: 350px;"></div>
          
          <div v-if="trendSn" class="alert-section">
            <div class="section-title">
              <el-icon><Bell /></el-icon> 最新告警记录
            </div>
            <el-table 
              :data="deviceAlerts" 
              size="small" 
              style="width: 100%" 
              height="200" 
              :empty-text="'暂无告警'"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column prop="triggerTime" label="时间" width="180">
                <template #default="{ row }">
                  {{ formatDate(row.triggerTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="alertType" label="类型" width="120">
                <template #default="{ row }">
                  <el-tag type="danger" size="small" effect="light">{{ row.alertType }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="alertValue" label="数值" width="100">
                <template #default="{ row }">
                  <span style="font-weight: bold; color: #f56c6c;">{{ row.alertValue }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="details" label="详情" show-overflow-tooltip />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><PieChart /></el-icon>
                <span>建筑今日用电占比</span>
              </div>
            </div>
          </template>
          <div id="shareChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getTrend, getBuildingShare } from '@/api/stats'
import { getAlertList } from '@/api/alert'

const trendSn = ref('')
const deviceAlerts = ref([])
let trendChart: any = null
let shareChart: any = null
let timer: any = null

const initCharts = () => {
  const trendDom = document.getElementById('trendChart')
  if (trendDom) {
    trendChart = echarts.init(trendDom)
  }
  const shareDom = document.getElementById('shareChart')
  if (shareDom) {
    shareChart = echarts.init(shareDom)
  }
}

// 格式化日期时间
const formatDate = (val: string | number | Date) => {
  const date = new Date(val)
  const now = new Date()
  
  const isToday = date.toDateString() === now.toDateString()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  const s = date.getSeconds().toString().padStart(2, '0')
  const timeStr = `${h}:${m}:${s}`

  if (isToday) return timeStr
  
  const M = (date.getMonth() + 1).toString().padStart(2, '0')
  const D = date.getDate().toString().padStart(2, '0')
  
  if (isThisYear) return `${M}-${D} ${timeStr}`
  
  return `${date.getFullYear()}-${M}-${D} ${timeStr}`
}

// 加载趋势数据
const loadTrend = async () => {
  if (!trendSn.value) return
  try {
    const res: any = await getTrend({ sn: trendSn.value })
    
    const data = res.map((item: any) => {
      return {
        name: item.collectTime,
        value: [
          item.collectTime,
          item.power
        ]
      }
    })

    const option = {
      title: { 
        text: '功率变化趋势',
        textStyle: { fontSize: 14, fontWeight: 'normal', color: '#909399' },
        left: 'center',
        top: 10
      },
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: { color: '#333' },
        formatter: (params: any) => {
          if (!params || params.length === 0) return ''
          const p = params[0]
          return `<div style="font-weight:bold;margin-bottom:5px;">${formatDate(p.value[0])}</div>
                  ${p.marker} <span style="color:#666">${p.seriesName}:</span> 
                  <span style="font-weight:bold;color:#409EFF">${p.value[1]} W</span>`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: { 
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: (value: any) => formatDate(value),
          color: '#909399'
        },
        axisLine: { lineStyle: { color: '#E4E7ED' } },
        splitLine: { show: false }
      },
      yAxis: { 
        type: 'value', 
        name: '功率(W)',
        nameTextStyle: { color: '#909399' },
        axisLabel: { color: '#909399' },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E4E7ED'
          }
        }
      },
      series: [{ 
        name: '功率',
        data: data, 
        type: 'line', 
        smooth: true,
        showSymbol: false,
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.01)' }
          ])
        }
      }],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }
    trendChart.setOption(option)
  } catch (error) {
    console.error(error)
  }
}

// 加载告警数据
const loadAlerts = async () => {
  if (!trendSn.value) return
  try {
    const res: any = await getAlertList({ sn: trendSn.value, page: 1, size: 5 })
    deviceAlerts.value = res.records || []
  } catch (error) {
    console.error(error)
  }
}

// 加载建筑用电占比
const loadShare = async () => {
  try {
    const res: any = await getBuildingShare()
    // 假设后端返回 Map 或 List 结构，这里做兼容处理
    let data = []
    if (Array.isArray(res)) {
        data = res
    } else if (typeof res === 'object') {
        data = Object.keys(res).map(key => ({ name: key, value: res[key] }))
    }

    const option = {
      title: { 
        text: '用电量占比', 
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: '600', color: '#303133' }
      },
      tooltip: { trigger: 'item' },
      legend: { 
        orient: 'vertical', 
        left: 'left',
        textStyle: { color: '#606266' }
      },
      series: [
        {
          name: '用电量',
          type: 'pie',
          radius: ['40%', '70%'], // 环形图看起来更高级
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
    shareChart.setOption(option)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    loadShare()
    // Pre-fill SN if needed or just wait for user input
    // trendSn.value = 'METER_2025_001'
    // loadTrend()
  })
  
  window.addEventListener('resize', () => {
    trendChart?.resize()
    shareChart?.resize()
  })

  // 每5秒轮询一次趋势数据和告警
  timer = setInterval(() => {
    if (trendSn.value) {
      loadTrend()
      loadAlerts()
    }
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  window.removeEventListener('resize', () => {
    trendChart?.resize()
    shareChart?.resize()
  })
})
</script>

<style scoped>
.app-container {
  padding: 0;
}
.welcome-banner {
  background: linear-gradient(135deg, #409EFF 0%, #3a8ee6 100%);
  color: #fff;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
.welcome-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}
.welcome-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}
.box-card {
  border: none;
  border-radius: 8px;
  transition: all 0.3s;
}
.box-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05) !important;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.header-title .el-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #409EFF;
}
.header-actions {
  display: flex;
  align-items: center;
}
.alert-section {
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}
.section-title .el-icon {
  margin-right: 6px;
  color: #F56C6C;
}
.notice-list {
  padding: 10px 0;
}
.notice-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}
.notice-tag {
  background-color: #ecf5ff;
  color: #409EFF;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
}
.notice-tag.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.notice-content {
  color: #606266;
}
</style>
