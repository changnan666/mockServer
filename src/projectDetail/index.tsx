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
  const [currPath, setCurrPath] = useState("");
  const [currEditPath, setCurrEditPath] = useState("");

  const formRef = useRef<FormInstance | null>(null);
  const inputRef = useRef<Input | null>(null);
  const editorRef = useRef<any>(null);

  const onAddInterface = () => {
    setVisible(true);
  };

  const onSubmit = (values: any) => {
    if (values.path.trim() === "") return;

    get(api.createPath, { id: hash, path: values }).then((res) => {
      pathList.push({
        code: "",
        ...values,
      });

      setPathList([...pathList]);
      setVisible(false);
    });
  };

  const onDelete = (path: string) => {
    get(api.deletePath, { path, hash }).then(() => {
      const index = pathList.findIndex((item) => item.path === path);
      pathList.splice(index, 1);
      setPathList([...pathList]);
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

  useEffect(() => {
    const { code } = pathList.find((item) => item.path === currPath) || {
      code: "",
    };

    editorRef.current.setValue(code);
  }, [editorRef, currPath]);

  useEffect(() => {
    if (!visible && currEditPath !== "") {
      setVisible(true);
      setTimeout(() => {
        const values = pathList.find((item) => item.path === currEditPath);
        formRef.current?.setFieldsValue(values);
      });
    }
  }, [currEditPath]);

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
              <div
                key={i}
                className={`path-list-item ${
                  item.path === currPath ? "active" : ""
                }`}
              >
                <span className="path" onClick={() => setCurrPath(item.path)}>
                  {item.path}
                </span>
                <span
                  className="description"
                  onClick={() => setCurrPath(item.path)}
                >
                  {item.description}
                </span>
                <span className="controller">
                  <DeleteOutlined onClick={() => onDelete(item.path)} />
                  <EditOutlined onClick={() => setCurrEditPath(item.path)} />
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
          ref={editorRef}
          onChange={(v) => {
            console.log(v);
          }}
        />
      </div>
      <Modal
        title={currEditPath === "" ? "添加接口" : "编辑接口"}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        afterClose={() => {
          formRef.current?.resetFields();
          setCurrEditPath("");
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
