const express = require('express');
var bodyParser = require('body-parser');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/app/firstCall', (req, res) => {
  res.json({ message: "First API call was successful" });
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
})