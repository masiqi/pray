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

export function deleteSchedule(data) {
  return request({
    url: '/schedule/' + data,
    method: 'delete'
  })
}
