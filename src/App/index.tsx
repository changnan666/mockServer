import React, { useEffect, useState } from 'react'
import styles from './index.scss'
import { Typography, Button, Modal, Form, Input } from 'antd'
import 'antd/dist/antd.css'
import { get, api } from '../utils'

const { Title } = Typography

const App = () => {
	const [config, setConfig] = useState<Config[]>([])
	const [visible, setVisible] = useState(false)

	const onFinish = (values: any) => {
		get(api.createProject, values).then(() => {
			setVisible(true)
		})
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}

	useEffect(() => {
		get<Config[]>(api.getAllConfig).then(res => {
			setConfig(res.data)
		})
	}, [])

	return (
		<div className={styles.container}>
			<div className='head'>
				<Title>Mock Server</Title>
				<Button size='large' type='primary' onClick={() => setVisible(true)}>
					创建项目
				</Button>
			</div>
			<div className='body'>
				{config.map((item, i) => (
					<div key={i} className='project-name'>
						<div className='container'>
							<span>{item.projectName}</span>
						</div>
					</div>
				))}
			</div>
			<Modal
				title='创建项目'
				centered
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={false}
			>
				<Form
					name='basic'
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					labelCol={{ span: 4 }}
				>
					<Form.Item
						label='项目名称'
						name='projectName'
						rules={[{ required: true, message: '项目名称不能为空' }]}
					>
						<Input autoFocus autoComplete='off' />
					</Form.Item>

					<Form.Item
						label='地址前缀'
						name='baseUrl'
						rules={[{ required: true, message: '地址前缀不能为空' }]}
					>
						<Input autoComplete='off' />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' style={{ float: 'right' }}>
							确定
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default App
