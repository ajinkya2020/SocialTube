const express = require("express");
const router = express.Router();
const admin = require("../utils/firebase/admin");

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

module.exports = router;
