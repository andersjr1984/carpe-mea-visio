/* eslint-disable linebreak-style */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';

// Initialize Firebase
const config = {
  apiKey: process.env.REACT_APP_FB_KEY,
  authDomain: process.env.REACT_APP_FB_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
  projectId: process.env.REACT_APP_FB_PID,
  storageBucket: process.env.REACT_APP_FB_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};
firebase.initializeApp(config);

export const auth = firebase.auth();

export default firebase;
