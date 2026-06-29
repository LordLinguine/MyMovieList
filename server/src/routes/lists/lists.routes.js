const listRouter = require("express-promise-router")();
const { authUser } = require("../../middlewares/auth.mw");

// Controllers
const {
  addList,
  deleteList,
  editList,
} = require("../../controllers/lists/lists.ct");
const { getRecommendation } = require("../../controllers/lists/recc.ct");

const {
  addBookmark,
  deleteBookmark,
} = require("../../controllers/lists/bookmark.ct");

// POST - Add Movie and Rating to List
listRouter.post("/rated/:uid", authUser, addList);

// DELETE - Delete Rated Movie from User's list
listRouter.delete("/rated/:uid/:movieID", authUser, deleteList);

// PATCH - Update a Rated Movie in User's List
listRouter.patch("/rated/:uid/:movieID", authUser, editList);

// GET - Get Top Genres from User's List
listRouter.get("/recommendations/:uid", authUser, getRecommendation);

// POST - Add a Movie to the User's Bookmarked List
listRouter.post("/bookmark/:uid", authUser, addBookmark);

// DELETE - Delete a Movie from the User's Bookmarked List
listRouter.delete("/bookmark/:uid/:movieID", authUser, deleteBookmark);

module.exports = listRouter;
