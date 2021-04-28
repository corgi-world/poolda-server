const express = require("express");
var router = express.Router();

const google_translate = require("../google/Translate");
const google_automl = require("../google/AutoML");

const mysql = require("mysql");
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "bingbong",
});

router.post("/sentimentTitle", async function (
  req,
  res
) {
  const info = req.body;
  const { text } = info;

  res.send({
    result: "OK",
    displayName: "sadness",
  });

  return;

  try {
    const en = await google_translate(text);
    const payload = await google_automl(en);
    console.log(text);
    console.log(en);
    console.log(payload);

    const displayName = payload[0].displayName;
    res.send({
      result: "OK",
      displayName: displayName,
    });
  } catch (err) {
    console.log(err);
    res.send({
      result: "Error",
    });
  }
});

router.post("/saveAndLoadDiary", function (
  req,
  res
) {
  console.log(
    "일기 저장하고 다른사람꺼 불러오는 중..."
  );

  const info = req.body;
  const id = info.userID;
  const nickname = info.userNickname;
  const date = new Date().toString();
  const text = info.diary_my;
  const sentimentTitle = info.sentimentTitle;
  const my_sentiments = JSON.stringify(
    info.diary_my_sentiments
  );
  const other_sentiments = "{}";
  const allow = info.allow;

  connection.query(
    "INSERT INTO diary (id, nickname, date, text, sentimentTitle, my_sentiments, other_sentiments, allow) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      nickname,
      date,
      text,
      sentimentTitle,
      my_sentiments,
      other_sentiments,
      allow,
    ],

    (err) => {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        connection.query(
          "SELECT _index FROM diary WHERE id <> ? and allow = '1'",
          [id],
          function (err, index) {
            if (err) {
              console.log(err);
              res.send({ result: "Error" });
            } else {
              var max = index.length;
              var min = 0;
              let rnd =
                Math.floor(
                  Math.random() * (max - min)
                ) + min;

              let _index = index[rnd]._index;
              console.log(_index + " " + rnd);

              _index = "1";

              connection.query(
                "SELECT * FROM diary WHERE _index = ?",
                [_index],
                function (err, d) {
                  if (err) {
                    console.log(err);
                    res.send({ result: "Error" });
                  } else {
                    const randomDiary = d[0];

                    console.log(randomDiary);

                    const diary_other =
                      randomDiary.text;
                    const diary_other_index =
                      randomDiary._index;
                    const diary_other_nickname =
                      randomDiary.nickname;
                    const diary_other_sentimentTitle =
                      randomDiary.sentimentTitle;
                    const diary_other_sentiments =
                      randomDiary.other_sentiments;

                    res.send({
                      result: "OK",
                      diary_other,
                      diary_other_index,
                      diary_other_nickname,
                      diary_other_sentimentTitle,
                      diary_other_sentiments,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/updateOtherSentiments", function (
  req,
  res
) {
  console.log(
    "다른사람거에 선택한 감정 저장 중..."
  );

  const info = req.body;
  const _index = info.diary_other_index;
  const selected_sentiments =
    info.selected_sentiments;

  connection.query(
    "SELECT * FROM diary WHERE _index = ?",
    [_index],
    function (err, d) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        const randomDiary = d[0];
        const diary_other_sentiments =
          randomDiary.other_sentiments;

        let obj = JSON.parse(
          diary_other_sentiments
        );

        const selected_keys = Object.keys(
          selected_sentiments
        );
        const length = selected_keys.length;
        for (var i = 0; i < length; i++) {
          let key = selected_keys[i];
          if (key in obj) {
            obj[key] = obj[key] + 1;
          } else {
            obj[key] = 1;
          }
        }

        const obj_string = JSON.stringify(obj);

        connection.query(
          "UPDATE diary SET other_sentiments = ? WHERE _index = ?",
          [obj_string, _index],
          function (err, d) {
            if (err) {
              console.log(err);
              res.send({ result: "Error" });
            } else {
              res.send({
                result: "OK",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/loadLastSentiments", function (
  req,
  res
) {
  console.log("이전 감정 불러오는 중...");

  const info = req.body;
  const userID = info.id;

  connection.query(
    "SELECT * FROM diary WHERE id = ? ORDER BY date DESC LIMIT 1",
    [userID],
    function (err, data) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        const last = data[0];
        const lastSelected = last.my_sentiments;

        res.send({
          result: "OK",
          lastSelected,
        });
      }
    }
  );
});

router.post("/feedback", function (req, res) {
  const info = req.body;

  const { type, id, text } = info;

  const date = new Date().toString();

  connection.query(
    "INSERT INTO feedback (type, id, date, text) VALUES (?, ?, ?, ?)",
    [type, id, text, date],
    (err) => {
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
