const express = require("express");
const app = express();
const cors = require("cors");
const {
  authenticate,
  register,
  adminAccess,
} = require("./handleDB/handleQueries");
const { UniqueConstraintError } = require("sequelize");

app.use(cors());
app.use(express.json());
app.listen(4000, () => {
  console.log("app listening at localhost:4000");
});

app.post("/signup", async (req, res, next) => {
  try {
    const userInfo = await register(req.body);
    res.status(201).send({ message: "Signup successful", userInfo });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .send({ message: "Username and email must be unique" });
    }
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const userInfo = await authenticate(req.body);
    if (userInfo === null) {
      return res.status(401).send({ message: "User doesn't exist" });
    }
    res.status(200).send({ message: "Login successful", userInfo });
  } catch (error) {
    next(error);
  }
});

app.post("/admin-login", async (req, res, next) => {
  try {
    const adminInfo = await adminAccess(req.body);
    if (adminInfo === null) {
      return res
        .status(404)
        .send({ message: "Sorry, you have no admin access" });
    }
    res.status(200).send({ message: "Access granted", adminInfo });
  } catch (error) {
    next(error);
  }
});
