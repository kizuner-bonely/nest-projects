import { Button, Form, Input, message } from 'antd'
import to from 'await-to-js'
import axios from 'axios'

export default function App() {
  const [form] = Form.useForm()

  const login = async (values: Record<string, any>) => {
    const [err, res] = await to(
      axios.post('http://localhost:3000/user/login', {
        email: values.email,
        code: values.code,
      })
    )
    if (err) {
      console.log(err)
      message.error(err.toString())
    }

    if (res!.data === 'success') {
      message.success('登录成功')
    }
  }

  const getEmailCode = () => {
    const email = form.getFieldValue('email')
    if (!email) {
      message.error('邮箱不能为空')
      return
    }

    axios
      .get(`http://localhost:3000/email/code?address=${email}`)
      .then((res) => {
        console.log(res)
        message.success('获取成功, 请查看邮箱')
      })
      .catch(() => {
        console.log('获取邮箱验证码失败')
        message.error('获取失败, 请稍后再试')
      })
  }

  return (
    <div style={{ width: 500, margin: '100px auto' }}>
      <Form form={form} onFinish={login}>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入邮箱地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button onClick={getEmailCode}>发送验证码</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
