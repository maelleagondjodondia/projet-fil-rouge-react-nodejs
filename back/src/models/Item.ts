import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  photo?: string;
}

const ItemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    photo: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", ItemSchema);
