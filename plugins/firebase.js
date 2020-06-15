import * as firebase from "firebase/app";

import "firebase/analytics";
import "firebase/firestore";
import "firebase/firebase-functions";

const firebaseConfig = {
  apiKey: "AIzaSyAq3eNRL8T360kZpeyS7gRX1IApHddIfi4",
  authDomain: "vuemap-c0443.firebaseapp.com",
  databaseURL: "https://vuemap-c0443.firebaseio.com",
  projectId: "vuemap-c0443",
  storageBucket: "vuemap-c0443.appspot.com",
  messagingSenderId: "244429409675",
  appId: "1:244429409675:web:89a0d91bc1caf86622b38e",
  measurementId: "G-0QN5QESEHG"
};
firebase.initializeApp(firebaseConfig);

export default firebase
