require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/db.js");
const Products = require("./models/productSchema.js");
const DefaultData = require("./defaultData.js");
const cors = require("cors");
const router = require("./routes/route.js");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser(""));

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://amazon-clone-vg.netlify.app"],
    credentials: true,
  })
);

// app.options("*", cors());

app.use(router);

const port = process.env.PORT || 8005;

app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});

DefaultData();
