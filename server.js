require("dotenv").config();
require("express-async-errors");
const morgan = require("morgan");
const express = require("express");
const booksRoutes = require("./src/books/routes");
const borrowersRoutes = require("./src/borrowers/routes");

const app = express();

app.use(express.json());

app.use(express.static("public"));
app.use(morgan("tiny"));

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world from my");
});

app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/borrowers", borrowersRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.detail) {
    res.status(500).send(`Error:${err.detail} `);
  } else {
    res.status(500).send(`Something went Wrong!`);
  }
});
app.listen(port, () => console.log(`app listening on port ${port}`));
