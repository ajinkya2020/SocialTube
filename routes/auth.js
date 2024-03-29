const express = require('express');
const router = express.Router();
const admin = require("../utils/firebase/admin");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose"); 
const findOrCreate = require('mongoose-findorcreate');
const saltedMd5 = require('salted-md5')
const path = require('path');
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profilePictureUrl: String,
  subscribers: [String],
  subscribed: [String],
  likedVideos: [String],
  dislikedVideos: [String]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const Users = mongoose.model("Users", userSchema);
passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// router.post('/signup', (req, res) => {
//   admin.auth().createUser({email: req.body.email, password: req.body.password, disabled: false, emailVerified: false })
//     .then((userCredential) => {
//       const user = userCredential;
//       res.json({ message: "signup was successful", userCreated: user });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send(error);
//     })
// })

router.post("/register", function(req, res){
  Users.register({username: req.body.username, profilePictureUrl: req.body.profilePictureUrl, subscribers: req.body.subscribers, subscribed: req.body.subscribed, likedVideos: req.body.likedVideos, dislikedVideos: req.body.dislikedVideos}, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      res.status(500).json({"error": err});
    } else {
      passport.authenticate("local")(req, res, function() {
        const userObj = {
          id: req.user.id,
          username: req.user.username,
          subscribers: req.user.subscribers,
          subscribed: req.user.subscribed,
          likedVideos: req.user.likedVideos,
          dislikedVideos: req.user.dislikedVideos
        }
        const userResponse = {
          "message": "User saved successfully.", "user": userObj
        }
        res.status(200).json(userResponse);
      });
    }
  });
});

router.post("/login", function(req, res) {
  const user = new Users({
    username: req.body.username,
    passport: req.body.password
  })

  req.login(user, function(err) {
    if(err) {
      res.status(500).json({"error": err});
    } else {
      passport.authenticate("local")(req, res, function() {
        const userObj = {
          id: req.user.id,
          username: req.user.username,
          subscribers: req.user.subscribers,
          subscribed: req.user.subscribed,
          likedVideos: req.user.likedVideos,
          dislikedVideos: req.user.dislikedVideos
        }
        const userResponse = {
          "message": "User logged in successfully.", "user": userObj
        }
        res.status(200).send(userResponse);
      })
    }
  })
})

router.post("/logout", function(req, res) {
  req.logOut(function(err) {
    if (err) {
      res.status(500).json({"error": err});
    } else {
      res.status(200).send({ "message": "Logout Successful" });
    }
  })
})

router.put("/user", function(req, res) {
  if(!req.user) res.status(401).json({ "message": "Unauthorized" });
  else {
    console.log(req.body.subscribers);
    let subscribers = req.body.subscribers || [''];
    let subscribed = req.body.subscribed || [''];
    let likedVideos = req.body.likedVideos || [''];
    let dislikedVideos = req.body.dislikedVideos || [''];
    Users.updateOne({
      _id: req.body._id
    }, {
      $push: {
        subscribers: {$each: subscribers},
        subscribed: {$each: subscribed},
        likedVideos: {$each: likedVideos},
        dislikedVideos: {$each: dislikedVideos}
      }
    })
      .then((user) => {
        console.log(user);
        res.json(req.user);
      })
      .catch((err) => {
        res.json(err);
      })
  }
})

router.put("/user/profile", upload.single('file'), async function(req, res) {
  if(!req.user) res.status(401).json({ "message": "Unauthorized" });
  let profilePicUrl = [];
  if(!!req.file) {
    const name = saltedMd5(req.file?.originalname, 'SUPER-S@LT!')
    const fileName = name + path.extname(req.file?.originalname)
    let bucketFile = admin.storage().bucket().file(fileName);
    await bucketFile.createWriteStream().end(req.file?.buffer)
    profilePicUrl = await bucketFile.getSignedUrl({
      action: "read",
      expires: "01-01-2050"
    });
    console.log(profilePicUrl);
  }
  const updateObject = {
    $set: {
      profilePictureUrl: profilePicUrl[0] || req.user.profilePictureUrl,
      username: req.body.username
    },
  };
  Users.updateOne({
    _id: req.body._id
  },
    updateObject
  )
    .then((user) => {
      console.log(user);
      res.json(req.user);
    })
    .catch((err) => {
      res.json(err);
    })
})

router.get("/currentuser", function(req, res) {
  res.send(req.isAuthenticated() ? req.user : null);
})

module.exports = router;