const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/search", controller.search);

router.get("/", controller.getBooks);
router.post("/", controller.addBook);

router.get("/:id", controller.getBookById);
router.put("/:id", controller.putBook);
router.patch("/:id", controller.patchBook);
router.delete("/:id", controller.deleteBook);

module.exports = router;
