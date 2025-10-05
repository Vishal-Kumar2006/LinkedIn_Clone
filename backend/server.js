import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postsRoutes from "../backend/routes/posts.routes.js";
import usersRoutes from "../backend/routes/users.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://LinkedIN_Clone:password438455@cluster0.jhjft6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB is Connected Successfully");

    app.listen(9090, () => {
      console.log("🚀 Server is running on port http://localhost:9090");
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};
start();

// Home Route
app.get("/", (req, res) => {
  res.send("This is the home page");
});

// Post Routes
app.use(postsRoutes);

// User Routes
app.use(usersRoutes);
