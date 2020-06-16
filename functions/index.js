const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const mkdirp = require("mkdirp");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");

function initializeApp(admin) {
  //process.env.GCLOUD_PROJECT = "firestorebeta1test2";
  // [START initialize_app]
  console.log("initializeApp has been called.");

  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();
  // [START_EXCLUDE]
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  // [END_EXCLUDE]

  // [END initialize_app]
  return db;
}

let db = initializeApp(admin);
const cors = require("cors")({
  origin: true
});
//const cors = require("cors")({
//  origin: true
//});
//
const app = express();
const router = express.Router();
app.use(cors);
app.use("/", router);
app.get("/status", (req, res) => {
  console.log(`headers:`, req.headers);
  res.status(200).send("OK");
});

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1;  // London is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${"BONG ".repeat(hours)}
    </body>
  </html>`);
});

exports.sample = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log(new admin.firestore.GeoPoint(18.7833491, 98.986756));
    //location: new
    let a = await db.collection("geolocation").add({
      //18.7833491, 98.986756
      loc: new admin.firestore.GeoPoint(18.7833491, 98.986756),
      sound: "....",
      type: 1
    });
    console.log(a);
    res.send("Passed.");
  });
});

exports.list = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    let rootRef = db.collection("geolocation");
    let markerRef = rootRef.get()
      .then(snapshot => {
        let x = [];
        snapshot.forEach(doc => {
          let data = doc.data();
          console.log(doc.id, "=>", data);
          x.push(data);
        });
        res.status(200).json(x);
        return res;
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });
});

exports.app = functions.https.onRequest(app);
