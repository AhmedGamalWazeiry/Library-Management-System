const borrowedBookQueries = require("./queries"); // Update the import to your borrowed book queries
const bookQueries = require("../books/queries");
const { BookCopies } = require("../books/models");
const { BorrowedBooks } = require("./models");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs").promises;
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
  console.log(data);
  data = JSON.parse(data);
  if (data.length === 0) return 0;
  data = await writeSimplifiedObjectToJsonFile(data);

  await writeDataToCsv(data, filePath);
};

const isCopyBookExistAndAvaliable = async (copy_Id) => {
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
    return {
      isErrorOccur: isErrorOccur,
      messageError: messageError,
      bookCopy: currentCopyBook,
    };
  }
  return {
    isErrorOccur: false,
    messageError: "none",
    bookCopy: currentCopyBook,
  };
};
// Check if a borrowed book exists by ID
const CheckIfCanReturnBook = async (copy_id, user_id) => {
  // Update the function name
  const currentBorrowedBook = await BorrowedBooks.findOne({
    where: {
      Copy_ID: copy_id,
      User_ID: user_id,
      Return_Date: null,
    },
  });
  if (!currentBorrowedBook) {
    return {
      isErrorOccur: true,
      messageError:
        "Borrowed book not found with the specified data or you dont have this book to return it.", // Update the message
      borrowedBook: currentBorrowedBook,
    };
  }
  return {
    isErrorOccur: false,
    messageError: "none",
    borrowedBook: currentBorrowedBook,
  };
};

// const isQuantityAvailableForBook = async (bookId) => {
//   const availableQuantity = await db.oneOrNone(
//     borrowedBookQueries.getAvailableQuantity,
//     [bookId]
//   );

//   if (availableQuantity.available_quantity === 0) {
//     return {
//       isNotAvaliableBook: true,
//       errorMessage: "No copies available for this book at the moment.",
//     };
//   }
//   return { isNotAvaliableBook: false, errorMessage: "none" };
// };

// Validate request data based on the schema
const validateRequest = async (schema, req) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);
    if (error) {
      return {
        isError: true,
        message: error.details[0].message,
      };
    }
  }

  return { isError: false, message: "none" };
};

module.exports = {
  isCopyBookExistAndAvaliable, // Update the export
  validateRequest,
  CheckIfCanReturnBook,
  cleanAndExportBorrowingProcess,
};
