import request from '@/utils/request'

export function getEnergyList() {
  return request({
    url: '/energy/list',
    method: 'get'
  })
}
