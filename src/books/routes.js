const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/search", controller.search);
router.get("/", controller.getBooks);
router.post("/", controller.addBook);
router.get("/copies", controller.getBooksCopies);
router.post("/copies", controller.addBookCopy);
router.get("/:id", controller.getBookById);
router.put("/:id", controller.putBook);
router.patch("/:id", controller.patchBook);
router.delete("/:id", controller.deleteBook);
router.delete("/copies/:id", controller.deleteBookCopy);

module.exports = router;
