const { Books } = require("./models");
const { Authors } = require("../authors/models");

const getAndValidateIdParams = (req, res) => {
  const authorId = parseInt(req.params.id);
  if (isNaN(authorId) || !Number.isInteger(authorId))
    res
      .status(400)
      .json({ error: "Invalid author ID. Please provide a valid integer." });
  return authorId;
};

// Validate request data based on the schema
const validateRequest = async (schema, bookId, req, res) => {
  if (Object.keys(req.body).length === 0)
    res.status(400).json("You haven't entered any keys.");

  if (bookId) {
    const currentBook = await Books.findByPk(bookId);

    if (!currentBook)
      res.status(400).json("Book not found with the specified ID.");
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);
    if (error) res.status(400).json(error.details[0].message);

    const { isbn, author_id } = req.body;
    if (isbn) {
      const book = await Books.findOne({
        where: {
          ISBN: isbn,
        },
      });

      if (book && book.Book_ID !== bookId)
        res.status(400).json("This ISBN already exists!");
    }

    if (author_id) {
      const author = await Authors.findByPk(author_id);
      if (!author)
        res.status(400).json("The author with this ID does not exist.");
    }
  }
  return;
};

module.exports = {
  validateRequest,
  getAndValidateIdParams,
};
