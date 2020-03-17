const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    ta: {
        type: mongoose.Schema.ObjectId,
        ref: 'TA'
    },
    start: Number,
    end: Number,
    canceled: Boolean,
});
  

  // Profile Object
const LabHour = mongoose.model('LabHour', schema);

// Export
module.exports = LabHour;