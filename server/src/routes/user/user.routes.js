const userRouter = require("express-promise-router")();
const { authUser } = require("../../middlewares/auth.mw");
const upload = require("../../middlewares/upload");
const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/home");
const uploadController = require("../../controllers/upload");
const dbConfig = require("../../config/db");

// Controllers
const {
  createUser,
  getUser,
  deleteUser,
  editUsername,
  uploadFiles,
  getListFiles,
  download,
  getHome,
} = require("../../controllers/user/user.ct");

// POST - Create User
userRouter.post("/:uid", authUser, createUser);

// GET - Get User Data
userRouter.get("/:uid", authUser, getUser);

// OLD:
// Example Postman URL:
// http://localhost:3001/v1/api/user/upload/W76bg1VFYLeh4xN7mNDjxxiR2QG3
// Body > form-data > key drop down arrow "File" > key: "file"
// value: any profile picture > Content type: multipart/form-data
// userRouter.post("/upload/:uid", addProfilePicture);

// Delete - Delete a User
// Example Postman URL:
// http://localhost:3001/v1/api/user/W76bg1VFYLeh4xN7mNDjxxiR2QG3
userRouter.delete("/:uid", authUser, deleteUser);

// Put - Edit a Username
// http://localhost:3001/v1/api/user/users/exanSco2MkNfK3TR21a6u2iIE8H3
// {
//     "username": "WheresBasketBrawl123"
// }
userRouter.patch("/:uid", authUser, editUsername);

// userRouter.get("/home", getHome);

// Upload a picture to the uid
// http://localhost:3001/v1/api/user/upload/picture/9kj03Vt1uWWqXYwwF3wwuQUCp6n2/
userRouter.post("/upload/picture/:uid", authUser, uploadFiles);

// List of all pictures uploaded
// userRouter.get("/files/list", getListFiles);

// Get the picture associated with the user id
// http://localhost:3001/v1/api/user/files/9kj03Vt1uWWqXYwwF3wwuQUCp6n2/
userRouter.get("/files/:uid", authUser, download);

module.exports = userRouter;
