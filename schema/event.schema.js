import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    image: {
      type: String, // URL or file path to uploaded image
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // or Date if using full datetime
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // or 'User' depending on your system
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
