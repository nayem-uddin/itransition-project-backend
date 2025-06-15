const express = require("express");
const app = express();
const cors = require("cors");
const {
  authenticate,
  register,
  adminAccess,
  getAdminsList,
  updateAdminStatus,
  deleteAdmins,
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
      return res
        .status(401)
        .send({ message: "Invalid credentials or account doesn't exist" });
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
        .send({ message: "Invalid credentials or account doesn't exist" });
    } else if (adminInfo.status === "blocked") {
      return res.status(403).send({ message: "Sorry, you are blocked" });
    }
    res.status(200).send({ message: "Access granted", adminInfo });
  } catch (error) {
    next(error);
  }
});

app.get("/admins", async (req, res, next) => {
  try {
    const adminsList = await getAdminsList();
    res.status(200).send({ message: "Fetched successfully", adminsList });
  } catch (error) {
    next(error);
  }
});

app.put("/admins", async (req, res, next) => {
  try {
    const { selectionList, status } = req.body;
    const idList = selectionList.map((admin) => admin.id);
    await updateAdminStatus(idList, status);
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    next(error);
  }
});

app.delete("/admins", async (req, res, next) => {
  try {
    const admins = await deleteAdmins(req.body);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
});
