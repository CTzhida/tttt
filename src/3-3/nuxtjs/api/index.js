import { request } from '@/plugins/request.js'

export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}

export const getProfiles = (username) => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}
