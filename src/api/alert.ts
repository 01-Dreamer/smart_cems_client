import request from '@/utils/request'

export function getAlertList(params: any) {
  return request({
    url: '/alert/list',
    method: 'get',
    params
  })
}
