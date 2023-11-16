const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const videos = require('./routes/videos')
const authRoute = require('./routes/auth')
const session = require("express-session"); 
const passport = require("passport"); 
const passportLocalMongoose = require("passport-local-mongoose"); 
const findOrCreate = require('mongoose-findorcreate');
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


const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose); 
userSchema.plugin(findOrCreate);
const Users = mongoose.model("Users", userSchema);
passport.use(Users.createStrategy());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.get('/app/firstCall', (req, res) => {
  res.json({ message: "First API call was successful" });
})

app.post('/app/firstCall', (req, res) => {
  res.json({ message: "First API call was successful", requestBody: req.body });
})

app.post('/user/signup', (req, res) => {
  // console.log(req.body); 
      
  // Getting the email and password entered 
  // by the user
  // var email = req.body.email;
    
  // // Creating a new user with entered credentials. 
  // var newuser = new Users({ 
  //   name: name,
  //   email : email, 
  //   password : password 
  // })
    
  // // Saving the newuser. 
  // newuser.save(); 
  // console.log("saved successfully"); 
    
  // // Sending the response that user 
  // // is saved successfully 
  // res.send("saved successfully"); 
  
  Users.register({ username : req.body.email },
    req.body.password, function (err, user) {
      if (err) {
        // if some error is occurring, log that error
        // console.log(err);
        console.log({ message: "error while saving!" });
        // res.status(500).json(err)
      } 
      else {
        passport.authenticate("local")
        (req, res, () => {
          response.setHeader("Content-Type", "application/json");
          console.log({ message: "successfully saved!" });
          // res.json({ message: "successfully saved!" });
          res.json({message: "successfully saved!"});
        })
      }
    })
})

app.post("/app/register", function(req, res){
  Users.register({username: req.body.username}, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      res.status(500).json({"error": err});
    } else {
      passport.authenticate("local")(req, res, function() {
        res.status(200).json({ "message": "User saved successfully.", "user": { "id": req.user.id, "username": req.user.username } });
      });
    }
  });
});

app.post("/app/login", function(req, res) {
  const user = new Users({
    username: req.body.username,
    passport: req.body.password
  })

  req.login(user, function(err) {
    if(err) {
      res.status(500).json({"error": err});
    } else {
      passport.authenticate("local")(req, res, function() {
        const userResponse = {
          "message": "User logged in successfully.", "user": { "id": req.user.id, "username": req.user.username }
        }
        res.status(200).send(userResponse);
      })
    }
  })
})

app.post("/app/logout", function(req, res) {
  req.logOut(function(err) {
    if (err) {
      res.status(500).json({"error": err});
    } else {
      res.status(200).send({ "message": "Logout Successful" });
    }
  })
})

app.get("/app/currentuser", function(req, res) {
  res.send(req.isAuthenticated() ? req.user : null);
})

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
})