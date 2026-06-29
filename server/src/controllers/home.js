const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../../components\pages\Settings\ImageFileInputPopup.js`));
    // return res.send("API Server for MyMovieList is Up and Running ! Yay");
};

module.exports = {
  getHome: home
};
