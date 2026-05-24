import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    pinned: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "#FFFFFF", // Default: white
    },
    fontStyle: {
      type: String,
      required: false,
      default: "Arial",
    },
    fontSize: {
      type: Number,
      required: false,
      default: 14,
    },
    images: {
      type: [{
        url: String,
        id: String
      }],
      default: []
    },
    archived: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: Date,
      required: false,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;