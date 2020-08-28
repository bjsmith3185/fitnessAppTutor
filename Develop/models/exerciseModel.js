var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExerciseSchema object

var ExerciseSchema = new Schema({

    type: {
        type: String,
        trim: true,
        required: "Type is required"
    },
    name: {
        type: String,
        trim: true,
        required: "An exercise name is required"
    },
    weight: {
        type: Number,
        trim: true
       
    },
    sets: {
        type: Number,
        trim: true
    },
    reps: {
        type: Number,
        trim: true
    },
    duration: {
        type: Number,
        trim: true,
        required: "A duration is required"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Exercises = mongoose.model("Exercises", ExerciseSchema);

// Export the Exercise model
module.exports = Exercises;
