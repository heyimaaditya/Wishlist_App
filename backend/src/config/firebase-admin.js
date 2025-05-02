const admin = require('firebase-admin');
let db;

if (!admin.apps.length) {
  try {
    const app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    db = app.database();
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
} else {
   const existingApp = admin.app();
   db = existingApp.database();
   console.log('Firebase Admin SDK already initialized, reusing existing app.');
}

module.exports = { admin, db };


