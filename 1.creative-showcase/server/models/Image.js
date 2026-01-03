import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Image", imageSchema);
