import * as firebase from "firebase/app";

import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGEah_5omm5NtPOODFPlRkUOw5nef3oYA",
  authDomain: "nn-projects-2.firebaseapp.com",
  databaseURL: "https://nn-projects-2.firebaseio.com",
  projectId: "nn-projects-2",
  storageBucket: "nn-projects-2.appspot.com",
  messagingSenderId: "710752818845",
  appId: "1:710752818845:web:b29f1167f38b55af21e674",
  measurementId: "G-6Q547468F2"
};

firebase.initializeApp(firebaseConfig);

export default firebase
