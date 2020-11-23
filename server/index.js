const { writeFile } = require("fs/promises");
const path = require("path");
const { v1 } = require("uuid");

const filePath = path.resolve(__dirname, "../mock.js");
const mockConfig = [...require(filePath)];

const projectNameIsExists = (name) => {
  for (const iterator of mockConfig) {
    if (iterator === name) {
      return true;
    }
  }

  return false;
};

const route = {
  "/getMockConfig": async (send) => {
    send({ data: mockConfig });
  },
  "/createProject": async (send, project) => {
    if (projectNameIsExists(project.projectName)) {
      return send({ code: 201, msg: "项目已存在" });
    }

    mockConfig.push({ projectName: project.projectName, id: v1() });
    await writeFile(filePath, `module.exports = ${JSON.stringify(mockConfig)}`);

    send();
  },
  "/deleteProject": () => {
    console.log("删除项目");
  },
  "/createPath": () => {
    console.log("创建地址");
  },
  "/deletePath": () => {
    console.log("删除地址");
  },
};

const sendAdapter = (res) => {
  return ({ code, msg, data } = { code: 200, msg: "ok", data: {} }) => {
    res.send({
      code: code || 200,
      msg: msg || "ok",
      data: data || {},
    });
  };
};

module.exports = (app) => {
  for (const path in route) {
    app.get(path, (req, res) => {
      res.type("application/json");
      const send = sendAdapter(res);
      route[path](send, req.query);
    });
  }
};
