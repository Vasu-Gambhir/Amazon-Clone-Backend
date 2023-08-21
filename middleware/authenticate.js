const jwt = require("jsonwebtoken");
const USER = require("../models/userSchema.js");
const secretKey = process.env.KEY;

const authenticate = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.AmazonClone;

    const verifytoken = jwt.verify(token, secretKey);

    console.log(verifytoken);

    const rootUser = await USER.findOne({
      _id: verifytoken._id,
      "tokens.token": token,
    });
    console.log(rootUser);

    if (!rootUser) {
      throw new Error("user not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).send("Unauthorised : No token provided");
    console.log("from authenticate.js", error.message);
  }
};

module.exports = authenticate;
