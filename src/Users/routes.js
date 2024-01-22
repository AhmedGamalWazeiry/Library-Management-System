const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getUsers); // Update the route handler
router.post("/", controller.addUser); // Update the route handler

router.get("/:id", controller.getUserById); // Update the route handler
router.put("/:id", controller.putUser); // Update the route handler
router.patch("/:id", controller.patchUser); // Update the route handler
router.delete("/:id", controller.deleteUser); // Update the route handler

module.exports = router;
