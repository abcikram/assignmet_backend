const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
    }],
},
    {
        timestamps: true
    });

module.exports = mongoose.model('question', QuestionSchema);
