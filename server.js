const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

function dateLogger(req, res, next) {
  console.log(new Date().toISOString());

  next();
}

const httpLogger = (req, res, next) => {
  console.log(`${req.method} to ${req.url}`);
  next();
};

function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  // new way of reading data sent by the client
  const password = req.headers.password || "";
  if (!password) {
    res.status(401).json({ message: "Oh Yeah, put that password in homie" });
  } else {
    password.toLowerCase() === "mellon"
      ? next()
      : res.status(400).json({ message: "ok ok ok" });
  }
}
server.use(helmet());
server.use(express.json());
server.use(gateKeeper);
// server.use(dateLogger);
server.use(httpLogger);

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
