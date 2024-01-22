const getBorrowedBooks = "SELECT * FROM BorrowedBooks"; // Update the table name

const addBorrowedBook =
  "INSERT INTO BorrowedBooks (user_id, book_id, borrow_date) VALUES ($1, $2, $3) RETURNING *"; // Update the table name and column names

const updateBorrowedBook =
  "UPDATE BorrowedBooks SET user_id = $1, book_id = $2, borrow_date = $3 WHERE borrowed_book_id = $4 RETURNING *"; // Update the table name, column names, and id column name

const deleteBorrowedBook =
  "DELETE FROM BorrowedBooks WHERE borrowed_book_id = $1 RETURNING *"; // Update the table name and id column name

const getBorrowedBookByBookId =
  "SELECT * FROM BorrowedBooks WHERE book_id = $1"; // Update the table name

const getBorrowedBookById =
  "SELECT * FROM BorrowedBooks WHERE borrowedbook_id = $1"; // Update the table name and id column name

module.exports = {
  getBorrowedBooks,
  getBorrowedBookById,
  addBorrowedBook,
  updateBorrowedBook,
  deleteBorrowedBook,
  getBorrowedBookByBookId,
};
