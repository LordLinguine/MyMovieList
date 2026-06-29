require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");
const homeController = require("./controllers/home");
const upload = require("./middlewares/upload");
const dbConfig = require("./config/db");

// App Initialization
const app = express();

// App Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.static("public"));
app.use(express.json());

// Rate Limiters
const timeLimit = 1000 * 60;
const maxReq = 100;
const limiter = rateLimiter({
  windowMs: timeLimit,
  max: maxReq * 2,
});
const speedLimiter = slowDown({
  windowMs: timeLimit,
  delayAfter: maxReq,
  delayMs: () => 300,
});

app.use(speedLimiter);
app.use(limiter);

// app.use(upload.single('file'));

// Landing Page Route
app.get("/", (req, res) => {
  res.send("API Server for MyMovieList is Up and Running !");
});

// API Routes / Endpoints
app.use("/v1/api/user", require("./routes/user/user.routes"));
app.use("/v1/api/lists", require("./routes/lists/lists.routes"));

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

/*
// Endpoint to submit a movie rating
router.post('/ratings', (req, res) => {
  const { userId, movieId, rating } = req.body;
  // Here you would handle the logic to store the rating in the database
  // This is just a placeholder
  console.log(`User ${userId} rated movie ${movieId} with a rating of ${rating}`);
  // Send a success response
  res.status(200).json({ message: 'Rating submitted successfully' });
});

// Endpoint to retrieve movie information
router.get('/movies/:movieId', (req, res) => {
  const { movieId } = req.params;
  // Here you would retrieve movie information from the database based on the movieId
  // This is just a placeholder
  const movie = {
    id: movieId,
    title: 'Example Movie',
    description: 'This is an example movie description',
    genres: ['Action', 'Adventure'],
    releaseDate: '2022-01-01',
    averageRating: 4.5
  };
  // Send movie information as response
  res.status(200).json(movie);
});

// Endpoint to generate movie recommendations
router.post('/recommendations', (req, res) => {
  const { userId } = req.body;
  // Here you would generate movie recommendations based on the user's preferences and ratings
  // This is just a placeholder
  const recommendations = [
    { title: 'Recommended Movie 1', description: 'Description of Recommended Movie 1' },
    { title: 'Recommended Movie 2', description: 'Description of Recommended Movie 2' }
  ];
  // Send recommended movies as response
  res.status(200).json(recommendations);
});

module.exports = router;
*/

// Running the Server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});

module.exports = app;
