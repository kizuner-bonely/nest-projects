import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000,
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => err.response
)

export default axiosInstance
