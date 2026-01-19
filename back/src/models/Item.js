import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // <-- liste des utilisateurs qui ont mis en favori
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
