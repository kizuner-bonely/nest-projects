import { message } from 'antd'
import { axios } from '@utils'

interface LoginUser {
  username: string
  password: string
}

export default function useLoginService() {
  const onFinish = async (values: LoginUser) => {
    const res = await axios.post('/user/login', values)
    const { status, data } = res

    if ([200, 201].includes(status)) {
      message.success('登录成功')

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
    } else {
      message.error(data.data || '系统繁忙, 请稍后再试')
    }
  }

  return { onFinish }
}
