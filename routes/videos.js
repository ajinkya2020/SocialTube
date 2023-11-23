const express = require("express");
const router = express.Router();
const admin = require("../utils/firebase/admin");
const saltedMd5=require('salted-md5')
const path=require('path');
const multer=require('multer')
const upload=multer({storage: multer.memoryStorage()})
require('dotenv').config()

router.get("/", (req, res) => {
  const videosRef = admin.firestore().collection("videos");
  try {
    videosRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
      return res.status(201).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
});

router.post("/", upload.single('file'), async (req, res) => {
  console.log(req.file);
  const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
  const fileName = name + path.extname(req.file.originalname)
  await admin.storage().bucket().file(fileName).createWriteStream().end(req.file.buffer)
  res.json({ 'message': 'File uploaded successfully' });
})

module.exports = router;
