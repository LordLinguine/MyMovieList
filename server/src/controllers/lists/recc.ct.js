const UserModel = require("../../mongodb/mongo");

module.exports = {
  getRecommendation: async (req, res) => {
    const { uid } = req.params;

    try {
      // Get user from database
      const user = await UserModel.findOne({ uid });
      const ratedMovies = user.ratedMovies;

      // Tally for each genre
      let genreCounts = {};

      // Counts the time each genre appears
      ratedMovies.forEach((movie) => {
        if (movie.rating >= 7) {
          movie.genres.forEach((genre) => {
            const { genreID } = genre;
            genreCounts[genreID] = (genreCounts[genreID] || 0) + 1;
          });
        }
      });

      // Get top 3 most frequent genres
      const topGenres = Object.keys(genreCounts)
        .sort((a, b) => genreCounts[b] - genreCounts[a])
        .slice(0, 3);

      if (topGenres.length === 0) {
        return res.status(404).json({ message: "No recommended movies found" });
      }

      return res.status(200).json({ topGenres });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
