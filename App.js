const express = require("express");
const app = express();

const mysql = require("mysql");
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "bingbong"
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false })
);

const userRouter = require("./user/User");
app.use("/user", userRouter);

const chatRouter = require("./chat/Chat");
app.use("/chat", chatRouter);

const reportRouter = require("./report/Report");
app.use("/report", reportRouter);

app.listen(3000, function() {
  connection.connect();
});
