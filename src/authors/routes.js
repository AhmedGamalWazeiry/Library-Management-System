const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getAuthors); // Update the route handler
router.post("/", controller.addAuthor); // Update the route handler

router.get("/:id", controller.getAuthorById); // Update the route handler
router.put("/:id", controller.putAuthor); // Update the route handler
router.patch("/:id", controller.patchAuthor); // Update the route handler
router.delete("/:id", controller.deleteAuthor); // Update the route handler

module.exports = router;
