const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    createdAt: {
        type: mongoose.Schema.Types.Date,
    },
    age: {
        type: String
    },
    counts: {
        type: mongoose.Schema.Types.Array
    }
});

module.exports = Records = mongoose.model("Records", recordSchema);