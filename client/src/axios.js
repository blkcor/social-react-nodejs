import axios from 'axios'

export const makeRequest = axios.create({
  baseURL: 'http://localhost:8088/api',
  withCredentials: true
})
