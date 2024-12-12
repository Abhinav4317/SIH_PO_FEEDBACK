import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
      unique: true,
    },
    targets: {
      type: [{}],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Target = mongoose.model("Target", schema);
