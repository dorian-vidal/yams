const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 3,
  },
  winnings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pastry" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
