const Products = require("./models/productSchema.js");
const productsData = require("./constant/productsData.js");

const DefaultData = async () => {
  try {
    // const deleteData = await Products.deleteMany({});
    // const storeData = await Products.insertMany(productsData);
    // console.log(storeData);
  } catch (error) {
    console.log("error" + error.message);
  }
};

module.exports = DefaultData;
