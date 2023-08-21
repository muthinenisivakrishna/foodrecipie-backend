import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { RecipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", RecipesRouter);

mongoose.connect(
  "mongodb+srv://foodRecipeUser:lWvjTcEmDIf0nAUt@foodrecipecluster.zfoy5fw.mongodb.net/foodRecipeApp?retryWrites=true&w=majority"
);

app.listen(9001, (req, res) => {
  console.log("SERVER STARTED!!!");
});
