import request from '@/utils/request'

export function getTrend(params: any) {
  return request({
    url: '/stats/trend',
    method: 'get',
    params
  })
}

export function getBuildingShare() {
  return request({
    url: '/stats/building-share',
    method: 'get'
  })
}
