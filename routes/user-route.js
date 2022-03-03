const express = require("express");
const {
  createAccount,
  getUser,
  editUser,
  deleteUser,
  getUsers,
} = require("../controllers/user-controller");
const { isLogin, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", isAdmin, createAccount);
router.get("/profile", isLogin, getUser);
router.get("/users", isAdmin, getUsers);
router.put("/edit", isAdmin, editUser);
router.delete("/delete", isAdmin, deleteUser);

module.exports = router;
