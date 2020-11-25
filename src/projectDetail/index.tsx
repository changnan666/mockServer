import { Button, Modal, Input, Form, Typography } from "antd";
import { FormInstance } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { get, api } from "../utils";
import Editor from "./editor";
import styles from "./index.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

type IProps = {
  hash: string;
};

const App = ({ hash }: IProps) => {
  const [pathList, setPathList] = useState<Path[]>([]);
  const [visible, setVisible] = useState(false);

  const formRef = useRef<FormInstance | null>(null);
  const inputRef = useRef<Input | null>(null);

  const onAddInterface = () => {
    setVisible(true);
  };

  const onSubmit = (values: any) => {
    if (values.path.trim() === "") {
      return;
    }
    get(api.createPath, { id: hash, path: values }).then((res) => {
      pathList.push({
        code: "",
        ...values,
      });

      setPathList([...pathList]);
      setVisible(false);
    });
  };

  useEffect(() => {
    get<Path[]>(api.getPath, { id: hash }).then((res) => {
      setPathList(res.data);
    });
  }, [hash]);

  useEffect(() => {
    setTimeout(() => {
      if (visible) {
        inputRef.current?.focus();
      }
    });
  }, [inputRef, visible]);

  return (
    <>
      <div className="head">
        <Button size="large" type="primary" onClick={onAddInterface}>
          添加接口
        </Button>
      </div>
      <div className={styles.body}>
        <div className="left">
         
          <div className="path-list">
            {pathList.map((item, i) => (
              <div key={i} className="path-list-item">
                <span className="path">{item.path}</span>
                <span className="description">{item.description}</span>
                <span className="controller">
                  <DeleteOutlined />
                  <EditOutlined />
                  <Paragraph
                    copyable={{
                      // eslint-disable-next-line no-restricted-globals
                      text: location.href + item.path,
                      tooltips: false,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
        <Editor
          value=""
          onChange={(v) => {
            console.log(v);
          }}
        />
      </div>
      <Modal
        title="添加接口"
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
            label="接口路径"
            name="path"
            rules={[{ required: true, message: "接口路径不能为空" }]}
          >
            <Input
              ref={inputRef}
              autoComplete="off"
              onPressEnter={() => formRef.current?.submit()}
            />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input
              autoComplete="off"
              onPressEnter={() => formRef.current?.submit()}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
