<template>
  <div class="app-container">
    <div class="filter-container">
      <el-alert
        title="数据每5秒自动刷新"
        type="success"
        :closable="false"
        show-icon
        style="width: 200px; display: inline-flex; margin-right: 10px;"
      />
      <el-button type="primary" icon="Refresh" @click="fetchData">手动刷新</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="meterId" label="设备ID" width="100" />
      <el-table-column prop="voltage" label="电压(V)" />
      <el-table-column prop="current" label="电流(A)" />
      <el-table-column prop="power" label="功率(W)" />
      <el-table-column prop="totalConsumption" label="累计用电量(kWh)" />
      <el-table-column prop="collectTime" label="采集时间">
        <template #default="{ row }">
          {{ formatDate(row.collectTime) }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top: 20px; text-align: right;">
      <el-pagination
        v-model:current-page="listQuery.page"
        v-model:page-size="listQuery.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { getEnergyList } from '@/api/energy'

const list = ref([])
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  size: 10
})
let timer: any = null

const formatDate = (val: string) => {
  if (!val) return ''
  return val.replace('T', ' ').split('.')[0]
}

const fetchData = async () => {
  // 首次加载显示loading，轮询时不显示
  if (!timer) listLoading.value = true
  try {
    const res: any = await getEnergyList(listQuery)
    list.value = res.records
    total.value = res.total
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  listQuery.size = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  listQuery.page = val
  fetchData()
}

onMounted(() => {
  fetchData()
  timer = setInterval(fetchData, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
