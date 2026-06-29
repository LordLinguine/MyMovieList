// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");

// const storage = new GridFsStorage({
//   url: "mongodb+srv://VG123:Abcd123$@customers.c411cqs.mongodb.net/myMovieList?retryWrites=true&w=majority&appName=Customers",
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     return {
//       filename: file.originalname,
//       bucketName: "uploads", // Change this to the desired bucket name
//     };
//   },
// });

// const upload = multer({ storage });
// module.exports = upload;

const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      // const filename = `${Date.now()}--${file.originalname}`;
      const filename = `${file.originalname}`;
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: `${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

// var uploadFile = multer({ storage: storage }).single("file");
// var uploadFiles = multer({ storage: storage }).array("file", 10);
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;
