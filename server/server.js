// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var user = {};
app.param('name', function (req, res, next, name) {

  // check if the user with that name exists
  // do some validations
  // add -dude to the name
  var modified = name + '-dude';

  // save name to the request
  req.name = modified;

  next();
});

// routes will go here
app.get('/api/users/:name', (req, res) => {
  res.send('What is up ' + req.name + '!');
})

app.get('/api/users', (req, res) => {
  res.send(user);
});

app.post('/api/users', (req, res) => {
  var email = req.param('email');
  var phoneNumber = req.param('phoneNumber');
  var postalCode = req.param('postalCode');
  user = {
    email: email,
    phoneNumber: phoneNumber,
    postalCode: postalCode
  }
  res.send("OK, the user is now: " + JSON.stringify(user));
})


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);