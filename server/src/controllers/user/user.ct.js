const UserModel = require("../../mongodb/mongo");
// const { GridFSBucket, ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const fs = require("fs");
const upload = require("../../middlewares/upload");
const dbConfig = require("../../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = dbConfig.url;
const baseUrl = "http://localhost:3001/v1/api/user/files/";
const mongoClient = new MongoClient(url);
const path = require("path");
const { ObjectId } = require("mongodb");
const { ObjectID } = require("mongodb");

module.exports = {
  createUser: async (req, res) => {
    // Checking if the Account Already Exists
    const { uid } = req.params;
    const accountAlreadyExists = await UserModel.exists({
      uid,
    });
    if (accountAlreadyExists)
      return res.status(403).json({
        user: null,
        error: { message: "This account has already been created." },
      });

    const { email, username } = req.body;

    const user = await UserModel.create({
      email,
      username,
      uid,
    });
    res.status(200).json({ user, error: null });
  },
  getUser: async (req, res) => {
    try {
      const { uid } = req.params;

      // Find the user document by UID
      const user = await UserModel.findOne({ uid });

      if (!user) {
        // User not found
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user, error: null });
    } catch (error) {
      // Error occurred while fetching user information
      console.error("Error fetching user information:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { uid } = req.params;

      // Find the user by uid and delete it
      const user = await UserModel.findOneAndDelete({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  editUsername: async (req, res) => {
    try {
      const { uid } = req.params;
      const newUsername = req.body.username;

      // Find the user by userId
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Original username:", user.username); // Log original username

      // Update the username
      user.username = newUsername;

      console.log("Updated username (in memory):", user.username); // Log updated username

      // Save the updated user object to the database
      const updatedUser = await user.save();

      console.log("Updated username (after save):", updatedUser.username); // Log saved username

      // Return the updated user object as response
      res.json({ message: "Username updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating username:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  uploadFiles: async (req, res) => {
    try {
      const { uid } = req.params;

      // Execute the file upload middleware
      await upload(req, res);

      // Check if file was uploaded
      if (req.file == undefined) {
        return res.send({
          message: "You must select a file.",
        });
      }

      // Find the user by UID
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Replace or add the uploaded profile picture metadata
      if (user.profilePicture && user.profilePicture.length > 0) {
        // If user has an existing profile picture, replace it with the new one
        user.profilePicture[0] = {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          fileID: req.file.id,
        };
      } else {
        // If user has no existing profile picture, create the profilePicture array and add the new one
        user.profilePicture = [
          {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            fileID: req.file.id,
          },
        ];
      }

      // Save the updated user object to the database
      await user.save();

      return res
        .status(200)
        .json({ message: "Profile picture uploaded successfully", user });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getListFiles: async (req, res) => {
    try {
      await mongoClient.connect();

      const database = mongoClient.db(dbConfig.database);
      const images = database.collection(dbConfig.imgBucket + ".files");

      const cursor = images.find({});

      if ((await cursor.count()) === 0) {
        return res.status(500).send({
          message: "No files found!",
        });
      }

      let fileInfos = [];
      await cursor.forEach((doc) => {
        fileInfos.push({
          name: doc.filename,
          url: baseUrl + doc.filename,
        });
      });

      return res.status(200).send(fileInfos);
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  download: async (req, res) => {
    try {
      const { uid } = req.params;

      await mongoClient.connect();

      const database = mongoClient.db(dbConfig.database);
      const bucket = new GridFSBucket(database, {
        bucketName: dbConfig.imgBucket,
      });

      // Fetch the user by UID to ensure the file belongs to the correct user
      const user = await UserModel.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get the profile picture file associated with the user
      const profilePicture = user.profilePicture[0]; // Assuming only one profile picture for simplicity

      if (!profilePicture) {
        return res
          .status(404)
          .json({ error: "Profile picture not found for the user" });
      }

      // Open a download stream for the profile picture file
      const downloadStream = bucket.openDownloadStreamByName(
        profilePicture.fileName
      );

      // Stream the file data to the response
      downloadStream.on("data", function (data) {
        res.status(200).send({ data });
      });

      // Handle errors
      downloadStream.on("error", function (err) {
        res.status(404).send({ message: "Cannot download the image!" });
      });

      // Close the response stream when the download is complete
      downloadStream.on("end", () => {
        res.end();
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getHome: (req, res) => {
    return res.sendFile(
      path.join(
        `${__dirname}/../../../../../client/src/components/pages/Settings/ImageFileInputPopup.js`
      )
    );
  },
};
