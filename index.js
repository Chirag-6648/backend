import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/connectDb.js";

dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

connectDb().then(() => {
  try {
    app.listen(port, () => {
      console.log(`server is latening on port ${port} `);
    });
  } catch (error) {
    console.log("mongodb connection failed !!", error);
  }
});

import userRoutes from "./route/user.routes.js";
app.use("/user", userRoutes);
