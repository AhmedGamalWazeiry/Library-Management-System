const getBorrowedBooks =
  "SELECT title,CONCAT(a.first_name ,' ', a.last_name) as author,isbn,status,due_date,checkout_date FROM BorrowedBooks join bookcopies bc using (copy_id) join books b using (book_id) join authors a using(author_id)  where user_id=$1";

const borrowBook =
  "INSERT INTO BorrowedBooks (user_id, copy_id, due_date) VALUES ($1, $2, $3) RETURNING *";

const UpdateBorrowedBookReturnDate =
  "UPDATE BorrowedBooks SET  return_date = $1  WHERE user_id = $2 and copy_id = $3 RETURNING *";

const getAvailableQuantity =
  "Select Available_Quantity from books where copy_id = $1";

const deleteBorrowedBook =
  "DELETE FROM BorrowedBooks WHERE borrowed_book_id = $1 RETURNING *";

const getBorrowedBookByBookId =
  "SELECT * FROM BorrowedBooks WHERE copy_id = $1";

const CheckIfCanReturnBook =
  "SELECT * FROM BorrowedBooks WHERE copy_id = $1 and user_id = $2 and return_date is null";

module.exports = {
  getBorrowedBooks,
  borrowBook,
  deleteBorrowedBook,
  getBorrowedBookByBookId,
  UpdateBorrowedBookReturnDate,
  getAvailableQuantity,
  CheckIfCanReturnBook,
};
