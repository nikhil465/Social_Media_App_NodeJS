//require the library
const mongoose = require("mongoose");
const env = require("../config/environment");

//connect to db
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);

//acquire the connection
const db = mongoose.connection;

//error
db.on("error", console.error.bind(console, "error connecting to db"));

//up and running then print message
db.once("open", function () {
  console.log("Successfully connected to database");
});

module.exports = db;
