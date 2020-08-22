const express = require('express');
const router = express.Router();
const privateRoute = require('../middleware/privateRoute');
const { RecipeDao } = require('../db');
const { Recipe } = require('../models');

router.use(privateRoute);

router.get('/', async (req, res) => {
  let recipeDao = new RecipeDao();  
  await recipeDao.connect();
  let recipes = await recipeDao.getRecipes();
  await recipeDao.close();
  res.status(200).send(recipes);
})

router.get('/:recipeId', async (req, res) => {
  let recipeDao = new RecipeDao();  
  await recipeDao.connect();
  let recipe = await recipeDao.getRecipe(req.params.recipeId);
  await recipeDao.close();
  res.status(200).send(recipe);
})

router.post('/', async (req, res) => {
  let recipe = new Recipe(req.body);
  recipe.author = req.user.username;
  let recipeDao = new RecipeDao();
  await recipeDao.connect();
  let result = await recipeDao.addRecipe(recipe);
  await recipeDao.close();
  res.status(200).send(result)
})

router.post('/:recipeId', async (req, res) => {
  let recipeDao = new RecipeDao();  
  await recipeDao.connect();
  let recipe = await recipeDao.getRecipe(req.params.recipeId);
  if (recipe.author !== req.user.username) {
    console.log(recipe.author, req.user.username);
    await recipeDao.close();
    res.status(403).send({ message: "You do not have permission to edit this recipe"});
  }
  else {
    let result = await recipeDao.editRecipe(req.params.recipeId, req.body);
    await recipeDao.close();
    res.status(200).send(result);
  }
})

router.delete('/:recipeId', async (req, res) => {
  let recipeDao = new RecipeDao();  
  await recipeDao.connect();
  let recipe = await recipeDao.getRecipe(req.params.recipeId);
  if (recipe.author !== req.user.username) {
    console.log(recipe.author, req.user.username);
    await recipeDao.close();
    res.status(403).send({ message: "You do not have permission to delete this recipe"});
  }
  else {
    let result = await recipeDao.deleteRecipe(req.params.recipeId);
    await recipeDao.close();
    res.status(200).send(result);
  }
})

module.exports = router
