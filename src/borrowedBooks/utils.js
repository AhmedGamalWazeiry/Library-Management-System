const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs").promises;
const { BookCopies } = require("../books/models");
const { Users } = require("../users/models");
const { BorrowedBooks } = require("./models");

const getAndValidateIdParams = (req, res) => {
  let error = false;
  const bookId = parseInt(req.params.id);
  if (isNaN(bookId) || !Number.isInteger(bookId)) {
    error = true;
    res
      .status(400)
      .json({ error: "Invalid author ID. Please provide a valid integer." });
  }
  return { bookId, error };
};

function asyncStringify(obj) {
  return new Promise((resolve, reject) => {
    try {
      let json = JSON.stringify(obj);
      resolve(json);
    } catch (err) {
      reject(err);
    }
  });
}

//--TO Do Make it recursive
async function writeSimplifiedObjectToJsonFile(data) {
  let flattenedList = data.map((obj) => {
    let newObj = {};
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        for (let subKey in obj[key]) {
          if (
            typeof obj[key][subKey] === "object" &&
            obj[key][subKey] !== null
          ) {
            for (let subSubKey in obj[key][subKey]) {
              if (
                typeof obj[key][subKey][subSubKey] === "object" &&
                obj[key][subKey] !== null
              ) {
                for (let subSubSubKey in obj[key][subKey][subSubKey]) {
                  newObj[subSubSubKey] =
                    obj[key][subKey][subSubKey][subSubSubKey];
                }
              } else newObj[subSubKey] = obj[key][subKey][subSubKey];
            }
          } else {
            newObj[subKey] = obj[key][subKey];
          }
        }
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  });

  return flattenedList;
}

const writeDataToCsv = async (data, path) => {
  try {
    await fs.access(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(path, "", "utf8");
    }
  }

  const csvWriter = createCsvWriter({
    path: path,

    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  // Write data to CSV
  await csvWriter.writeRecords(data);
};

const cleanAndExportBorrowingProcess = async (data, filePath) => {
  data = await asyncStringify(data);
  data = JSON.parse(data);

  if (data.length === 0) return 0;

  data = await writeSimplifiedObjectToJsonFile(data);

  await writeDataToCsv(data, filePath);
};

const isCopyBookExistAndAvaliable = async (copy_Id, res) => {
  const currentCopyBook = await BookCopies.findByPk(copy_Id);

  let isErrorOccur = false;
  let messageError = "";

  if (!currentCopyBook) {
    isErrorOccur = true;
    messageError = "Book Copy not found with the specified ID.";
  } else if (currentCopyBook.Status === "not available") {
    isErrorOccur = true;
    messageError = "this copy is not avaliable.";
  }

  if (isErrorOccur) {
    res.status(400).json(messageError);
  }

  return { currentCopyBook, isErrorOccur };
};

const isUserExist = async (user_id, res) => {
  let isError = false;
  const currentCopyBook = await Users.findByPk(user_id);

  if (!currentCopyBook) {
    isError = false;
    res.status(400).json("The user not found with the specified ID.");
  }

  return isError;
};
// Check if a borrowed book exists by ID
const CheckIfCanReturnBook = async (copy_id, user_id, res) => {
  let checkIsError = false;
  const borrowedBook = await BorrowedBooks.findOne({
    where: {
      Copy_ID: copy_id,
      User_ID: user_id,
      Return_Date: null,
    },
  });

  if (!borrowedBook) {
    checkIsError = true;
    res
      .status(400)
      .json(
        "Borrowed book not found with the specified data or you dont have this book to return it."
      );
  }

  return { borrowedBook, checkIsError };
};

const validateRequest = async (schema, req, res) => {
  let isError = false;
  if (Object.keys(req.body).length === 0) {
    isError = true;
    res.status(400).json("You haven't entered any keys.");
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);

    if (error) {
      isError = true;
      res.status(400).json(error.details[0].message);
    }
  }

  return isError;
};

module.exports = {
  isCopyBookExistAndAvaliable,
  validateRequest,
  CheckIfCanReturnBook,
  cleanAndExportBorrowingProcess,
  getAndValidateIdParams,
  isUserExist,
};
