const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getUsers);
router.post("/", controller.addUser);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.putUser);
router.patch("/:id", controller.patchUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
