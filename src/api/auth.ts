import request from '@/utils/request'

export function login(data: any) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function register(data: any) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getCaptchaImage() {
  return request({
    url: '/auth/captcha/image',
    method: 'get'
  })
}

export function getEmailCode(email: string) {
  return request({
    url: '/auth/captcha/email',
    method: 'get',
    params: { email }
  })
}
