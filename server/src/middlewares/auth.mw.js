const { verifyAccessToken } = require("../firebase/firebase.functions");

module.exports = {
  authUser: async (req, res, next) => {
    const { uid } = req.params;

    // FIREBASE AUTH
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");
    if (!accessToken)
      return res.status(422).json({
        user: null,
        error: { message: "Must provide credentials." },
      });

    const decodedToken = await verifyAccessToken(accessToken);
    if (uid !== decodedToken?.uid)
      return res.status(401).json({
        user: null,
        error: { message: "Must provide valid credentials." },
      });

    return next();
  },
};
