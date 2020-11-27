const { writeFile } = require("fs/promises");
const path = require("path");
const { v1 } = require("uuid");

const filePath = path.resolve(__dirname, "../mock.js");
const mockConfig = [...require(filePath)];

const updateMockFile = function () {
  return writeFile(
    filePath,
    `module.exports = ${JSON.stringify(mockConfig.length ? mockConfig : "[]")}`
  );
};

const dataSourceIndex = (id) => mockConfig.findIndex((item) => item.id === id);

const route = {
  "/getMockConfig": async (send) => {
    send({ data: mockConfig });
  },
  "/createProject": async (send, project) => {
    const id = v1();
    mockConfig.push({ projectName: project.projectName, id, paths: [] });

    await updateMockFile();
    send({ data: id });
  },
  "/deleteProject": async (send, params) => {
    const index = dataSourceIndex(params.id);

    mockConfig.splice(index, 1);

    await updateMockFile();
    send();
  },
  "/getPath": (send, { id }) => {
    const paths = mockConfig.find((item) => item.id === id) || { paths: [] };
    send({ data: paths.paths.map(JSON.parse) });
  },
  "/createPath": async (send, { id, path }) => {
    const index = dataSourceIndex(id);

    mockConfig[index].paths.push(path);

    await updateMockFile();
    send();
  },
  "/editPath": async (send, { path, hash, values }) => {
    const i = dataSourceIndex(hash);

    const list = mockConfig[i].paths.map(JSON.parse);
    const index = list.findIndex((item) => item.path === path);

    mockConfig[i].paths[index] = values;

    await updateMockFile();
    send();
  },
  "/deletePath": async (send, { path, hash }) => {
    const i = dataSourceIndex(hash);
    const list = mockConfig[i].paths.map(JSON.parse);
    const index = list.findIndex((item) => item.path === path);

    list.splice(index, 1);
    mockConfig[i].paths = list.map(JSON.stringify);

    await updateMockFile();
    send();
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

const reg = /\/[\s\S]{36}\/[\s\S]*/g;
const sendData = (req, res, next) => {
  const url = decodeURIComponent(req.url);

  if (reg.test(url)) {
    const paths = url.match(reg)[0].slice(1);
    const index = paths.indexOf("/");
    const endIndex = paths.indexOf("?");

    const id = paths.slice(0, index);
    const path = paths.slice(index, endIndex === -1 ? paths.length : endIndex);

    mockConfig.forEach((item) => {
      if (item.id === id) {
        item.paths.map(JSON.parse).forEach((p) => {
          if (p.path === path) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");
            res.send(p.code);
          }
        });
      }
    });
  } else {
    next();
  }
};

module.exports = function (app) {
  app.use(sendData);

  for (const path in route) {
    app.get(path, (req, res) => {
      res.type("application/json");
      const send = sendAdapter(res);
      route[path].call(this, send, req.query);
    });
  }
};
