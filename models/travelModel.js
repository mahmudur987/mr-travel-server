const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const travelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pictures: [String],
  destination: {
    country: String,
    state: String,
    city: String,
    district: String,
  },
  planing: [
    {
      time: String,
      description: String,
      picture: String,
    },
  ],
  spots: [String],
  maxMembers: {
    type: Number,
    required: true,
  },
  nonBookedSeats: {
    type: Number,
    required: true,
  },
  bookedmember: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Replace "User" with the appropriate model name for the users collection
      },
      userName: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  publishDate: {
    type: String,
    default: Date.now(),
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  bestDeals: {
    type: Boolean,
    default: false,
  },
});

const events = mongoose.model("Events", travelSchema);

module.exports = events;
