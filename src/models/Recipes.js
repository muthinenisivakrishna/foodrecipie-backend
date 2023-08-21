import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  ingredients: {
      type: String,
      required: true,
    },
  instructions: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const RecipeModel = mongoose.model("recipes", RecipeSchema);
