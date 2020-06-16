const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mkdirp = require("mkdirp");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
const cors = require("cors")({
  origin: true
});
//const express = require("express");
//const cors = require("cors")({
//  origin: true
//});
//
//const app = express();
//const router = express.Router();
//app.use(cors);
//app.use("/", router);
//app.get("/status", (req, res) => {
//  console.log(`headers:`, req.headers);
//  res.status(200).send("OK");
//});
//
//module.exports = app;

exports.bigben = functions.https.onRequest((req, res) => {
  cors((req, res, () => {
    const hours = (new Date().getHours() % 12) + 1;  // London is UTC + 1hr;
    res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${"BONG ".repeat(hours)}
    </body>
  </html>`);
  }));
});
