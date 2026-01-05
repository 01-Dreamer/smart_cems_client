<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="Refresh" @click="fetchData">刷新数据</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="meterId" label="设备ID" width="100" />
      <el-table-column prop="voltage" label="电压(V)" />
      <el-table-column prop="current" label="电流(A)" />
      <el-table-column prop="power" label="功率(W)" />
      <el-table-column prop="totalConsumption" label="累计用电量(kWh)" />
      <el-table-column prop="collectTime" label="采集时间" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEnergyList } from '@/api/energy'

const list = ref([])
const listLoading = ref(true)

const fetchData = async () => {
  listLoading.value = true
  try {
    const res: any = await getEnergyList()
    list.value = res
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
