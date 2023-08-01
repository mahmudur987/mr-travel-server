const mongoose = require("mongoose");
const { Schema } = mongoose;

const travelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },

  joinDate: {
    type: String,
    default: Date.now(),
  },
});

const users = mongoose.model("User", travelSchema);

module.exports = users;
