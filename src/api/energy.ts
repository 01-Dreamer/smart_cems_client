import request from '@/utils/request'

export function getEnergyList(params: any) {
  return request({
    url: '/energy/list',
    method: 'get',
    params
  })
}
