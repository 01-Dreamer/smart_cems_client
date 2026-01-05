<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="Plus" @click="handleCreate">添加设备</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="设备名称" />
      <el-table-column prop="sn" label="设备SN" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ONLINE' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ratedPower" label="额定功率(W)" />
      <el-table-column prop="buildingId" label="所属建筑ID" />
      <el-table-column prop="roomNo" label="房间号" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form :model="temp" :rules="rules" ref="dataForm" label-width="120px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="设备SN" prop="sn">
          <el-input v-model="temp.sn" placeholder="唯一序列号" />
        </el-form-item>
        <el-form-item label="额定功率(W)" prop="ratedPower">
          <el-input-number v-model="temp.ratedPower" :min="0" />
        </el-form-item>
        <el-form-item label="所属建筑" prop="buildingId">
          <el-select v-model="temp.buildingId" placeholder="请选择建筑">
            <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="temp.roomNo" />
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
import { getMeterList, addMeter } from '@/api/meter'
import { getBuildingList } from '@/api/building'
import { ElMessage } from 'element-plus'

const list = ref([])
const buildingList = ref<any[]>([])
const listLoading = ref(true)
const dialogFormVisible = ref(false)
const dialogStatus = ref('create')
const textMap: any = {
  create: '添加设备'
}

const temp = reactive({
  name: '',
  sn: '',
  status: 'ONLINE',
  ratedPower: 1000,
  buildingId: undefined,
  roomNo: ''
})

const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  sn: [{ required: true, message: '请输入设备SN', trigger: 'blur' }],
  ratedPower: [{ required: true, message: '请输入额定功率', trigger: 'blur' }],
  buildingId: [{ required: true, message: '请选择所属建筑', trigger: 'change' }],
  roomNo: [{ required: true, message: '请输入房间号', trigger: 'blur' }]
}

const dataForm = ref()

const fetchData = async () => {
  listLoading.value = true
  try {
    const res: any = await getMeterList()
    list.value = res
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const fetchBuildings = async () => {
  try {
    const res: any = await getBuildingList()
    buildingList.value = res
  } catch (error) {
    console.error(error)
  }
}

const handleCreate = () => {
  temp.name = ''
  temp.sn = ''
  temp.status = 'ONLINE'
  temp.ratedPower = 1000
  temp.buildingId = undefined
  temp.roomNo = ''
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
        await addMeter(temp)
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
  fetchBuildings()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
