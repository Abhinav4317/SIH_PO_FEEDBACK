import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
    },
    schemes: {
      type: [String],
    },
    suggestion: {
      type: String,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model("Feedback", schema);
