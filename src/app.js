const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: 'hunter2xK9pQ', database: 'crlab' });

// SQL injection: user input concatenated straight into the query
app.get('/user', (req, res) => {
  const q = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.query(q, (e, rows) => res.json(rows));
});

// Command injection
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (e, out) => res.send(out));
});

// Path traversal
app.get('/file', (req, res) => {
  res.send(fs.readFileSync('/var/data/' + req.query.path));
});

// Code injection
app.get('/calc', (req, res) => {
  res.send(String(eval(req.query.expr)));
});

// Reflected XSS
app.get('/hello', (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

// SSRF
const axios = require('axios');
app.get('/fetch', async (req, res) => {
  const r = await axios.get(req.query.url);
  res.send(r.data);
});

// Hardcoded credential
const API_KEY = process.env.API_KEY;

app.listen(3000);
