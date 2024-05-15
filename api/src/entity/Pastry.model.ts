const mongoose = require("mongoose");

const pastrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
});

const PastryEntity = mongoose.model("Pastry", pastrySchema);
export default PastryEntity;
