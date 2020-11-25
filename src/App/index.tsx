import React, { useEffect, useRef, useState } from "react";
import styles from "./index.scss";
import { Typography, Button, Modal, Form, Input, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import { get, api } from "../utils";
import { FormInstance } from "antd/lib/form";
import { DeleteOutlined } from "@ant-design/icons";
import Project from "../projectDetail";

const { Text, Title } = Typography;

const App = () => {
  // eslint-disable-next-line no-restricted-globals
  const [hash, setHash] = useState(location.hash.slice(1));

  const [config, setConfig] = useState<Config[]>([]);
  const [visible, setVisible] = useState(false);

  const formRef = useRef<FormInstance | null>(null);
  const inputRef = useRef<Input | null>(null);

  const onSubmit = (values: any) => {
    if (values.projectName.trim() === "") {
      return;
    }
    get(api.createProject, values).then((res) => {
      values.id = res.data;
      config.push(values);

      setConfig([...config]);
      setVisible(false);
    });
  };

  const onMenuClick = (e: any, id: string) => {
    switch (e.key) {
      case "rename":
        break;
      case "delete":
        const index = config.findIndex((item) => item.id === id);

        Modal.confirm({
          content: (
            <span>
              是否确认删除项目：
              <Text type="danger">{config[index].projectName}</Text>
            </span>
          ),
          onOk() {
            get(api.deleteProject, { id }).then(() => {
              config.splice(index, 1);
              setConfig([...config]);
            });
          },
        });
        break;
    }
  };

  const onHashchange = () => {
    // eslint-disable-next-line no-restricted-globals
    setHash(location.hash.slice(1));
  };

  useEffect(() => {
    get<Config[]>(api.getAllConfig).then((res) => {
      setConfig(res.data);
    });

    window.addEventListener("hashchange", onHashchange);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (visible) {
        inputRef.current?.focus();
      }
    });
  }, [inputRef, visible]);

  const menu = (id: string) => (
    <Menu onClick={(e) => onMenuClick(e, id)}>
      {/* <Menu.Item key='rename' icon={<EditOutlined />}>
				重命名
			</Menu.Item> */}
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        删除
      </Menu.Item>
    </Menu>
  );

  const projectName = config.find((item) => item.id === hash) || {
    projectName: "",
  };

  const toHome = () => {
    // eslint-disable-next-line no-restricted-globals
    history.back()
  };

  return (
    <div className={styles.container}>
      <Title className="title">
        <span onClick={toHome}>Mock Server</span> {hash !== "" ? "-" : ""}{" "}
        {projectName.projectName}
      </Title>
      {hash !== "" ? (
        <Project hash={hash} />
      ) : (
        <>
          <div className="head">
            <Button
              size="large"
              type="primary"
              onClick={() => setVisible(true)}
            >
              创建项目
            </Button>
          </div>
          <div className="body">
            {config.map((item) => (
              <div key={item.id} className="project-name">
                <Dropdown overlay={menu(item.id)} trigger={["contextMenu"]}>
                  <a className="container" href={`#${item.id}`}>
                    <span>{item.projectName}</span>
                  </a>
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
        </>
      )}
    </div>
  );
};

export default App;
