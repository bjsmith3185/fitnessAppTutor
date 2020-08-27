var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExerciseSchema object

var WorkoutSchema = new Schema({

    date: {
        type: String,
        trim: true,
        required: "Type is required"
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: "Exercise"
        }
    ]

});

// This creates our model from the above schema, using mongoose's model method
var Workout = mongoose.model("Workout", WorkoutSchema);

// Export the Workout model
module.exports = Workout;
