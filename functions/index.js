const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.uploadFile = (req, res) => {
    if (req.method !== 'POST') {
      // Return a "method not allowed" error
      return res.status(405).end();
    }
}
