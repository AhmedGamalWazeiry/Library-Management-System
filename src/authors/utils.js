const { Authors } = require("./models");

const getAndValidateIdParams = (req, res) => {
  const authorId = parseInt(req.params.id);
  if (isNaN(authorId) || !Number.isInteger(authorId))
    res
      .status(400)
      .json({ error: "Invalid author ID. Please provide a valid integer." });
  return authorId;
};

// Validate request data based on the schema
const validateRequest = async (schema, authorId, req, res) => {
  if (Object.keys(req.body).length === 0)
    res.status(400).json("You haven't entered any keys.");

  let currentAuthor = null;

  if (authorId) {
    currentAuthor = await Authors.findByPk(authorId);
    if (!currentAuthor)
      res.status(400).json("Author not found with the specified ID.");
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);
    if (error) res.status(400).json(error.details[0].message);

    let { first_name, last_name } = req.body;
    if (!first_name) first_name = currentAuthor.First_Name;
    if (!last_name) last_name = currentAuthor.Last_Name;

    const author = await Authors.findOne({
      where: {
        First_Name: first_name,
        Last_Name: last_name,
      },
    });
    if (author && author.Author_ID !== authorId)
      res
        .status(400)
        .json(
          "The entered first name or last name is already in use. Please choose a unique name."
        );
  }

  return;
};

module.exports = {
  validateRequest,
  getAndValidateIdParams,
};
