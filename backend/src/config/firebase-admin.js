const admin = require('firebase-admin');


if (!admin.apps.length) {
  try {
   
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), 
      databaseURL: process.env.FIREBASE_DATABASE_URL
      
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

