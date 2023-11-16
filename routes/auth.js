const express = require('express');
const router = express.Router();
const admin = require('../utils/firebase/admin');

router.post('/signup', (req, res) => {
  admin.auth().createUser({email: req.body.email, password: req.body.password, disabled: false, emailVerified: false })
    .then((userCredential) => {
      const user = userCredential;
      res.json({ message: "signup was successful", userCreated: user });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    })
})

module.exports = router;