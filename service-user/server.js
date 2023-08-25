//: ----------------------------------------------------------------------------
"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const pool = require("./db");

const app = express();
const port = 8080;

//: ----------------------------------------------------------------------------
//: Home

app.get("/", async (req, res, next) => {

  console.log("✧ Home");

  res.setHeader("Content-Type", "text/html");
  res.status(200);
  res.send("<h1>Hello World</h1>");

});

//: ----------------------------------------------------------------------------
//: DB (test)

app.get("/db", async (req, res, next) => {

  console.log("✧ DB");

  let msg = "~";

  try {
    const data = await pool.query("SELECT $1::text as message", ["ツ OK"]);
    msg = data.rows[0].message;
    console.log(msg);
  } catch (err) {
    next(err);
  }

  res.setHeader("Content-Type", "text/html");
  res.status(200);
  res.send(msg);

});

//: ----------------------------------------------------------------------------
//: Users

app.get("/users", async (req, res, next) => {

  console.log("✧ Users");

  let msg = "~";
  let sql = "SELECT * FROM users";

  try {
    const data = await pool.query(sql);
    msg = data.rows;
  } catch (err) {
    next(err);
  }

  res.json(msg);

});

//: ----------------------------------------------------------------------------
//: User

app.get("/user", async (req, res, next) => {

  console.log("✧ User");

  let id = 1;

  let msg = "~";
  let sql = `SELECT * FROM users WHERE id = ${id}`;
    
  try {
    const data = await pool.query(sql);
    msg = data.rows[0];
    console.log(msg);
  } catch (err) {
    next(err);
  }

  res.json(msg);

});

//: ----------------------------------------------------------------------------
//: ADD

app.get("/add", async (req, res, next) => {

  console.log("✧ Add");

  let msg = "~";  
  let sql = `INSERT INTO users (name, email)
             VALUES ('Pol', 'pol@pol.com')
             RETURNING *`;

  try {
    const data = await pool.query(sql);
    msg = data.rows[0];
    console.log(msg);
  } catch (err) {
    next(err);
  }

  res.json(msg);

});

//: ----------------------------------------------------------------------------
//: UPDATE

app.get("/update", async (req, res, next) => {

  console.log("✧ Update");

  let id = 4;

  let msg = "~";
  let sql = `UPDATE users SET name = 'value', email = 'value@value.pl'
             WHERE id = ${id}
             RETURNING *`;

  try {
    const data = await pool.query(sql);
    msg = data.rows[0];
    console.log(msg);
  } catch (err) {
    next(err);
  }

  res.json(msg);

});

//: ----------------------------------------------------------------------------
//: DELETE

app.get("/delete", async (req, res, next) => {
  
  console.log("✧ Delete");

  let id = 4;

  let msg = "~";  
  let sql = `DELETE FROM users WHERE id = ${id}
             RETURNING *`;

  try {
    const data = await pool.query(sql);
    msg = data.rows[0];
    console.log(msg);
  } catch (err) {
    next(err);
  }

  res.json(msg);

});

//: ----------------------------------------------------------------------------
//: ERRORS

app.use((err, req, res, next) => {
  if (err) {   
    console.error(err);
    res.status(500).send("Error");
  }
});

//: ----------------------------------------------------------------------------
//: Listener

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
