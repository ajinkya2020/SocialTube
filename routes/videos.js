const express = require("express");
const router = express.Router();
const admin = require("../utils/firebase/admin");
const saltedMd5 = require('salted-md5')
const path = require('path');
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})
const mongoose = require("mongoose");
require('dotenv').config()

const videosSchema = new mongoose.Schema({
  desc: String,
  title: String,
  userId: String,
  username: String,
  likes: Number,
  dislikes: Number,
  videoUrl: String,
  viewsCount: Number
});
const Videos = mongoose.model("Videos", videosSchema);

router.get("/", (req, res) => {
  if(!req.user) res.status(401).json({ "message": "Unauthorized" });
  else {
    Videos.find({})
      .then((videos) => {
        res.json(videos);
      })
      .catch((err) => {
        res.json(err);
      })
  }
});

router.post("/", upload.single('file'), async (req, res) => {
  if(!req.user) res.status(401).json({ "message": "Unauthorized" });
  else {
    console.log(req.file);
    const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
    const fileName = name + path.extname(req.file.originalname)
    let bucketFile = admin.storage().bucket().file(fileName);
    await bucketFile.createWriteStream().end(req.file.buffer)
    const [videoUrl] = await bucketFile.getSignedUrl({
      action: "read",
      expires: "01-01-2050"
    });
    let videoObj = new Videos({
      desc: req.body.desc,
      title: req.body.title,
      userId: req.user.id,
      username: req.user.username,
      likes: 0,
      dislikes: 0,
      videoUrl: videoUrl,
      viewsCount: 0
    })

    videoObj.save()
      .then((video) => {
        res.json({ 'message': 'File uploaded successfully', "url": videoUrl });
      })
      .catch((err) => {
        res.json(err);
      })
  }
})

router.put("/", (req, res) => {
  if(!req.user) res.status(401).json({ "message": "Unauthorized" });
  else {
    Videos.updateOne({
      _id: req.body._id
    }, {
      $set: {
        desc: req.body.desc,
        title: req.body.title,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        viewsCount: req.body.viewsCount
      }
    })
      .then((video) => {
        res.json({ "message": "File updated successfully" });
      })
      .catch((err) => {
        res.json(err);
      })
  }
})

module.exports = router;
