const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const videos = require('./routes/videos')
const authRoute = require('./routes/auth')
const session = require("express-session"); 
const passport = require("passport"); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
mongoose.connect("mongodb+srv://ajinkyachamp20:hCK4qZn11kp77MNz@cluster0.kwnobcz.mongodb.net/social_tube", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(session({ 
  secret : "Our little secret", 
  resave : false, 
  saveUninitialized : false
})); 
app.use(passport.initialize());
app.use(passport.session());
app.use('/videos', videos);
app.use('/auth', authRoute);

app.get('/app/firstCall', (req, res) => {
  res.json({ message: "First API call was successful" });
})

app.post('/app/firstCall', (req, res) => {
  res.json({ message: "First API call was successful", requestBody: req.body });
})

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
})