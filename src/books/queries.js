const getBooks =
  "SELECT book_id,title,isbn,available_quantity,shelf_location,CONCAT(a.first_name ,' ', a.last_name) as author FROM Books join Authors a using (author_id) ";
const getBooksCopies =
  "SELECT copy_id,book_id,title,isbn,available_quantity,shelf_location,CONCAT(a.first_name ,' ', a.last_name) as author,status FROM Books join Authors a using (author_id) join BookCopies using(book_id) ";
const getBookById =
  "SELECT book_id,title,isbn,available_quantity,shelf_location,CONCAT(a.first_name ,' ', a.last_name) as author FROM Books  join authors a using (author_id) WHERE book_id = $1 ";
const addBook =
  "INSERT INTO Books (title,isbn,available_quantity,shelf_location,author_id) VALUES ($1,$2,$3,$4,$5) RETURNING *";

const putBook =
  "UPDATE Books SET title = $1, isbn = $2, available_quantity = $3, shelf_location = $4, author_id = $5 WHERE book_id = $6 RETURNING *";

const patchBook = "UPDATE Books SET  WHERE book_id = $1 RETURNING *";

const deleteBook = "DELETE FROM Books Where book_id = $1 RETURNING *";

const search =
  "SELECT book_id,title,isbn,available_quantity,shelf_location,CONCAT(a.first_name ,' ', a.last_name) as author FROM Books join Authors a using (author_id) where ($1 != 'none' and title ilike '%$1#%') or ($2 != 'none'  and isbn ilike '%$2#%') or ($3 != 'none'  and CONCAT(a.first_name ,' ', a.last_name)  ilike '%$3#%')  ";

const isISBNExist = "Select * from books where isbn = $1";

const addCopy = "INSERT INTO BookCopies (book_id) VALUES ($1) RETURNING *";

const deleteCopy = "DELETE FROM BookCopies Where copy_id = $1 RETURNING *";

const getCopy = "Select * FROM BookCopies Where copy_id = $1 ";

const avalibleBookCopies =
  "Select Count(*) from BookCopies where book_id = $1 and status = 'available'";

const UpdateBookCopyStatus =
  "UPDATE BookCopies SET status = $2 WHERE copy_id = $1 RETURNING *";

module.exports = {
  getBooks,
  getBookById,
  addBook,
  putBook,
  patchBook,
  deleteBook,
  search,
  isISBNExist,
  addCopy,
  getBooksCopies,
  avalibleBookCopies,
  deleteCopy,
  getCopy,
  UpdateBookCopyStatus,
};
