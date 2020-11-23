import React, { useEffect, useRef, useState } from "react";
import styles from "./index.scss";
import { Typography, Button, Modal, Form, Input, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import { get, api } from "../utils";
import { FormInstance } from "antd/lib/form";
import { v1 } from "uuid";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {} from "rc-menu";

const { Title } = Typography;

const App = () => {
  const [config, setConfig] = useState<Config[]>([]);
  const [visible, setVisible] = useState(false);

  const formRef = useRef<FormInstance | null>(null);
  const inputRef = useRef<Input | null>(null);

  const onSubmit = (values: any) => {
    if (values.projectName.trim() === "") {
      return;
    }
    get(api.createProject, values).then(() => {
      values.id = v1();
      config.push(values);

      setConfig([...config]);
      setVisible(false);
    });
  };

  const onMenuClick = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    get<Config[]>(api.getAllConfig).then((res) => {
      setConfig(res.data);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (visible) {
        inputRef.current?.focus();
      }
    });
  }, [inputRef, visible]);

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="1" icon={<EditOutlined />}>
        重命名
      </Menu.Item>
      <Menu.Item key="2" danger icon={<DeleteOutlined />}>
        删除
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.container}>
      <div className="head">
        <Title>Mock Server</Title>
        <Button size="large" type="primary" onClick={() => setVisible(true)}>
          创建项目
        </Button>
      </div>
      <div className="body">
        {config.map((item) => (
          <div key={item.id} className="project-name">
            <Dropdown overlay={menu} trigger={["contextMenu"]}>
              <div className="container">
                <span>{item.projectName}</span>
              </div>
            </Dropdown>
          </div>
        ))}
      </div>
      <Modal
        title="创建项目"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        afterClose={() => {
          formRef.current?.resetFields();
        }}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          labelCol={{ span: 4 }}
          ref={formRef}
        >
          <Form.Item
            label="项目名称"
            name="projectName"
            rules={[{ required: true, message: "项目名称不能为空" }]}
          >
            <Input ref={inputRef} autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
