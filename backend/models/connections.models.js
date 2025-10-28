import mongoose, { Mongoose } from "mongoose";

const connectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  statusAccepted: {
    type: Boolean,
    default: null,
  },
});

const Connection = mongoose.model("Connection", connectionSchema);
export default Connection;
