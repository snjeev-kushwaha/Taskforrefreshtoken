const express = require("express");

const userRoute = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");

const { verifyToken, refreshToken } = require("../middleware/validateToken");

userRoute.post("/createuser", createUser);

userRoute.post("/login", loginUser);

userRoute.get("/users", verifyToken, getAllUsers);

userRoute.post("/me", refreshToken);

module.exports = { userRoute };
