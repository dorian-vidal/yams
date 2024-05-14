const mongoose = require("mongoose");

// const pastrySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   stock: { type: Number, required: true },
//   quantityWon: { type: Number, required: true, default: 0 },
//   winner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Modifié pour permettre plusieurs gagnants
// });

// const Pastry = mongoose.model("Pastry", pastrySchema);
// module.exports = Pastry;

const pastrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
});

const PastryEntity = mongoose.model("Pastry", pastrySchema);
export default PastryEntity;
