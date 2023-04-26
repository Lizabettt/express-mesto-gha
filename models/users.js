const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30,
    default: ""
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30,
    default:""
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
