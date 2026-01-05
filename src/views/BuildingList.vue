<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="Plus" @click="handleCreate">添加建筑</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="建筑名称" />
      <el-table-column prop="locationCode" label="位置编号" />
      <el-table-column prop="totalFloors" label="楼层数" />
      <el-table-column prop="usageType" label="用途分类" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form :model="temp" :rules="rules" ref="dataForm" label-width="100px">
        <el-form-item label="建筑名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="位置编号" prop="locationCode">
          <el-input v-model="temp.locationCode" />
        </el-form-item>
        <el-form-item label="楼层数" prop="totalFloors">
          <el-input-number v-model="temp.totalFloors" :min="1" />
        </el-form-item>
        <el-form-item label="用途分类" prop="usageType">
          <el-select v-model="temp.usageType" placeholder="请选择">
            <el-option label="教学楼" value="教学楼" />
            <el-option label="宿舍楼" value="宿舍楼" />
            <el-option label="办公楼" value="办公楼" />
            <el-option label="图书馆" value="图书馆" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getBuildingList, addBuilding } from '@/api/building'
import { ElMessage } from 'element-plus'

const list = ref([])
const listLoading = ref(true)
const dialogFormVisible = ref(false)
const dialogStatus = ref('create')
const textMap: any = {
  create: '添加建筑'
}

const temp = reactive({
  name: '',
  locationCode: '',
  totalFloors: 1,
  usageType: ''
})

const rules = {
  name: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
  locationCode: [{ required: true, message: '请输入位置编号', trigger: 'blur' }],
  usageType: [{ required: true, message: '请选择用途分类', trigger: 'change' }]
}

const dataForm = ref()

const fetchData = async () => {
  listLoading.value = true
  try {
    const res: any = await getBuildingList()
    list.value = res
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const handleCreate = () => {
  temp.name = ''
  temp.locationCode = ''
  temp.totalFloors = 1
  temp.usageType = ''
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
  if (dataForm.value) {
    dataForm.value.clearValidate()
  }
}

const createData = async () => {
  if (!dataForm.value) return
  await dataForm.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await addBuilding(temp)
        dialogFormVisible.value = false
        ElMessage.success('添加成功')
        fetchData()
      } catch (error) {
        console.error(error)
      }
    }
  })
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
