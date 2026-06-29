const UserModel = require("../../mongodb/mongo");

module.exports = {
  addList: async (req, res) => {
    const { uid } = req.params;
    const { movieID, rating, genres } = req.body;

    try {
      // Check if the user exists
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Formatting the Genres
      const formattedGenres = [];
      genres.map((genreID) => formattedGenres.push({ genreID }));

      // Add the movie ID, rating, and genre IDs to the user's list
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          ratedMovies: [
            ...user.ratedMovies,
            { movieID, rating, genres: formattedGenres },
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
  editList: async (req, res) => {
    const { uid, movieID } = req.params;
    const { rating } = req.body; // new rating are sent in the request body

    try {
      // Check if the user exists
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the index of the movie in the user's list
      const movieIndex = user.ratedMovies.findIndex(
        (item) => item.movieID === movieID
      );

      if (movieIndex === -1) {
        return res
          .status(404)
          .json({ error: "Movie not found in user's list" });
      }

      // Update the rating of the movie in the user's list
      user.ratedMovies[movieIndex].rating = rating;

      // Update the user's document in the database
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        { ratedMovies: user.ratedMovies },
        { new: true },
        { returnDocument: "after" }
      );

      return res.status(200).json({ user: updatedUser, error: null });
    } catch (error) {
      console.error("Error editing movie in list:", error);
      return res
        .status(500)
        .json({ user: null, error: "Internal server error" });
    }
  },
  deleteList: async (req, res) => {
    const { uid, movieID } = req.params;

    try {
      // Check if the user exists
      const user = await UserModel.findOne({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the index of the movie in the user's list
      const updatedlist = user.ratedMovies.filter(
        (item) => item.movieID !== movieID
      );

      // Update the user's document in the database
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        { ratedMovies: updatedlist },
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
