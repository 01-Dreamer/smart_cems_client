import request from '@/utils/request'

export function getBuildingList() {
  return request({
    url: '/building/list',
    method: 'get'
  })
}

export function addBuilding(data: any) {
  return request({
    url: '/building/add',
    method: 'post',
    data
  })
}
