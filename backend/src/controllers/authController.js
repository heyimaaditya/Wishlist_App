const admin = require('firebase-admin');
const db = admin.database();

exports.getUserProfile = async (req, res) => {
  const userId = req.user.uid; 

  try {

    const userSnapshot = await db.ref(`users/${userId}`).once('value');
    const userProfile = userSnapshot.val();

    if (!userProfile) {
  
        return res.json({ uid: userId, email: req.user.email });
    }

    
    res.json(userProfile);

  } catch (error) {
     console.error("Error fetching user profile:", error);
     res.status(500).send("Internal Server Error");
  }
};