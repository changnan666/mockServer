import React, { useEffect, useRef, useState } from 'react'
import styles from './index.scss'
import { Typography, Button, Modal, Form, Input, Menu, Dropdown } from 'antd'
import 'antd/dist/antd.css'
import { get, api } from '../utils'
import { FormInstance } from 'antd/lib/form'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Title } = Typography

const App = () => {
	const [config, setConfig] = useState<Config[]>([])
	const [visible, setVisible] = useState(false)

	const formRef = useRef<FormInstance | null>(null)
	const inputRef = useRef<Input | null>(null)

	const onSubmit = (values: any) => {
		if (values.projectName.trim() === '') {
			return
		}
		get(api.createProject, values).then(res => {
			values.id = res.data
			config.push(values)

			setConfig([...config])
			setVisible(false)
		})
	}

	const onMenuClick = (e: any, id: string) => {
		switch (e.key) {
			case 'rename':
				break
			case 'delete':
				Modal.confirm({
					content: '是否确认删除？',
					onOk() {
						get(api.deleteProject, { id }).then(() => {
							const index = config.findIndex(item => item.id === id)
							config.splice(index, 1)
							setConfig([...config])
						})
					},
				})
				break
		}
	}

	useEffect(() => {
		get<Config[]>(api.getAllConfig).then(res => {
			setConfig(res.data)
		})
	}, [])

	useEffect(() => {
		setTimeout(() => {
			if (visible) {
				inputRef.current?.focus()
			}
		})
	}, [inputRef, visible])

	const menu = (id: string) => (
		<Menu onClick={e => onMenuClick(e, id)}>
			<Menu.Item key='rename' icon={<EditOutlined />}>
				重命名
			</Menu.Item>
			<Menu.Item key='delete' danger icon={<DeleteOutlined />}>
				删除
			</Menu.Item>
		</Menu>
	)

	return (
		<div className={styles.container}>
			<div className='head'>
				<Title>Mock Server</Title>
				<Button size='large' type='primary' onClick={() => setVisible(true)}>
					创建项目
				</Button>
			</div>
			<div className='body'>
				{config.map(item => (
					<div key={item.id} className='project-name'>
						<Dropdown overlay={menu(item.id)} trigger={['contextMenu']}>
							<div className='container'>
								<span>{item.projectName}</span>
							</div>
						</Dropdown>
					</div>
				))}
			</div>
			<Modal
				title='创建项目'
				centered
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={false}
				afterClose={() => {
					formRef.current?.resetFields()
				}}
			>
				<Form
					name='basic'
					initialValues={{ remember: true }}
					onFinish={onSubmit}
					labelCol={{ span: 4 }}
					ref={formRef}
				>
					<Form.Item
						label='项目名称'
						name='projectName'
						rules={[{ required: true, message: '项目名称不能为空' }]}
					>
						<Input ref={inputRef} autoComplete='off' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default App
