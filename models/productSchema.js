const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: String,
  url: String,
  detailUrl: String,
  title: Object,
  price: Object,
  description: Object,
  discount: String,
  tagline: String,
});

const Products = new mongoose.model("product", productSchema);

module.exports = Products;
