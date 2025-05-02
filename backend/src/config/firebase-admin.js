const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {

    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    
  }
} else {
  console.log('Firebase Admin SDK already initialized.');
}


