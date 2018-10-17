import request from '@/utils/request'

export function listSchedule(params) {
  return request({
    url: '/schedules',
    method: 'get',
    params
  })
}

export function createSchedule(params) {
  return request({
    url: '/schedule',
    method: 'post',
    data: params
  })
}

export function updateSchedule(data, params) {
  return request({
    url: '/schedule/' + data,
    method: 'put',
    data: params
  })
}

export function createImage(data, params) {
  return request({
    url: '/image/' + data,
    method: 'post',
    data: params
  })
}

export function deleteImage(data, params) {
  return request({
    url: '/image/' + data,
    method: 'delete',
    data: params
  })
}

export function deleteSchedule(data) {
  return request({
    url: '/schedule/' + data,
    method: 'delete'
  })
}

export function getSchedule(data) {
  return request({
    url: '/schedule/' + data,
    method: 'get'
  })
}
