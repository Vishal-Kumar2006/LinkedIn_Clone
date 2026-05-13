import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import postsRoutes from "../backend/routes/posts.routes.js";
import usersRoutes from "../backend/routes/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

const MONGO_URL = process.env.URL;

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB is Connected Successfully");

    app.listen(9090, () => {
      console.log("Server is running on port http://localhost:9090");
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
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
