const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

console.log(`Router loaded`);
router.use(express.urlencoded({ extended: false }));
router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));

router.use("/api", require("./api"));
router.use("/auth", require("./auth"));
router.use("/likes", require("./likes"));
router.use("/friends", require("./friends"));
//for any further routes, access here
//router.use('/routerName', require('./fileName'));

module.exports = router;
