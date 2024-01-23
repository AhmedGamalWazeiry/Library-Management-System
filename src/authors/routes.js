const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getAuthors);
router.post("/", controller.addAuthor);
router.get("/:id", controller.getAuthorById);
router.put("/:id", controller.putAuthor);
router.patch("/:id", controller.patchAuthor);
router.delete("/:id", controller.deleteAuthor);

module.exports = router;
