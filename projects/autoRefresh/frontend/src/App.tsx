import { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

interface PendingTask {
  config: AxiosRequestConfig
  resolve: (value: unknown) => void
}

let refreshing = false
const queue: PendingTask[] = []

async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
  })

  const { access_token, refresh_token } = res.data
  localStorage.setItem('access_token', access_token || '')
  localStorage.setItem('refresh_token', refresh_token || '')
  return res
}

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    const { data, config } = err.response

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({ config, resolve })
      })
    }

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
      refreshing = true
      const res = await refreshToken()
      refreshing = false

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => resolve(axios(config)))
        return axios(config)
      } else {
        alert('登录过期, 请重新登录')
        return Promise.reject(res.data)
      }
    } else {
      return err.response
    }
  }
)

function App() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const login = async () => {
    const res = await axios.post('http://localhost:3000/user/login', {
      username: 'aaa',
      password: 'bbb',
    })

    const { access_token, refresh_token } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
  }

  const query = async () => {
    if (!localStorage.getItem('access_token')) {
      await login()
    }

    const { data: aData } = await axios.get('http://localhost:3000/aaa')
    const { data: bData } = await axios.get('http://localhost:3000/bbb')
    axios.get('http://localhost:3000/bbb')
    axios.get('http://localhost:3000/bbb')

    setA(aData)
    setB(bData)
  }

  useEffect(() => {
    query()
  }, [])

  return (
    <div>
      <p>{a}</p>
      <p>{b}</p>
    </div>
  )
}

export default App
