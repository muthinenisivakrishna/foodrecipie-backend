import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    await recipe.save();
    res.json(recipe);
  } catch (error) { 
    res.json({ message: error });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userId);
    user.savedRecipes.push(recipe);
    user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    if (req.body.created === false) {
      const recipe = await RecipeModel.findById(req.body.recipeId);
      const user = await UserModel.findById(req.body.userId);
      user.savedRecipes.pull(recipe);
      user.save();
      res.json({ savedRecipes: user.savedRecipes });
    }else if(req.body.created){
      RecipeModel.deleteOne({ _id: req.body.recipeId, userOwner: req.body.userId }).exec();
      res.json({ message: "Recipe deleted" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/search/:searchTerm", async (req, res) => {
  try {
    const response = await RecipeModel.find({
      $or: [
        { title: { $regex: req.params.searchTerm, $options: "i" } },
        { description: { $regex: req.params.searchTerm, $options: "i" } },
        { ingredients: { $regex: req.params.searchTerm, $options: "i" } },
      ],
    });
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:recipeId", async (req, res) => {
  try {
    const response = await RecipeModel.findById(req.params.recipeId);
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/creator/:userId", async (req, res) => {
  try {
    const response = await RecipeModel.find({
      userOwner: req.params.userId,
    });
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

router.put("/edit/:recipeId", verifyToken,  async (req, res) => {
  try {
    const response = await RecipeModel.findByIdAndUpdate(
      req.params.recipeId,
      req.body
    );
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});



export { router as RecipesRouter };
