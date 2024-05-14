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
  }, // Nombre de tentatives restantes
  winnings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pastry" }], // Références aux pâtisseries gagnées
});

const User = mongoose.model("User", userSchema);

module.exports = User;
