const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    ta: {
        type: mongoose.Schema.ObjectId,
        ref: 'TA'
    },
    start: Date,
    end: Date,
    canceled: Boolean,
  });
  
  const LabHour = mongoose.model('LabHour', schema);

  module.exports = LabHour;