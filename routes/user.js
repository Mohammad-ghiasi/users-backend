const express = require("express");

const { signup, users, login, updateUsers, deleteUser, user } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/updateUsers/:userId", updateUsers);
router.get("/users", users);
router.get("/user/:userId", user);
router.delete("/delete/:userId", deleteUser);

module.exports = router;
