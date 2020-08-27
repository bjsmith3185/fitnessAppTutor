var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Requiring the `exercise` model for accessing the `excercise` collection
var Exercise = require("./models/exerciseModel");
// Requiring the `workout` model for accessing the `excercise` collection
var Workout = require("./models/workoutModel")

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/workout", { useNewUrlParser: true });

// Routes

//Route to get a list of all exercises
app.get("/exercises", function(req, res) {
  // Create a new user using req.body
  Exercise.findAll()
    .then(function(dbExercises) {
      // If found successfully, send the the list of exercises to the client
      res.json(dbExercises);
    })
    .catch(function(err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });
});

app.get("/test", function(req, res) {
    // return a test string
    res.json({"message": "successful"});
    
  });
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
