import { Button, Modal, Input, Form, Typography } from "antd";
import { FormInstance } from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { get, api } from "../utils";
import Editor from "./editor";
import styles from "./index.scss";
import { DeleteOutlined, EditOutlined, ApiOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

const { Paragraph } = Typography;

type IProps = {
  hash: string;
};

const App = ({ hash }: IProps) => {
  const [pathList, setPathList] = useState<Path[]>([]);
  const [visible, setVisible] = useState(false);
  /** 当前选中的接口 */
  const [currPath, setCurrPath] = useState("");
  /** 正在编辑的接口 */
  const [currEditPath, setCurrEditPath] = useState("");
  const [code, setCode] = useState("");

  const formRef = useRef<FormInstance | null>(null);
  const inputRef = useRef<Input | null>(null);

  const onAddInterface = () => {
    setVisible(true);
  };

  const onSubmit = (values: any) => {
    if (values.path.trim() === "") return;

    if (currEditPath === "") {
      values.code = "";
      if (!values.description) values.description = "";

      get(api.createPath, { id: hash, path: values }).then(() => {
        pathList.push({
          code: "",
          ...values,
        });

        setPathList([...pathList]);
        setVisible(false);
        setCurrPath(values.path);
      });
    } else {
      get(api.editPath, {
        hash,
        path: currEditPath,
        values,
      }).then(() => {
        const i = pathList.findIndex((item) => item.path === currEditPath);

        if (i !== -1) {
          pathList[i] = values;
          setPathList([...pathList]);
          setVisible(false);
          setCurrPath(currEditPath);
        }
      });
    }
  };

  const onDelete = (path: string) => {
    get(api.deletePath, { path, hash }).then(() => {
      const index = pathList.findIndex((item) => item.path === path);
      pathList.splice(index, 1);
      setPathList([...pathList]);
    });
  };

  const onEditPath = ({ path, code }: Path) => {
    setVisible(true);
    setCurrEditPath(path);
    setCode(code);

    setTimeout(() => {
      const values = pathList.find((item) => item.path === path);
      formRef.current?.setFieldsValue(values);
    });
  };

  const onChange = debounce((v: string) => {
    if (currPath !== "" && v !== "") {
      const target = pathList.find((item) => item.path === currPath);

      if (target) {
        target.code = v;

        get(api.editPath, {
          hash,
          path: currPath,
          values: target,
        });
      }
    }
  }, 300);

  const onSelect = (item: Path) => {
    setCurrPath(item.path);
    setCode(item.code);
  };

  useEffect(() => {
    get<Path[]>(api.getPath, { id: hash }).then((res) => {
      setPathList(res.data);

      if (res.data.length) {
        setCurrPath(res.data[0].path);
        setCode(res.data[0].code);
      }
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
              <div
                key={i}
                className={`path-list-item ${
                  item.path === currPath ? "active" : ""
                }`}
              >
                <span className="path" onClick={() => onSelect(item)}>
                  {item.path}
                </span>
                <span className="description" onClick={() => onSelect(item)}>
                  {item.description}
                </span>
                <span className="controller">
                  <DeleteOutlined onClick={() => onDelete(item.path)} />
                  <EditOutlined onClick={() => onEditPath(item)} />
                  {/* eslint-disable-next-line no-restricted-globals */}
                  <ApiOutlined
                    onClick={() =>
                      window.open(
                        // eslint-disable-next-line no-restricted-globals
                        location.href.replace("#", "") + item.path,
                        "_blank"
                      )
                    }
                  />
                  <Paragraph
                    copyable={{
                      // eslint-disable-next-line no-restricted-globals
                      text: location.href.replace("#", "") + item.path,
                      tooltips: false,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
        <Editor
          value={code}
          onChange={(v) => {
            onChange(v);
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
