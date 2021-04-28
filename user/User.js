const express = require("express");
var router = express.Router();

const mysql = require("mysql");
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "bingbong"
});

router.post("/login", function(req, res) {
  const info = req.body;
  const { id, password } = info;

  connection.query("SELECT * FROM user WHERE id = ?", [id], function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
      res.send({ result: "Error" });
    } else {
      const r = result;
      if (r == 0) {
        res.send({
          result: "NO",
          message: "존재하지 않는 아이디입니다."
        });
      } else {
        const db_id = r[0].id;
        const db_pw = r[0].password;
        if (db_id === id && db_pw === password) {
          res.send({
            result: "OK",
            userInfo: r[0]
          });
        } else {
          res.send({
            result: "NO",
            message: "비밀번호가 틀렸습니다."
          });
        }
      }
    }
  });
});

router.post("/saveToken", function(req, res) {
  const info = req.body;
  const { token, id } = info;

  connection.query(
    "UPDATE user SET token = ? WHERE id = ?",
    [token, id],
    function(err, count) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        connection.query("SELECT * FROM user WHERE id = ?", [id], function(
          err,
          result
        ) {
          if (err) {
            console.log(err);
            res.send({ result: "Error" });
          } else {
            const r = result;
            res.send({
              result: "OK",
              userInfo: r[0]
            });
          }
        });
      }
    }
  );
});

router.get("/hello", function(req, res) {
  res.send("ddd");
});

router.post("/isIdDuplicated", function(req, res) {
  const info = req.body;
  const id = info.id;

  connection.query("SELECT COUNT(*) FROM user WHERE id = ?", [id], function(
    err,
    count
  ) {
    if (err) {
      console.log(err);
      res.send({ result: "Error" });
    } else {
      const c = count[0]["COUNT(*)"];
      res.send({
        result: "OK",
        isIdDuplicated: c > 0
      });
    }
  });
});

router.post("/signup", function(req, res) {
  const info = req.body;

  const { id, password, nickname, sleepTime } = info;

  const token = "-";

  connection.query(
    "INSERT INTO user (id, password, nickname, sleepTime, token) VALUES (?, ?, ?, ?, ?)",
    [id, password, nickname, sleepTime, token],
    err => {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        res.send({ result: "OK" });
      }
    }
  );
});

module.exports = router;
