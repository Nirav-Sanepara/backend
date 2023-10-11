const router = require("express").Router();
const user = require("../Controller/User");
const { verifyToken } = require("../middleware/auth");

router.post("/", user.postCreateUser);
router.post("/login", user.postLoginUser);
// router.post("/register", user.registerUser);
router.get("/", verifyToken, user.getAllUsers);
router.get("/:id", verifyToken, user.getUserById);
router.delete("/:id", verifyToken, user.deleteUser);
router.put("/:id", verifyToken, user.updateUserDetails);

module.exports = router;