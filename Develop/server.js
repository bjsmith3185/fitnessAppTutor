var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Requiring the `exercise` model for accessing the `excercise` collection
var Exercises = require("./models/exerciseModel");
// Requiring the `workout` model for accessing the `excercise` collection
var Workouts = require("./models/workoutModel");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/workout", { useNewUrlParser: true });

// Routes

//Route to get a list of all exercises
app.get("/exercises", function (req, res) {
  // Create a new user using req.body
  db.Exercises.findAll()
    .then(function (dbExercises) {
      // If found successfully, send the the list of exercises to the client
      console.log(dbExercises);
      res.json(dbExercises);
    })
    .catch(function (err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });
});

//Route to get workout by ID populated with exercises
app.get("/workout/:id", function (req, res) {
  var id = req.params.id;

  db.Workouts.findById(id)
    .populate("exercises")
    .then(function (doc, error) {
      if (error) {
        console.log("error " + error);
      }
      console.log("workout");
      console.log(doc);
      res.json(doc);
    });
});

// Route to create a new workout with exercises created on the current date
app.post("/createworkout", function (req, res) {
  console.log("creating new workout");
  console.log(req.body.type);

  // create exercise document first so you can put the _id in the workouts document
  db.Exercises.create(req.body)
    .then(function (exercise) {
      // If saved successfully, print the new exercise _id to the console
      console.log("exercise was created. exercise._id: " + exercise._id);

      // add this exercise to the workout db
      return db.Workouts.create({
        date: new Date(new Date().setDate(new Date().getDate())),
        exercises: [exercise._id],
      });
    })
    .then(function (workout, err) {
      if (err) {
        console.log("there was an error creating the workout: " + err);
      }
      console.log(workout);
      res.json(workout);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to add a new exercise to the exercise collection
app.post("/exercise/create", function(req,res) {
  console.log("creating a new exercise")
  console.log(req.body)

  db.Exercises.create(req.body)
  .then(function(exercise, err) {
    if (err) {
      console.log("there was an error creating the exercise: " + err);
    }
    console.log(exercise);
    res.json(exercise);
  })
  .catch(function (err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
})

// Route to add exercise to an existing workout by workoutId and exerciseId
app.post("/add/exercise", function(req,res) {
  console.log("adding an exercise to workout")
  console.log("workout id: " + req.body.workoutid)
  console.log("exerciseid" + req.body.exerciseid)

  db.Workouts.findById(req.body.workoutid)
  .then(function(db) {
    console.log("here it is: " + db)
  })

  db.Workouts.findOneAndUpdate({"_id": req.body.workoutid}, {
    $push : {
      exercises : req.body.exerciseid
    }},
    { new: true,upsert:false}
  )
  .then(function(workout) {
    console.log(workout)
    res.json(workout)
  })
  .catch(function (err) {
    // If an error occurs, print it to the console
    console.log(err.message);
  });


})



// TEST Routes
app.post("/test", function (req, res) {
  // return a test string
  console.log("testing");
  console.log(req.body);
  res.json({ message: "successful" });
});

app.get("/populate", function (req, res) {
  // add data to db

  db.Exercises.create({
    type: "resistance",
    name: "Bench Press",
    duration: 20,
    weight: 300,
    reps: 10,
    sets: 4,
  })
    .then(function (exercise) {
      // If saved successfully, print the new exercise _id to the console

      console.log("this is the exercise id: " + exercise._id);

      // add this exercise to the workout db
      return db.Workouts.create({
        date: new Date(new Date().setDate(new Date().getDate())),
        exercises: [exercise._id],
      });
    })
    .then(function (dbWorkout) {
      console.log("this is the new workout");
      console.log(dbWorkout);
    })
    .catch(function (err) {
      // If an error occurs, print it to the console
      console.log(err.message);
    });

  res.json({ message: "added test data to db" });
});



// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
