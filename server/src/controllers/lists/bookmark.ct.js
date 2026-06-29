const UserModel = require("../../mongodb/mongo");

module.exports = {
  addBookmark: async (req, res) => {
    const { uid } = req.params;
    const { movieID} = req.body;

    try {
      // Check if the user exists
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Add the movie ID, rating, and genre IDs to the user's list
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
            bookmarked: [
            ...user.bookmarked,
            { movieID },
          ],
        },
        { returnDocument: "after" }
      );

      return res.status(200).json({ user: updatedUser, error: null });
    } catch (error) {
      console.error("Error adding movie to list:", error);
      return res
        .status(500)
        .json({ user: null, error: "Internal server error" });
    }
  },

  deleteBookmark: async (req, res) => {
    const { uid, movieID } = req.params;

    try {
      // Check if the user exists
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the index of the movie in the user's list
      const updatedlist = user.bookmarked.filter(
        (item) => item.movieID !== movieID
      );

      // Update the user's document in the database
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        { bookmarked: updatedlist },
        { new: true },
        { returnDocument: "after" }
      );

      return res.status(200).json({ user: updatedUser, error: null });
    } catch (error) {
      console.error("Error deleting movie from list:", error);
      return res
        .status(500)
        .json({ user: null, error: "Internal server error" });
    }
  },
};
