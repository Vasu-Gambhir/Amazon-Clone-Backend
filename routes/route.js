const express = require("express");
const router = new express.Router();
const Products = require("../models/productSchema.js");
const USER = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate.js");

//get productsdata API
router.get("/getproducts", async (req, res) => {
  try {
    const productsData = await Products.find();
    // console.log("Data from routes" + productsData);
    res.status(201).json(productsData);
  } catch (error) {
    console.log("error" + error.message);
  }
});

//get individual data
router.get("/getproducts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const productData = await Products.findOne({ id: id });
    // console.log("Data from routes" + productData);
    res.status(201).json(productData);
  } catch (error) {
    console.log("error" + error.message);
  }
});

//Register User
router.post("/register", async (req, res) => {
  // console.log(req.body);
  const { name, email, mobile, password, cpassword } = req.body;

  if (!name || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "Fill all the Fields" });
    console.log("no data available");
  }

  try {
    const preUser = await USER.findOne({ email: email });
    if (preUser) {
      res.status(422).json({ error: "Email is already registered" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "Password doest not match" });
    } else {
      const finalUser = new USER({
        name,
        email,
        mobile,
        password,
        cpassword,
      });
      //password hashing process

      const storedata = await finalUser.save();
      // console.log(storedata);
      res.status(201).json(storedata);
    }
  } catch (error) {
    console.log("error", error.message);
  }
});

//Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Fill all the Fields" });
    // console.log("no data available");
  }
  try {
    const userLogin = await USER.findOne({ email: email });
    // console.log("userLogin", userLogin);
    if (!userLogin) {
      return res.status(400).json({ message: `No account found for ${email}` });
    } else {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // console.log("isMatch", isMatch);

      if (!isMatch) {
        res.status(400).json({ message: "Incorrect Password" });
      } else {
        //token generate
        const token = await userLogin.generateAuthtoken();
        // console.log(token);
        res.cookie("AmazonClone", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.status(201).json({ userLogin });
      }
    }
  } catch (error) {
    console.log("error: Invalid Details" + error.message);
  }
});

//adding data in the cart

router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    // console.log(cart + "cart value");

    const UserContact = await USER.findOne({ _id: req.userID });
    // console.log(UserContact);

    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);
      await UserContact.save();
      // console.log(cartData);
      res.status(201).json(UserContact);
    } else {
      res.status(401).json({ error: "invalid User" });
    }
  } catch (error) {
    console.log("addcart API error", error.message);
  }
});

//get cart details
router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const buyuser = await USER.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    console.log("error in cartdetails API", error.message);
  }
});

//get valid user
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuser = await USER.findOne({ _id: req.userID });
    res.status(201).json(validuser);
  } catch (error) {
    console.log("error in cartdetails API", error.message);
  }
});

module.exports = router;

//remove item from cart
router.delete("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((currval) => {
      return currval.id != id;
    });

    await req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("item removed");
  } catch (error) {
    console.log(error, "from remove api");
    res.status(400).json(error, message);
  }
});

//logout API

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currele) => {
      return currele !== req.token;
    });

    res.clearCookie("AmazonClone", { path: "/" });

    await req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logged out");
  } catch (error) {
    console.log("error for user log out");
  }
});
