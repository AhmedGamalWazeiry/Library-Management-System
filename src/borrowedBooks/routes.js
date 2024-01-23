const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.borrowedBooks);
router.post("/borrow-book", controller.borrowBook);
router.post("/return-book", controller.returnBook);
router.get("/user-borrowed-books", controller.userBorrowedBooks);
router.get("/overed-due", controller.overDueBorrowedBooks);
router.get("/library-borrowing-insights", controller.libraryBorrowingInsights);
router.get(
  "/export-over-due-books-last-month",
  controller.exportOverDueBorrowedBooksLastMonth
);

router.get(
  "/export-borrow-books-proccess-last-month",
  controller.exportBorrowBooksProccessLastMonth
);
router.put("/:id", controller.putBorrowedBooks);

module.exports = router;
