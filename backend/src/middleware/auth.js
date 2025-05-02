const admin = require('firebase-admin'); 

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1]; 

  if (!idToken) {
    console.warn('Auth: No token provided.');
    return res.status(401).send('Unauthorized: No token provided.');
  }

  try {
   
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;
    next(); 
  } catch (error) {
    console.error('Auth: Error verifying token:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
        return res.status(401).send('Unauthorized: Token expired.');
    }
    res.status(401).send('Unauthorized: Invalid token.');
  }
};

module.exports = verifyToken;