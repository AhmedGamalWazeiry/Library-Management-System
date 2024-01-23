const { Router } = require("express");
const controller = require("./controller");

const router = Router();

// router.get("/", controller.getUsers); // Update the route handler
router.post("/borrow-book", controller.borrowBook); // Update the route handler
router.post("/return-book", controller.returnBook); // Update the route handler
router.get("/user-borrowed-books", controller.borrowedBooks);

// router.get("/:id", controller.getUserById); // Update the route handler
// router.put("/:id", controller.putUser); // Update the route handler
// router.patch("/:id", controller.patchUser); // Update the route handler
// router.delete("/:id", controller.deleteUser); // Update the route handler

module.exports = router;
