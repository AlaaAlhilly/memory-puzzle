let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let high_score_Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required:true
    },
    name: {
        type: String,
    },
    picture: {
        type: String
    },
    high_score: {
      type: Number  
    }
});
let Score = mongoose.model("high_scores", high_score_Schema);
module.exports = Score;