const r = require('rethinkdb');
const BaseDao = require("./BaseDao");
const { Recipe } = require("../models");

class RecipeDao extends BaseDao {
  async addRecipe(recipe) {
    let result = await this.insert('recipes', recipe);
    return result;
  }

  async getRecipes() {
    let result = await this.getAll('recipes');
    return result;
  } 

  async getRecipe(id) {
    let result = await this.get('recipes', {id: id});
    return result[0];
  }

  async editRecipe(id, recipe) {
    let result = await this.update('recipes', {id: id}, recipe);
    return result;
  }

  async deleteRecipe(id) {
    let result = await this.delete('recipes', {id: id});
    return result;
  }
}

module.exports = RecipeDao; 