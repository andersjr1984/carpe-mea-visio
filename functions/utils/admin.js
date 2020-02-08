// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');

admin.initializeApp();

exports.fsOtherRef = admin.firestore;

exports.firestoreRef = admin.firestore();

exports.storage = admin.storage();

exports.admin = admin;
