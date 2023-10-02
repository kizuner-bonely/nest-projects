import { useForm } from 'antd/es/form/Form'
// import {  navigate} from 'react-router-dom'
// import { message } from 'antd'
// import { axios } from '@utils'

// interface RegisterUser {
//   username: string
//   nickName: string
//   password: string
//   confirmPassword: string
//   email: string
//   captcha: string
// }

export default function useRegisterService() {
  const [form] = useForm()

  // const onFinish = async (values: RegisterUser) => {
  //   const { username, password } = values

  //   const res = await axios.post('/user/login', { username, password })
  //   const { message: msg, data } = res.data

  //   if ([200, 201].includes(res.status)) {
  //     message.success('登录成功')
  //     localStorage.setItem('access_token', data.access_token)
  //     localStorage.setItem('refresh_token', data.refresh_token)
  //     localStorage.setItem('user_info', JSON.stringify(data.userInfo))
  //   } else {
  //     message.error(data || '系统繁忙, 请稍后再试')
  //   }
  // }

  return { form }
}
