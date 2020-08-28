var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExerciseSchema object

var WorkoutSchema = new Schema({

    date: {
        type: Date,
        trim: true,
        required: "Date is required"
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: "Exercises"
        }
    ]

});

// This creates our model from the above schema, using mongoose's model method
var Workouts = mongoose.model("Workouts", WorkoutSchema);

// Export the Workout model
module.exports = Workouts;
