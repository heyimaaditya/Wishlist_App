const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');


router.get('/me', verifyToken, (req, res) => {

  const user = req.user;
  
  res.json({
    uid: user.uid,
    email: user.email,
   
  });
});



module.exports = router;