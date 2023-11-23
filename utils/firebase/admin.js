var admin = require("firebase-admin");
var serviceAccount = require("../../firebase-service-account.json");
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_PATH
});

module.exports = admin;