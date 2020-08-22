class Recipe {
  constructor(args) {
    this.name = args.name || "Untitled";
    this.subtitle = args.subtitle || "";
    this.author = args.author || "";
    this.servings = args.servings || 2;
    this.cookTime = args.cookTime || "";
    this.tags = args.tags || [];
    this.description = args.description || "";
    this.instructions = args.instructions || [];
    this.pictureLink = args.pictureLink || "";
    this.link = args.link || "";
    this.ingredients = args.ingredients || [];
  }
}

module.exports = Recipe;
