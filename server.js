require("dotenv").config();
require("express-async-errors");
const morgan = require("morgan");
const express = require("express");
const authorsRoutes = require("./src/authors/routes");
const booksRoutes = require("./src/books/routes");
const usersRoutes = require("./src/users/routes");
const borrowedBooksRoutes = require("./src/borrowedBooks/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");
const rateLimit = require("express-rate-limit");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 30 * 1000, // 0.5 m
  max: 1,
});

app.use("/api/v1/borrowed-books/export-over-due-books-last-month", apiLimiter);
app.use(
  "/api/v1/borrowed-books/export-borrow-books-proccess-last-month",
  apiLimiter
);

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("public"));
app.use(morgan("tiny"));

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world from my");
});

app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/borrowed-books", borrowedBooksRoutes);
app.use("/api/v1/authors", authorsRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.detail) {
    res.status(500).send(`Error:${err.detail} `);
  } else {
    res.status(500).send(`Something went Wrong11111111111111111111111111!`);
  }
});
app.listen(port, () => console.log(`app listening on port ${port}`));
