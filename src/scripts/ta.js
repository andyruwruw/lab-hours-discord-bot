const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: String,
});
  
const TA = mongoose.model('TA', schema);

module.exports = TA;