<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sn" placeholder="设备SN" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="meterId" label="设备ID" width="100" />
      <el-table-column prop="alertType" label="告警类型" />
      <el-table-column prop="alertValue" label="告警数值" />
      <el-table-column prop="details" label="详情" />
      <el-table-column prop="triggerTime" label="触发时间" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAlertList } from '@/api/alert'

const list = ref([])
const listLoading = ref(true)
const listQuery = reactive({
  sn: ''
})

const fetchData = async () => {
  listLoading.value = true
  try {
    const res: any = await getAlertList(listQuery)
    list.value = res
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const handleFilter = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
}
.filter-item {
  margin-right: 10px;
}
</style>
