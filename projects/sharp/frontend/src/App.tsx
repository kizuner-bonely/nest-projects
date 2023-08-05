import { useState } from 'react'
import { message, Button, Form, Input, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import axios from 'axios'

type FormValues = {
  color: number
  level: number
}

const { Dragger } = Upload

function App() {
  const [form] = Form.useForm()
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')

  const compress = async (values: FormValues) => {
    const { color, level } = values

    const res = await axios.get('http://localhost:3005/compression', {
      params: {
        color,
        level,
        path: filePath,
      },
      responseType: 'arraybuffer',
    })

    const blob = new Blob([res.data], { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    message.success('压缩成功')
  }

  return (
    <Form
      form={form}
      onFinish={compress}
      style={{ width: 500, margin: '50px auto' }}
    >
      <Form.Item label="颜色数量" name="color">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="压缩级别" name="level">
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Dragger
          name="file"
          action="http://localhost:3005/upload"
          onChange={(info) => {
            const { name, response, status } = info.file
            if (status === 'done') {
              setFilename(name)
              setFilePath(response)
              message.success(`${name} 文件上传成功`)
            } else if (status === 'error') {
              message.error(`${name} 文件上传失败`)
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant=upload-text">点击或拖拽文件到这个区域来上传</p>
        </Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          压缩
        </Button>
      </Form.Item>
    </Form>
  )
}

export default App
