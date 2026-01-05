import request from '@/utils/request'

export function getMeterList() {
  return request({
    url: '/meter/list',
    method: 'get'
  })
}

export function addMeter(data: any) {
  return request({
    url: '/meter/add',
    method: 'post',
    data
  })
}
