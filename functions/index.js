const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mkdirp = require("mkdirp");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
const express = require("express");
const cors = require("cors")({
  origin: true
});

const router = express.Router();
app.use(cors);
app.use("/", router);
app.get("/status", (req, res) => {
  console.log(`headers:`, req.headers);
  res.status(200).send("OK");
});

module.exports = {
  app: app
};


