const addAuthor = async (req, res) => {
  const { first_name, last_name } = req.body;
  const author = await db.one(queries.addAuthor, [first_name, last_name]);
  res.status(200).json(author);
};
