<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>设备历史趋势 (最近10条)</span>
              <div style="float: right;">
                <el-input v-model="trendSn" placeholder="输入设备SN" size="small" style="width: 150px; margin-right: 10px;" />
                <el-button type="primary" size="small" @click="loadTrend">查询</el-button>
              </div>
            </div>
          </template>
          <div id="trendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>建筑今日用电占比</span>
            </div>
          </template>
          <div id="shareChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getTrend, getBuildingShare } from '@/api/stats'

const trendSn = ref('')
let trendChart: any = null
let shareChart: any = null

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

const loadTrend = async () => {
  if (!trendSn.value) return
  try {
    const res: any = await getTrend({ sn: trendSn.value })
    // res is Array of EnergyData
    // x-axis: collectTime, y-axis: power
    const dates = res.map((item: any) => item.collectTime)
    const powers = res.map((item: any) => item.power)

    const option = {
      title: { text: '功率变化趋势' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates },
      yAxis: { type: 'value', name: '功率(W)' },
      series: [{ data: powers, type: 'line', smooth: true }]
    }
    trendChart.setOption(option)
  } catch (error) {
    console.error(error)
  }
}

const loadShare = async () => {
  try {
    const res: any = await getBuildingShare()
    // res is Map<String, Object> or List<Map> ?
    // Docs say ResultListMapStringObject, example data is []
    // Assuming it returns array of { name: 'BuildingName', value: 123.45 }
    // If the backend returns a Map, axios might convert it to object.
    // Let's assume the structure is compatible with ECharts pie data: { name: string, value: number }[]
    
    // If the API returns a Map (object in JS), we need to convert it.
    // But the doc says "ResultListMapStringObject", so it's likely [{name: '...', value: ...}, ...] or similar.
    // Let's assume it's an array of objects suitable for ECharts or we map it.
    // If it's { "BuildingA": 100, "BuildingB": 200 }, we map to [{name: "BuildingA", value: 100}, ...]
    
    let data = []
    if (Array.isArray(res)) {
        data = res
    } else if (typeof res === 'object') {
        data = Object.keys(res).map(key => ({ name: key, value: res[key] }))
    }

    const option = {
      title: { text: '用电量占比', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '用电量',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.box-card {
  margin-bottom: 20px;
}
</style>
