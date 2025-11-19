import mongoose from "mongoose";

const PublisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("Publisher", PublisherSchema);
