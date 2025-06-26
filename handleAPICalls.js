const {
  authenticate,
  register,
  adminAccess,
  getAdminsList,
  updateAdminStatus,
  deleteAdmins,
  addNewAdmins,
  getAllUsers,
  updateUserStatus,
  deleteUsers,
  createTemplate,
  updateTemplate,
} = require("./handleDB/handleQueries");
const { UniqueConstraintError, OptimisticLockError } = require("sequelize");
const {
  validateAdminAccess,
  limiter,
  validateUserAccess,
  validateTemplate,
} = require("./middleware");
const { frontEndUrl } = require("./handleDB/utilities");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// app.listen(5000, () => {
//   console.log("Server running at port 5000");
// });
app.use(
  cors({
    origin: frontEndUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use("/admins", validateAdminAccess);
app.use("/users", validateAdminAccess);
app.use("/templates", validateUserAccess);

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
    } else if (userInfo.status === "blocked") {
      return res.status(403).send({ message: "You are blocked" });
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
    await updateAdminStatus(selectionList, status);
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return res
        .status(409)
        .send({ message: "Please try again after a while" });
    }
    next(error);
  }
});

app.delete("/admins", async (req, res, next) => {
  try {
    await deleteAdmins(req.body);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return res
        .status(409)
        .send({ message: "Please try again after a while" });
    }
    next(error);
  }
});

app.post("/admins", async (req, res, next) => {
  try {
    const newAdmins = await addNewAdmins(req.body);
    res
      .status(201)
      .send({ message: "Successfully added to admins' list", newAdmins });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .send({ message: "One or more users are already admins" });
    }
    next(error);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const usersList = await getAllUsers();
    res.status(200).send({ message: "fetched successfully", usersList });
  } catch (error) {
    next(error);
  }
});

app.put("/users", async (req, res, next) => {
  try {
    const { selectionList, status } = req.body;
    await updateUserStatus(selectionList, status);
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return res
        .status(409)
        .send({ message: "Please try again after a while" });
    }
    next(error);
  }
});

app.delete("/users", async (req, res, next) => {
  try {
    await deleteUsers(req.body);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return res
        .status(409)
        .send({ message: "Please try again after a while" });
    }
    next(error);
  }
});

app.post("/templates", validateTemplate, async (req, res, next) => {
  try {
    await createTemplate(req.body);
    res
      .status(201)
      .send({ text: "Template created Successfully", type: "confirmation" });
  } catch (error) {
    next(error);
  }
});

app.put("/templates", validateTemplate, async (req, res, next) => {
  try {
    await updateTemplate(req.body);
    res
      .status(200)
      .send({ text: "Successfully updated", type: "confirmation" });
  } catch (error) {
    next(error);
  }
});

module.exports = { app };
