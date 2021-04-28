const express = require("express");
var router = express.Router();

const mysql = require("mysql");
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "bingbong"
});

router.post("/get", function(req, res) {
  const info = req.body;
  const { id } = info;

  connection.query(
    "SELECT * FROM diary WHERE id = ?",
    [id],
    function(err, data) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        console.log(data);
        console.log(data.length);
        res.send({
          result: "OK",
          data
        });
      }
    }
  );
});

module.exports = router;
